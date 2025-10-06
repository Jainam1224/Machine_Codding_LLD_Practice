import { useState } from "react";
import "./App.css";

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
          name: "public nested folder",
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
          name: "public nested file",
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
          name: "index.js",
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

function useTraverseTree() {
  const insertNode = (tree, folderId, item, isFolder) => {
    if (tree.id === folderId && tree.isFolder) {
      return {
        ...tree,
        items: [
          {
            id: new Date().getTime(),
            name: item,
            isFolder: isFolder,
            items: [],
          },
          ...tree.items,
        ],
      };
    }

    if (tree.items && tree.items.length > 0) {
      const updatedItems = tree.items.map((childNode) =>
        insertNode(childNode, folderId, item, isFolder)
      );

      return {
        ...tree,
        items: updatedItems,
      };
    }

    return tree;
  };

  const updateNode = (tree, nodeId, newName) => {
    if (tree.id === nodeId) {
      return {
        ...tree,
        name: newName,
      };
    }

    if (tree.items && tree.items.length > 0) {
      const updatedItems = tree.items.map((childNode) =>
        updateNode(childNode, nodeId, newName)
      );

      return {
        ...tree,
        items: updatedItems,
      };
    }

    return tree;
  };

  const deleteNode = (tree, nodeId) => {
    if (tree.items && tree.items.length > 0) {
      const filteredItems = tree.items.filter(
        (childNode) => childNode.id !== nodeId
      );

      if (filteredItems.length !== tree.items.length) {
        return {
          ...tree,
          items: filteredItems,
        };
      }

      const updatedItems = tree.items.map((childNode) =>
        deleteNode(childNode, nodeId)
      );

      return {
        ...tree,
        items: updatedItems,
      };
    }

    return tree;
  };

  return { insertNode, updateNode, deleteNode };
}

function FileExplorer({
  explorerData,
  handleInsertNode,
  handleUpdateNode,
  handleDeleteNode,
}) {
  const [expand, setExpand] = useState(false);
  const [showInput, setShowInput] = useState({
    visible: false,
    isFolder: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(explorerData.name);

  const handleNewFolder = (e, isFolder) => {
    e.stopPropagation();
    setExpand(true);
    setShowInput({ visible: true, isFolder });
  };

  const onAddNode = (e) => {
    if (e.key === "Enter" && e.target.value) {
      handleInsertNode(explorerData.id, e.target.value, showInput.isFolder);
      setShowInput({ ...showInput, visible: false });
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditValue(explorerData.name);
  };

  const handleSaveEdit = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      handleUpdateNode(explorerData.id, e.target.value.trim());
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditValue(explorerData.name);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    handleDeleteNode(explorerData.id);
  };

  if (explorerData.isFolder) {
    return (
      <div>
        <div className="folder" onClick={() => setExpand(!expand)}>
          {isEditing ? (
            <div className="edit-container">
              <span>🗂️</span>
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleSaveEdit}
                onBlur={handleCancelEdit}
                autoFocus
                className="edit-input"
              />
            </div>
          ) : (
            <span>🗂️ {explorerData.name}</span>
          )}
          <div className="buttons">
            {!isEditing && (
              <>
                <button onClick={(e) => handleNewFolder(e, true)}>
                  Folder +
                </button>
                <button onClick={(e) => handleNewFolder(e, false)}>
                  File +
                </button>
                <button onClick={handleEdit} className="edit-btn">
                  Edit
                </button>
                <button onClick={handleDelete} className="delete-btn">
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        {expand && (
          <div className="folder-lists">
            {showInput.visible && (
              <div className="inputContainer">
                <span>{showInput.isFolder ? "🗂️" : "📄"}</span>
                <input
                  type="text"
                  autoFocus
                  value={showInput.value}
                  onKeyDown={onAddNode}
                  onBlur={() => setShowInput({ ...showInput, visible: false })}
                />
              </div>
            )}
            {explorerData.items.map((exp) => {
              return (
                <FileExplorer
                  key={exp.id}
                  explorerData={exp}
                  handleInsertNode={handleInsertNode}
                  handleUpdateNode={handleUpdateNode}
                  handleDeleteNode={handleDeleteNode}
                />
              );
            })}
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className="file-container">
        {isEditing ? (
          <div className="edit-container">
            <span>📁</span>
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleSaveEdit}
              onBlur={handleCancelEdit}
              autoFocus
              className="edit-input"
            />
          </div>
        ) : (
          <span className="file">📁 {explorerData.name}</span>
        )}
        {!isEditing && (
          <div className="file-buttons">
            <button onClick={handleEdit} className="edit-btn">
              Edit
            </button>
            <button onClick={handleDelete} className="delete-btn">
              Delete
            </button>
          </div>
        )}
      </div>
    );
  }
}

function App() {
  const [explorerData, setExplorerData] = useState(explorer);
  const { insertNode, updateNode, deleteNode } = useTraverseTree();

  const handleInsertNode = (folderId, item, isFolder) => {
    const finalTree = insertNode(explorerData, folderId, item, isFolder);
    setExplorerData(finalTree);
  };

  const handleUpdateNode = (nodeId, newName) => {
    const finalTree = updateNode(explorerData, nodeId, newName);
    setExplorerData(finalTree);
  };

  const handleDeleteNode = (nodeId) => {
    const finalTree = deleteNode(explorerData, nodeId);
    setExplorerData(finalTree);
  };

  return (
    <div>
      <h1>File Explorer</h1>
      <FileExplorer
        explorerData={explorerData}
        handleInsertNode={handleInsertNode}
        handleUpdateNode={handleUpdateNode}
        handleDeleteNode={handleDeleteNode}
      />
    </div>
  );
}

export default App;
