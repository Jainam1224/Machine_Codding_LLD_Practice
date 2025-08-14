import "./style.css";

// Comments Tree Management
class CommentsTree {
  constructor(initialComments) {
    this.comments = initialComments;
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach((listener) => listener(this.comments));
  }

  insertNode(tree, parentCommentId, content) {
    return tree.map((comment) => {
      if (comment.id === parentCommentId) {
        return {
          ...comment,
          replies: [...comment.replies, content],
        };
      } else if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: this.insertNode(comment.replies, parentCommentId, content),
        };
      }
      return comment;
    });
  }

  insertComment(parentCommentId, content) {
    const newComment = {
      id: Date.now(),
      content,
      votes: 0,
      timestamp: new Date().toISOString(),
      replies: [],
    };

    if (parentCommentId) {
      this.comments = this.insertNode(
        this.comments,
        parentCommentId,
        newComment
      );
    } else {
      this.comments = [newComment, ...this.comments];
    }
    this.notify();
  }

  editNode(tree, parentCommentId, content) {
    return tree.map((comment) => {
      if (comment.id === parentCommentId) {
        return {
          ...comment,
          content,
          timestamp: new Date().toISOString(),
        };
      } else if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: this.editNode(comment.replies, parentCommentId, content),
        };
      }
      return comment;
    });
  }

  editComment(parentCommentId, content) {
    this.comments = this.editNode(this.comments, parentCommentId, content);
    this.notify();
  }

  deleteNode(tree, nodeId) {
    return tree.reduce((acc, node) => {
      if (node.id === nodeId) {
        return acc;
      } else if (node.replies && node.replies.length > 0) {
        node.replies = this.deleteNode(node.replies, nodeId);
      }
      return [...acc, node];
    }, []);
  }

  deleteComment(parentCommentId) {
    this.comments = this.deleteNode(this.comments, parentCommentId);
    this.notify();
  }
}

// UI Components
class CommentComponent {
  constructor(comment, commentsTree, parentElement) {
    this.comment = comment;
    this.commentsTree = commentsTree;
    this.parentElement = parentElement;
    this.expand = false;
    this.reply = "";
    this.editMode = false;
    this.editedContent = comment.content;
    this.element = null;
    this.repliesContainer = null;
    this.render();
  }

  render() {
    this.element = document.createElement("div");
    this.element.className = "comment";
    this.element.innerHTML = this.getHTML();
    this.attachEventListeners();
    this.parentElement.appendChild(this.element);
  }

  getHTML() {
    if (!this.editMode) {
      return `
        <p class="comment-content">${this.comment.content}</p>
        <p class="comment-info">Votes: ${this.comment.votes}</p>
        <p class="comment-info">${new Date(
          this.comment.timestamp
        ).toLocaleString()}</p>
        <div class="comment-actions">
          <button class="comment-button" data-action="toggle-expand">
            ${this.expand ? "Hide Replies" : "Reply"}
          </button>
          <button class="comment-button" data-action="edit">Edit</button>
          <button class="comment-button" data-action="delete">Delete</button>
        </div>
        ${this.expand ? this.getReplySection() : ""}
      `;
    } else {
      return `
        <div class="add-comment">
          <textarea class="comment-textarea" rows="3" cols="50">${this.editedContent}</textarea>
          <button class="comment-button" data-action="save-edit">Save Edit</button>
          <button class="comment-button" data-action="cancel-edit">Cancel Edit</button>
        </div>
      `;
    }
  }

  getReplySection() {
    return `
      <div class="add-comment">
        <textarea class="comment-textarea" placeholder="Add a new comment..." rows="3" cols="50"></textarea>
        <button class="comment-button" data-action="submit-reply">Add Comment</button>
      </div>
      <div class="replies-container"></div>
    `;
  }

  attachEventListeners() {
    const buttons = this.element.querySelectorAll("[data-action]");
    buttons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const action = button.getAttribute("data-action");
        this.handleAction(action);
      });
    });

    if (this.expand) {
      const textarea = this.element.querySelector(".add-comment textarea");
      if (textarea) {
        textarea.addEventListener("input", (e) => {
          this.reply = e.target.value;
        });
      }
    }

    if (this.editMode) {
      const textarea = this.element.querySelector(".comment-textarea");
      if (textarea) {
        textarea.addEventListener("input", (e) => {
          this.editedContent = e.target.value;
        });
      }
    }
  }

  handleAction(action) {
    switch (action) {
      case "toggle-expand":
        this.toggleExpand();
        break;
      case "edit":
        this.toggleEditMode();
        break;
      case "delete":
        this.handleDelete();
        break;
      case "submit-reply":
        this.handleReplySubmit();
        break;
      case "save-edit":
        this.handleEditSubmit();
        break;
      case "cancel-edit":
        this.toggleEditMode();
        break;
    }
  }

  toggleExpand() {
    this.expand = !this.expand;
    this.updateView();
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.editedContent = this.comment.content;
    }
    this.updateView();
  }

  handleReplySubmit() {
    if (this.reply.trim()) {
      this.commentsTree.insertComment(this.comment.id, this.reply);
      this.reply = "";
      // Clear the textarea
      const textarea = this.element.querySelector(".add-comment textarea");
      if (textarea) {
        textarea.value = "";
      }
      this.updateView();
    }
  }

  handleEditSubmit() {
    if (this.editedContent.trim()) {
      this.commentsTree.editComment(this.comment.id, this.editedContent);
      this.editMode = false;
      this.updateView();
    }
  }

  handleDelete() {
    this.commentsTree.deleteComment(this.comment.id);
  }

  updateView() {
    // Always re-render when in edit mode or when toggling expand
    if (
      this.editMode ||
      this.expand !== this.element.querySelector(".add-comment")
    ) {
      this.element.innerHTML = this.getHTML();
      this.attachEventListeners();
      if (this.expand) {
        this.renderReplies();
      }
    } else {
      // Update content without re-rendering the entire comment
      const contentElement = this.element.querySelector(".comment-content");
      const actionsElement = this.element.querySelector(".comment-actions");

      if (contentElement) {
        contentElement.textContent = this.comment.content;
      }

      if (actionsElement) {
        actionsElement.innerHTML = `
          <button class="comment-button" data-action="toggle-expand">
            ${this.expand ? "Hide Replies" : "Reply"}
          </button>
          <button class="comment-button" data-action="edit">Edit</button>
          <button class="comment-button" data-action="delete">Delete</button>
        `;
      }

      // Handle expand/collapse
      if (this.expand) {
        if (!this.element.querySelector(".add-comment")) {
          this.element.insertAdjacentHTML("beforeend", this.getReplySection());
        }
        this.renderReplies();
      } else {
        const addComment = this.element.querySelector(".add-comment");
        const repliesContainer =
          this.element.querySelector(".replies-container");
        if (addComment) addComment.remove();
        if (repliesContainer) repliesContainer.remove();
      }

      this.attachEventListeners();
    }
  }

  renderReplies() {
    if (this.expand && this.comment.replies) {
      this.repliesContainer = this.element.querySelector(".replies-container");
      if (this.repliesContainer) {
        this.repliesContainer.innerHTML = "";
        this.comment.replies.forEach((reply) => {
          new CommentComponent(reply, this.commentsTree, this.repliesContainer);
        });
      }
    }
  }

  updateComment(newComment) {
    this.comment = newComment;
    this.updateView();
  }
}

class InputCommentComponent {
  constructor(
    commentsTree,
    parentElement,
    placeholder = "Add a new comment..."
  ) {
    this.commentsTree = commentsTree;
    this.parentElement = parentElement;
    this.value = "";
    this.placeholder = placeholder;
    this.element = null;
    this.render();
  }

  render() {
    this.element = document.createElement("div");
    this.element.className = "add-comment";
    this.element.innerHTML = `
      <textarea class="comment-textarea" placeholder="${this.placeholder}" rows="3" cols="50"></textarea>
      <button class="comment-button">Add Comment</button>
    `;
    this.attachEventListeners();
    this.parentElement.appendChild(this.element);
  }

  attachEventListeners() {
    const textarea = this.element.querySelector("textarea");
    const button = this.element.querySelector("button");

    textarea.addEventListener("input", (e) => {
      this.value = e.target.value;
    });

    button.addEventListener("click", (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }

  handleSubmit() {
    if (this.value.trim()) {
      this.commentsTree.insertComment(null, this.value);
      this.value = "";
      this.element.querySelector("textarea").value = "";
    }
  }
}

class NestedCommentsApp {
  constructor(container, initialComments) {
    this.container = container;
    this.commentsTree = new CommentsTree(initialComments);
    this.commentComponents = new Map();
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <h1>Nested Comments</h1>
      <div class="main-input-container"></div>
      <div class="comments-container"></div>
    `;

    const mainInputContainer = this.container.querySelector(
      ".main-input-container"
    );
    const commentsContainer = this.container.querySelector(
      ".comments-container"
    );

    // Create main input
    new InputCommentComponent(
      this.commentsTree,
      mainInputContainer,
      "Add a new comment..."
    );

    // Subscribe to comments changes
    this.commentsTree.subscribe((comments) => {
      this.renderComments(comments, commentsContainer);
    });

    // Initial render
    this.renderComments(this.commentsTree.comments, commentsContainer);
  }

  renderComments(comments, container) {
    // Only re-render if the number of comments changed or if it's the initial load
    const currentCommentIds = Array.from(this.commentComponents.keys());
    const newCommentIds = comments.map((c) => c.id);

    // Check if we need to re-render
    const needsRerender =
      currentCommentIds.length !== newCommentIds.length ||
      !currentCommentIds.every((id) => newCommentIds.includes(id));

    if (needsRerender) {
      container.innerHTML = "";
      this.commentComponents.clear();

      comments.forEach((comment) => {
        const commentComponent = new CommentComponent(
          comment,
          this.commentsTree,
          container
        );
        this.commentComponents.set(comment.id, commentComponent);
      });
    } else {
      // Just update existing components
      comments.forEach((comment) => {
        const component = this.commentComponents.get(comment.id);
        if (component) {
          component.updateComment(comment);
        }
      });
    }
  }
}

// Initialize the app
async function initApp() {
  try {
    const response = await fetch("/src/data.json");
    const data = await response.json();

    const appContainer = document.getElementById("app");
    new NestedCommentsApp(appContainer, data);
  } catch (error) {
    console.error("Error loading comments data:", error);
    // Fallback to empty comments
    const appContainer = document.getElementById("app");
    new NestedCommentsApp(appContainer, []);
  }
}

// Start the app when DOM is loaded
document.addEventListener("DOMContentLoaded", initApp);
