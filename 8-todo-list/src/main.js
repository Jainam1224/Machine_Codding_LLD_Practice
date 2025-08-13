// Simple Todo List Application
class TodoList {
  constructor() {
    this.todos = [];
    this.init();
  }

  init() {
    this.loadTodos();
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    // Add todo button
    document.getElementById("addBtn").addEventListener("click", () => {
      this.addTodo();
    });

    // Enter key in input
    document.getElementById("todoInput").addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.addTodo();
      }
    });
  }

  addTodo() {
    const input = document.getElementById("todoInput");
    const text = input.value.trim();

    if (text === "") return;

    const todo = {
      id: Date.now(),
      text: text,
      completed: false,
    };

    this.todos.push(todo);
    this.saveTodos();
    this.render();

    input.value = "";
    input.focus();
  }

  toggleTodo(id) {
    const todo = this.todos.find((t) => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.saveTodos();
      this.render();
    }
  }

  deleteTodo(id) {
    this.todos = this.todos.filter((t) => t.id !== id);
    this.saveTodos();
    this.render();
  }

  render() {
    const todoList = document.getElementById("todoList");
    const emptyMessage = document.getElementById("emptyMessage");

    todoList.innerHTML = "";

    // Show/hide empty message based on todos count
    if (this.todos.length === 0) {
      todoList.style.display = "none";
      emptyMessage.style.display = "block";
    } else {
      todoList.style.display = "block";
      emptyMessage.style.display = "none";
    }

    this.todos.forEach((todo) => {
      const li = document.createElement("li");
      li.className = "todo-item";

      li.innerHTML = `
        <input type="checkbox" class="todo-checkbox" ${
          todo.completed ? "checked" : ""
        }>
        <span class="todo-text ${todo.completed ? "completed" : ""}">${
        todo.text
      }</span>
        <button class="delete-btn">Delete</button>
      `;

      // Bind events
      const checkbox = li.querySelector(".todo-checkbox");
      const deleteBtn = li.querySelector(".delete-btn");

      checkbox.addEventListener("change", () => {
        this.toggleTodo(todo.id);
      });

      deleteBtn.addEventListener("click", () => {
        this.deleteTodo(todo.id);
      });

      todoList.appendChild(li);
    });

    this.updateStats();
  }

  updateStats() {
    const total = this.todos.length;
    const completed = this.todos.filter((t) => t.completed).length;

    document.getElementById("totalCount").textContent = total;
    document.getElementById("completedCount").textContent = completed;
  }

  saveTodos() {
    localStorage.setItem("todos", JSON.stringify(this.todos));
  }

  loadTodos() {
    const saved = localStorage.getItem("todos");
    if (saved) {
      this.todos = JSON.parse(saved);
    }
  }
}

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  new TodoList();
});
