import { useState, useCallback, useMemo } from "react";
import "./TodoList.css";

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  const addTodo = useCallback(() => {
    const trimmedTodo = newTodo.trim();
    if (trimmedTodo) {
      setTodos((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          text: trimmedTodo,
          completed: false,
        },
      ]);
      setNewTodo("");
    }
  }, [newTodo]);

  const toggleTodo = useCallback((id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const deleteTodo = useCallback((id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  const editTodo = useCallback((id, newText) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, text: newText } : todo))
    );
  }, []);

  const completedCount = useMemo(
    () => todos.filter((todo) => todo.completed).length,
    [todos]
  );

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter") {
        addTodo();
      }
    },
    [addTodo]
  );

  return (
    <div className="todo-container">
      <h2>Todo List</h2>

      <div className="todo-input-section">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new todo..."
          className="todo-input"
        />
        <button onClick={addTodo} className="add-btn">
          Add
        </button>
      </div>

      <div className="todo-list">
        {todos.length === 0 ? (
          <p className="empty-message">No todos yet. Add one above!</p>
        ) : (
          todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
            />
          ))
        )}
      </div>

      {todos.length > 0 && (
        <div className="todo-stats">
          <p>
            Total: {todos.length} | Completed: {completedCount}
          </p>
        </div>
      )}
    </div>
  );
}

const TodoItem = ({ todo, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleToggle = useCallback(
    () => onToggle(todo.id),
    [todo.id, onToggle]
  );

  const handleDelete = useCallback(
    () => onDelete(todo.id),
    [todo.id, onDelete]
  );

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setEditText(todo.text);
  }, [todo.text]);

  const handleSave = useCallback(() => {
    const trimmedText = editText.trim();
    if (trimmedText && trimmedText !== todo.text) {
      onEdit(todo.id, trimmedText);
    }
    setIsEditing(false);
  }, [editText, todo.id, todo.text, onEdit]);

  const handleCancel = useCallback(() => {
    setEditText(todo.text);
    setIsEditing(false);
  }, [todo.text]);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter") {
        handleSave();
      } else if (e.key === "Escape") {
        handleCancel();
      }
    },
    [handleSave, handleCancel]
  );

  return (
    <div className={`todo-item ${todo.completed ? "completed" : ""}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        className="todo-checkbox"
      />
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyPress}
          onBlur={handleSave}
          className="edit-input"
          autoFocus
        />
      ) : (
        <span className="todo-text" onClick={handleEdit}>
          {todo.text}
        </span>
      )}
      <div className="todo-actions">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="edit-btn">
              Save
            </button>
            <button onClick={handleCancel} className="delete-btn">
              Cancel
            </button>
          </>
        ) : (
          <>
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
  );
};
