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

  return { insertNode };
};

// State Management
class StateManager {
  constructor() {
    this.expandedFolders = new Set();
    this.inputStates = new Map();
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
}

// File Explorer Component
class FileExplorer {
  constructor(explorerData, handleInsertNode, stateManager, onStateChange) {
    this.explorerData = explorerData;
    this.handleInsertNode = handleInsertNode;
    this.stateManager = stateManager;
    this.onStateChange = onStateChange;
  }

  handleNewFolder(e, isFolder) {
    e.stopPropagation();
    this.stateManager.setExpanded(this.explorerData.id, true);
    this.stateManager.setInputState(this.explorerData.id, {
      visible: true,
      isFolder,
    });
    this.onStateChange();
  }

  onAddFolder(e) {
    if (e.keyCode === 13 && e.target.value) {
      this.handleInsertNode(
        this.explorerData.id,
        e.target.value,
        this.stateManager.getInputState(this.explorerData.id).isFolder
      );
      this.stateManager.clearInputState(this.explorerData.id);
      this.onStateChange();
    }
  }

  onInputBlur() {
    this.stateManager.clearInputState(this.explorerData.id);
    this.onStateChange();
  }

  toggleExpand() {
    const isCurrentlyExpanded = this.stateManager.isExpanded(
      this.explorerData.id
    );
    this.stateManager.setExpanded(this.explorerData.id, !isCurrentlyExpanded);
    this.onStateChange();
  }

  render() {
    const container = document.createElement("div");

    if (this.explorerData.isFolder) {
      const folderDiv = document.createElement("div");
      folderDiv.className = "folder";
      folderDiv.addEventListener("click", () => this.toggleExpand());

      const span = document.createElement("span");
      span.textContent = `🗂️ ${this.explorerData.name}`;

      const buttonsDiv = document.createElement("div");
      buttonsDiv.className = "buttons";

      const folderBtn = document.createElement("button");
      folderBtn.textContent = "Folder +";
      folderBtn.addEventListener("click", (e) => this.handleNewFolder(e, true));

      const fileBtn = document.createElement("button");
      fileBtn.textContent = "File +";
      fileBtn.addEventListener("click", (e) => this.handleNewFolder(e, false));

      buttonsDiv.appendChild(folderBtn);
      buttonsDiv.appendChild(fileBtn);
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
          input.addEventListener("keydown", (e) => this.onAddFolder(e));
          input.addEventListener("blur", () => this.onInputBlur());

          inputContainer.appendChild(iconSpan);
          inputContainer.appendChild(input);
          folderLists.appendChild(inputContainer);
        }

        this.explorerData.items.forEach((item) => {
          const itemDiv = document.createElement("div");
          const fileExplorer = new FileExplorer(
            item,
            this.handleInsertNode,
            this.stateManager,
            this.onStateChange
          );
          itemDiv.appendChild(fileExplorer.render());
          folderLists.appendChild(itemDiv);
        });

        container.appendChild(folderLists);
      }
    } else {
      const fileSpan = document.createElement("span");
      fileSpan.className = "file";
      fileSpan.textContent = `📁 ${this.explorerData.name}`;
      container.appendChild(fileSpan);
    }

    return container;
  }
}

// Main App
class App {
  constructor() {
    this.explorerData = JSON.parse(JSON.stringify(explorer)); // Deep clone
    this.traverseTree = useTraverseTree();
    this.stateManager = new StateManager();
    this.init();
  }

  handleInsertNode(folderId, item, isFolder) {
    const finalTree = this.traverseTree.insertNode(
      this.explorerData,
      folderId,
      item,
      isFolder
    );
    this.explorerData = finalTree;
    this.render();
  }

  onStateChange() {
    this.render();
  }

  render() {
    const fileExplorerContainer = document.getElementById("file-explorer");
    fileExplorerContainer.innerHTML = "";

    const fileExplorer = new FileExplorer(
      this.explorerData,
      (folderId, item, isFolder) => {
        this.handleInsertNode(folderId, item, isFolder);
      },
      this.stateManager,
      () => this.onStateChange()
    );

    fileExplorerContainer.appendChild(fileExplorer.render());
  }

  init() {
    this.render();
  }
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new App();
});
