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
          id: Date.now(),
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

const TodoItem = ({ todo, onToggle, onDelete }) => {
  const handleToggle = useCallback(
    () => onToggle(todo.id),
    [todo.id, onToggle]
  );
  const handleDelete = useCallback(
    () => onDelete(todo.id),
    [todo.id, onDelete]
  );

  return (
    <div className={`todo-item ${todo.completed ? "completed" : ""}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        className="todo-checkbox"
        aria-label={`Mark "${todo.text}" as ${
          todo.completed ? "incomplete" : "complete"
        }`}
      />
      <span className="todo-text">{todo.text}</span>
      <button
        onClick={handleDelete}
        className="delete-btn"
        aria-label={`Delete "${todo.text}"`}
      >
        Delete
      </button>
    </div>
  );
};
