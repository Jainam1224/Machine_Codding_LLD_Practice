import "./style.css";

// A single class to manage both data and UI logic
class NestedCommentsApp {
  constructor(initialComments) {
    this.comments = initialComments;
    this.state = {
      expanded: new Set(),
      editing: null,
    };
    this.container = document.getElementById("app");
    this.commentsContainer = document.getElementById("comments-container");
    this.mainTextarea = document.getElementById("main-textarea");
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.render();
  }

  setupEventListeners() {
    this.container.addEventListener("click", (e) => {
      const button = e.target.closest("[data-action]");
      if (!button) return;

      const action = button.dataset.action;
      const commentElement = e.target.closest(".comment");
      const commentId = commentElement?.dataset.id || null;

      switch (action) {
        case "submit-main-comment":
          this.insertComment(null, this.mainTextarea.value);
          this.mainTextarea.value = "";
          break;
        case "toggle-replies":
          this.state.expanded.has(commentId)
            ? this.state.expanded.delete(commentId)
            : this.state.expanded.add(commentId);
          this.render();
          break;
        case "edit-comment":
          this.state.editing = commentId;
          this.render();
          break;
        case "delete-comment":
          this.deleteComment(commentId);
          break;
        case "save-edit":
          const editInput =
            button.parentNode.querySelector(".comment-textarea");
          if (editInput) {
            this.editComment(commentId, editInput.value);
          }
          break;
        case "cancel-edit":
          this.state.editing = null;
          this.render();
          break;
        case "submit-reply":
          const replyInput =
            button.parentNode.querySelector(".comment-textarea");
          if (replyInput) {
            this.insertComment(commentId, replyInput.value);
          }
          break;
      }
    });
  }

  // --- Data Management Methods (Refactored from CommentsTree) ---

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
    if (!content.trim()) return;
    const newComment = {
      id: Date.now().toString(),
      content: content,
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
    this.render();
  }

  editNode(tree, parentCommentId, content) {
    return tree.map((comment) => {
      if (comment.id === parentCommentId) {
        return {
          ...comment,
          content: content,
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

  editComment(commentId, content) {
    if (!content.trim()) return;
    this.comments = this.editNode(this.comments, commentId, content);
    this.state.editing = null;
    this.render();
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
    this.render();
  }

  // --- Rendering Logic ---

  createCommentHTML(comment) {
    const isEditing = this.state.editing === String(comment.id);
    const isExpanded = this.state.expanded.has(String(comment.id));
    const hasReplies = comment.replies.length > 0;

    let html = "";

    if (isEditing) {
      html = `
        <div class="add-comment">
            <textarea class="comment-textarea" data-id="${comment.id}">${comment.content}</textarea>
            <button class="comment-button" data-action="save-edit">Save</button>
            <button class="comment-button" data-action="cancel-edit">Cancel</button>
        </div>
      `;
    } else {
      html = `
        <p class="comment-content">${comment.content}</p>
        <p class="comment-info">Votes: ${comment.votes} | ${new Date(
        comment.timestamp
      ).toLocaleString()}</p>
        <div class="comment-actions">
            <button class="comment-button" data-action="toggle-replies">${
              hasReplies && !isExpanded
                ? `Replies (${comment.replies.length})`
                : isExpanded
                ? "Hide"
                : "Reply"
            }</button>
            <button class="comment-button" data-action="edit-comment">Edit</button>
            <button class="comment-button" data-action="delete-comment">Delete</button>
        </div>
      `;
    }

    if (isExpanded && !isEditing) {
      html += `
        <div class="add-comment" style="margin-top: 10px;">
            <textarea class="comment-textarea" placeholder="Add a reply..." rows="2"></textarea>
            <button class="comment-button" data-action="submit-reply">Add Reply</button>
        </div>
      `;

      if (hasReplies) {
        html += `<div class="replies-container">${comment.replies
          .map((reply) => this.createCommentHTML(reply))
          .join("")}</div>`;
      }
    }

    return `<div class="comment" data-id="${comment.id}">${html}</div>`;
  }

  render() {
    this.commentsContainer.innerHTML = this.comments
      .map((comment) => this.createCommentHTML(comment))
      .join("");
  }
}

// Initializing the app with a static data import
async function initApp() {
  try {
    const response = await fetch("/src/data.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    new NestedCommentsApp(data);
  } catch (error) {
    console.error("Error loading comments data:", error);
    new NestedCommentsApp([]);
  }
}

document.addEventListener("DOMContentLoaded", initApp);
