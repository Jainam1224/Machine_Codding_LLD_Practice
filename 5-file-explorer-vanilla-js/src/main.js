// File Explorer Data Structure
const explorer = {
  id: "1",
  name: "root",
  isFolder: true,
  items: [
    {
      id: "2",
      name: "public",
      isFolder: true,
      items: [
        {
          id: "3",
          name: "public nested 1",
          isFolder: true,
          items: [
            {
              id: "4",
              name: "index.html",
              isFolder: false,
              items: [],
            },
            {
              id: "5",
              name: "hello.html",
              isFolder: false,
              items: [],
            },
          ],
        },
        {
          id: "6",
          name: "public_nested_file",
          isFolder: false,
          items: [],
        },
      ],
    },
    {
      id: "7",
      name: "src",
      isFolder: true,
      items: [
        {
          id: "8",
          name: "App.js",
          isFolder: false,
          items: [],
        },
        {
          id: "9",
          name: "Index.js",
          isFolder: false,
          items: [],
        },
        {
          id: "10",
          name: "styles.css",
          isFolder: false,
          items: [],
        },
      ],
    },
    {
      id: "11",
      name: "package.json",
      isFolder: false,
      items: [],
    },
  ],
};

// Tree Traversal Utility
const useTraverseTree = () => {
  const insertNode = (tree, folderId, item, isFolder) => {
    if (tree.id === folderId && tree.isFolder) {
      tree.items.unshift({
        id: new Date().getTime().toString(),
        name: item,
        isFolder: isFolder,
        items: [],
      });
      return tree;
    }

    tree.items = tree.items.map((node) => {
      return insertNode(node, folderId, item, isFolder);
    });

    return tree;
  };

  const deleteNode = (tree, nodeId) => {
    for (let i = 0; i < tree.items.length; i++) {
      const node = tree.items[i];
      if (node.id === nodeId) {
        tree.items.splice(i, 1);
        return tree;
      }
      if (node.isFolder) {
        deleteNode(node, nodeId);
      }
    }
    return tree;
  };

  const editNode = (tree, nodeId, newName) => {
    if (tree.id === nodeId) {
      tree.name = newName;
      return tree;
    }

    if (tree.isFolder) {
      tree.items = tree.items.map((node) => {
        return editNode(node, nodeId, newName);
      });
    }
    return tree;
  };

  return { insertNode, deleteNode, editNode };
};

// State Management
class StateManager {
  constructor() {
    this.expandedFolders = new Set();
    this.inputStates = new Map();
    this.editState = new Map();
  }

  isExpanded(folderId) {
    return this.expandedFolders.has(folderId);
  }

  setExpanded(folderId, expanded) {
    if (expanded) {
      this.expandedFolders.add(folderId);
    } else {
      this.expandedFolders.delete(folderId);
    }
  }

  getInputState(folderId) {
    return (
      this.inputStates.get(folderId) || { visible: false, isFolder: false }
    );
  }

  setInputState(folderId, state) {
    this.inputStates.set(folderId, state);
  }

  clearInputState(folderId) {
    this.inputStates.delete(folderId);
  }

  isEditing(nodeId) {
    return this.editState.has(nodeId);
  }

  setEditingNode(nodeId, editing) {
    if (editing) {
      this.editState.set(nodeId, true);
    } else {
      this.editState.delete(nodeId);
    }
  }
}

// File Explorer Component
class FileExplorer {
  constructor(
    explorerData,
    handleInsertNode,
    handleDeleteNode,
    handleEditNode,
    stateManager,
    onStateChange
  ) {
    this.explorerData = explorerData;
    this.handleInsertNode = handleInsertNode;
    this.handleDeleteNode = handleDeleteNode;
    this.handleEditNode = handleEditNode;
    this.stateManager = stateManager;
    this.onStateChange = onStateChange;
  }

  render() {
    const container = document.createElement("div");
    container.setAttribute("data-id", this.explorerData.id);

    if (this.stateManager.isEditing(this.explorerData.id)) {
      const editInputContainer = document.createElement("div");
      editInputContainer.className = "inputContainer";
      const iconSpan = document.createElement("span");
      iconSpan.textContent = this.explorerData.isFolder ? "🗂️" : "📁";
      const input = document.createElement("input");
      input.type = "text";
      input.className = "inputContainer__input";
      input.autofocus = true;
      input.value = this.explorerData.name;
      input.setAttribute("data-action", "save-edit");
      input.setAttribute("data-id", this.explorerData.id);

      editInputContainer.appendChild(iconSpan);
      editInputContainer.appendChild(input);
      container.appendChild(editInputContainer);
    } else if (this.explorerData.isFolder) {
      const folderDiv = document.createElement("div");
      folderDiv.className = "folder";
      folderDiv.setAttribute("data-action", "toggle");
      folderDiv.setAttribute("data-id", this.explorerData.id);

      const span = document.createElement("span");
      span.textContent = `🗂️ ${this.explorerData.name}`;

      const buttonsDiv = document.createElement("div");
      buttonsDiv.className = "buttons";

      const folderBtn = document.createElement("button");
      folderBtn.textContent = "Folder +";
      folderBtn.setAttribute("data-action", "add-folder");
      folderBtn.setAttribute("data-id", this.explorerData.id);

      const fileBtn = document.createElement("button");
      fileBtn.textContent = "File +";
      fileBtn.setAttribute("data-action", "add-file");
      fileBtn.setAttribute("data-id", this.explorerData.id);

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.setAttribute("data-action", "edit");
      editBtn.setAttribute("data-id", this.explorerData.id);

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.setAttribute("data-action", "delete");
      deleteBtn.setAttribute("data-id", this.explorerData.id);

      buttonsDiv.appendChild(folderBtn);
      buttonsDiv.appendChild(fileBtn);
      buttonsDiv.appendChild(editBtn);
      buttonsDiv.appendChild(deleteBtn);
      folderDiv.appendChild(span);
      folderDiv.appendChild(buttonsDiv);
      container.appendChild(folderDiv);

      const isExpanded = this.stateManager.isExpanded(this.explorerData.id);
      if (isExpanded) {
        const folderLists = document.createElement("div");
        folderLists.className = "folder-lists";

        const inputState = this.stateManager.getInputState(
          this.explorerData.id
        );
        if (inputState.visible) {
          const inputContainer = document.createElement("div");
          inputContainer.className = "inputContainer";

          const iconSpan = document.createElement("span");
          iconSpan.textContent = inputState.isFolder ? "🗂️" : "📁";

          const input = document.createElement("input");
          input.type = "text";
          input.className = "inputContainer__input";
          input.autofocus = true;
          input.setAttribute("data-action", "add-node");
          input.setAttribute("data-id", this.explorerData.id);

          inputContainer.appendChild(iconSpan);
          inputContainer.appendChild(input);
          folderLists.appendChild(inputContainer);
        }

        this.explorerData.items.forEach((item) => {
          const itemDiv = document.createElement("div");
          const fileExplorer = new FileExplorer(
            item,
            this.handleInsertNode,
            this.handleDeleteNode,
            this.handleEditNode,
            this.stateManager,
            this.onStateChange
          );
          itemDiv.appendChild(fileExplorer.render());
          folderLists.appendChild(itemDiv);
        });

        container.appendChild(folderLists);
      }
    } else {
      const fileDiv = document.createElement("div");
      fileDiv.className = "file";

      const span = document.createElement("span");
      span.textContent = `📁 ${this.explorerData.name}`;

      const buttonsDiv = document.createElement("div");
      buttonsDiv.className = "buttons";

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.setAttribute("data-action", "edit");
      editBtn.setAttribute("data-id", this.explorerData.id);

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.setAttribute("data-action", "delete");
      deleteBtn.setAttribute("data-id", this.explorerData.id);

      buttonsDiv.appendChild(editBtn);
      buttonsDiv.appendChild(deleteBtn);
      fileDiv.appendChild(span);
      fileDiv.appendChild(buttonsDiv);
      container.appendChild(fileDiv);
    }

    return container;
  }
}

// Main App
class App {
  constructor() {
    this.explorerData = JSON.parse(JSON.stringify(explorer));
    this.traverseTree = useTraverseTree();
    this.stateManager = new StateManager();
    this.container = document.getElementById("file-explorer");
    this.init();
  }

  handleInsertNode(folderId, item, isFolder) {
    this.explorerData = this.traverseTree.insertNode(
      this.explorerData,
      folderId,
      item,
      isFolder
    );
    this.render();
  }

  handleDeleteNode(nodeId) {
    this.explorerData = this.traverseTree.deleteNode(this.explorerData, nodeId);
    this.render();
  }

  handleEditNode(nodeId, newName) {
    this.explorerData = this.traverseTree.editNode(
      this.explorerData,
      nodeId,
      newName
    );
    this.render();
  }

  onStateChange() {
    this.render();
  }

  handleAction(event) {
    const target = event.target;
    const action = target.dataset.action;
    const id = target.dataset.id;

    if (!action || !id) return;

    // New and simplified logic for edit and add inputs
    if (
      target.tagName === "INPUT" &&
      event.type === "keydown" &&
      event.keyCode === 13
    ) {
      event.preventDefault(); // Prevents blur event from firing
      const newName = target.value;
      if (action === "add-node") {
        this.handleInsertNode(
          id,
          newName,
          this.stateManager.getInputState(id).isFolder
        );
        this.stateManager.clearInputState(id);
      } else if (action === "save-edit") {
        this.handleEditNode(id, newName);
        this.stateManager.setEditingNode(id, false);
      }
      this.render();
      return;
    }

    if (target.tagName === "INPUT" && event.type === "blur") {
      const newName = target.value;
      if (action === "add-node") {
        this.stateManager.clearInputState(id);
      } else if (action === "save-edit") {
        // Save the value on blur
        this.handleEditNode(id, newName);
        this.stateManager.setEditingNode(id, false);
      }
      this.render();
      return;
    }

    switch (action) {
      case "toggle":
        this.stateManager.setExpanded(id, !this.stateManager.isExpanded(id));
        this.render();
        break;
      case "add-folder":
      case "add-file":
        this.stateManager.setExpanded(id, true);
        this.stateManager.setInputState(id, {
          visible: true,
          isFolder: action === "add-folder",
        });
        this.render();
        break;
      case "edit":
        this.stateManager.setEditingNode(id, true);
        this.render();
        break;
      case "delete":
        this.handleDeleteNode(id);
        break;
    }
  }

  render() {
    this.container.innerHTML = "";
    const fileExplorer = new FileExplorer(
      this.explorerData,
      (folderId, item, isFolder) =>
        this.handleInsertNode(folderId, item, isFolder),
      (nodeId) => this.handleDeleteNode(nodeId),
      (nodeId, newName) => this.handleEditNode(nodeId, newName),
      this.stateManager,
      () => this.onStateChange()
    );

    this.container.appendChild(fileExplorer.render());

    // Focus on the input field after rendering if it exists
    const input = this.container.querySelector("input[autofocus]");
    if (input) {
      input.focus();
    }
  }

  init() {
    // One single event listener for the entire container
    this.container.addEventListener("click", (event) =>
      this.handleAction(event)
    );
    this.container.addEventListener("keydown", (event) =>
      this.handleAction(event)
    );
    this.container.addEventListener(
      "blur",
      (event) => this.handleAction(event),
      true
    ); // Use capture phase for blur
    this.render();
  }
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new App();
});
