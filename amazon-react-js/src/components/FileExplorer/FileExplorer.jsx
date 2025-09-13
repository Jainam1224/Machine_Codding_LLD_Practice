import { useState } from "react";
import "./FileExplorer.css";

function FileIcon({ type }) {
  if (type === "folder") {
    return "📁";
  } else if (type === "file") {
    return "📄";
  }
  return "📄";
}

function FileItem({
  item,
  level = 0,
  onToggle,
  onRename,
  onDelete,
  onAddFile,
  onAddFolder,
  expandedPaths,
  editingPath,
  setEditingPath,
  addingType,
  setAddingType,
}) {
  const isExpanded = expandedPaths.has(item.path);
  const isEditing = editingPath === item.path;
  const isAddingFile = addingType === `${item.path}-file`;
  const isAddingFolder = addingType === `${item.path}-folder`;
  const hasChildren = item.children && item.children.length > 0;

  const handleClick = () => {
    if (isEditing || isAddingFile || isAddingFolder) return;
    if (item.type === "folder") {
      onToggle(item.path);
    }
  };

  const handleRename = (e) => {
    e.stopPropagation();
    setEditingPath(item.path);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(item.path);
  };

  const handleAddFile = (e) => {
    e.stopPropagation();
    setAddingType(`${item.path}-file`);
  };

  const handleAddFolder = (e) => {
    e.stopPropagation();
    setAddingType(`${item.path}-folder`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const newName = e.target.value.trim();
      if (newName && newName !== item.name) {
        onRename(item.path, newName);
      }
      setEditingPath(null);
    } else if (e.key === "Escape") {
      setEditingPath(null);
    }
  };

  const handleAddKeyDown = (e) => {
    if (e.key === "Enter") {
      const newName = e.target.value.trim();
      if (newName) {
        if (isAddingFile) {
          onAddFile(item.path, newName);
        } else if (isAddingFolder) {
          onAddFolder(item.path, newName);
        }
      }
      setAddingType(null);
    } else if (e.key === "Escape") {
      setAddingType(null);
    }
  };

  return (
    <div>
      <div
        className="file-item"
        style={{ paddingLeft: `${level * 20}px` }}
        onClick={handleClick}
      >
        <span className="file-icon">
          {hasChildren && item.type === "folder" ? (
            isExpanded ? (
              "📂"
            ) : (
              "📁"
            )
          ) : (
            <FileIcon type={item.type} />
          )}
        </span>

        {isEditing ? (
          <input
            type="text"
            defaultValue={item.name}
            className="file-rename-input"
            onKeyDown={handleKeyDown}
            onBlur={() => setEditingPath(null)}
            autoFocus
          />
        ) : (
          <span className="file-name">{item.name}</span>
        )}

        {!isEditing && !isAddingFile && !isAddingFolder && (
          <div className="file-actions">
            <button
              className="action-btn rename-btn"
              onClick={handleRename}
              title="Rename"
            >
              ✏️
            </button>
            {item.type === "folder" && (
              <>
                <button
                  className="action-btn add-file-btn"
                  onClick={handleAddFile}
                  title="Add File"
                >
                  📄
                </button>
                <button
                  className="action-btn add-folder-btn"
                  onClick={handleAddFolder}
                  title="Add Folder"
                >
                  📁
                </button>
              </>
            )}
            <button
              className="action-btn delete-btn"
              onClick={handleDelete}
              title="Delete"
            >
              🗑️
            </button>
          </div>
        )}
      </div>

      {/* Inline add input for files and folders */}
      {(isAddingFile || isAddingFolder) && (
        <div
          className="file-add-input"
          style={{ paddingLeft: `${(level + 1) * 20}px` }}
        >
          <span className="file-icon">{isAddingFile ? "📄" : "📁"}</span>
          <input
            type="text"
            placeholder={`Enter ${isAddingFile ? "file" : "folder"} name...`}
            className="file-add-input-field"
            onKeyDown={handleAddKeyDown}
            onBlur={() => setAddingType(null)}
            autoFocus
          />
        </div>
      )}

      {item.type === "folder" && isExpanded && hasChildren && (
        <div>
          {item.children.map((child) => (
            <FileItem
              key={child.path}
              item={child}
              level={level + 1}
              onToggle={onToggle}
              onRename={onRename}
              onDelete={onDelete}
              onAddFile={onAddFile}
              onAddFolder={onAddFolder}
              expandedPaths={expandedPaths}
              editingPath={editingPath}
              setEditingPath={setEditingPath}
              addingType={addingType}
              setAddingType={setAddingType}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FileExplorer({ files, onFilesChange }) {
  const [expandedPaths, setExpandedPaths] = useState(new Set());
  const [editingPath, setEditingPath] = useState(null);
  const [addingType, setAddingType] = useState(null);

  const updateFiles = (newFiles) => {
    if (onFilesChange) {
      onFilesChange(newFiles);
    }
  };

  const handleToggle = (path) => {
    const newExpandedPaths = new Set(expandedPaths);
    if (newExpandedPaths.has(path)) {
      newExpandedPaths.delete(path);
    } else {
      newExpandedPaths.add(path);
    }
    setExpandedPaths(newExpandedPaths);
  };

  const handleRename = (path, newName) => {
    const updateItem = (items) => {
      return items.map((item) => {
        if (item.path === path) {
          const newPath =
            path.split("/").slice(0, -1).join("/") + "/" + newName;
          return { ...item, name: newName, path: newPath };
        }
        if (item.children) {
          return { ...item, children: updateItem(item.children) };
        }
        return item;
      });
    };

    const newFiles = updateItem(files);
    updateFiles(newFiles);
    setEditingPath(null);
  };

  const handleDelete = (path) => {
    const removeItem = (items) => {
      return items.filter((item) => {
        if (item.path === path) {
          return false;
        }
        if (item.children) {
          item.children = removeItem(item.children);
        }
        return true;
      });
    };

    const newFiles = removeItem(files);
    updateFiles(newFiles);
  };

  const handleAddFile = (parentPath, fileName) => {
    const newFile = {
      name: fileName,
      type: "file",
      path: parentPath + "/" + fileName,
      size: "0 B",
      modified: new Date().toISOString().split("T")[0],
    };

    const addItem = (items) => {
      return items.map((item) => {
        if (item.path === parentPath) {
          return {
            ...item,
            children: [...(item.children || []), newFile],
          };
        }
        if (item.children) {
          return { ...item, children: addItem(item.children) };
        }
        return item;
      });
    };

    const newFiles = addItem(files);
    updateFiles(newFiles);
    setExpandedPaths(new Set([...expandedPaths, parentPath]));
    setAddingType(null);
  };

  const handleAddFolder = (parentPath, folderName) => {
    const newFolder = {
      name: folderName,
      type: "folder",
      path: parentPath + "/" + folderName,
      children: [],
    };

    const addItem = (items) => {
      return items.map((item) => {
        if (item.path === parentPath) {
          return {
            ...item,
            children: [...(item.children || []), newFolder],
          };
        }
        if (item.children) {
          return { ...item, children: addItem(item.children) };
        }
        return item;
      });
    };

    const newFiles = addItem(files);
    updateFiles(newFiles);
    setExpandedPaths(new Set([...expandedPaths, parentPath]));
    setAddingType(null);
  };

  return (
    <div className="file-explorer">
      <div className="file-tree">
        {files.map((item) => (
          <FileItem
            key={item.path}
            item={item}
            onToggle={handleToggle}
            onRename={handleRename}
            onDelete={handleDelete}
            onAddFile={handleAddFile}
            onAddFolder={handleAddFolder}
            expandedPaths={expandedPaths}
            editingPath={editingPath}
            setEditingPath={setEditingPath}
            addingType={addingType}
            setAddingType={setAddingType}
          />
        ))}
      </div>
    </div>
  );
}
