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
    // Form submission
    document.getElementById("todoForm").addEventListener("submit", (e) => {
      e.preventDefault();
      this.addTodo();
    });

    // Event delegation for todo items
    document.getElementById("todoList").addEventListener("click", (e) => {
      if (e.target.classList.contains("delete-btn")) {
        const todoId = parseInt(e.target.closest(".todo-item").dataset.id);
        this.deleteTodo(todoId);
      }
    });

    document.getElementById("todoList").addEventListener("change", (e) => {
      if (e.target.classList.contains("todo-checkbox")) {
        const todoId = parseInt(e.target.closest(".todo-item").dataset.id);
        this.toggleTodo(todoId);
      }
    });
  }

  addTodo() {
    const input = document.getElementById("todoInput");
    const text = input.value.trim();

    if (!text) return;

    const todo = {
      id: Date.now(),
      text: text,
      completed: false,
    };

    this.todos.unshift(todo);
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
    const emptyState = document.getElementById("emptyState");

    // Show/hide empty state
    if (this.todos.length === 0) {
      todoList.style.display = "none";
      emptyState.style.display = "block";
    } else {
      todoList.style.display = "block";
      emptyState.style.display = "none";
    }

    // Clear and rebuild list
    todoList.innerHTML = "";

    this.todos.forEach((todo) => {
      const li = document.createElement("li");
      li.className = "todo-item";
      li.dataset.id = todo.id;

      li.innerHTML = `
        <input type="checkbox" class="todo-checkbox" ${
          todo.completed ? "checked" : ""
        }>
        <span class="todo-text ${todo.completed ? "completed" : ""}">${
        todo.text
      }</span>
        <button class="delete-btn">Delete</button>
      `;

      todoList.appendChild(li);
    });

    this.updateStats();
  }

  updateStats() {
    const total = this.todos.length;
    const completed = this.todos.filter((t) => t.completed).length;
    const pending = total - completed;

    document.getElementById("totalCount").textContent = total;
    document.getElementById("completedCount").textContent = completed;
    document.getElementById("pendingCount").textContent = pending;
  }

  saveTodos() {
    try {
      localStorage.setItem("todos", JSON.stringify(this.todos));
    } catch (error) {
      console.error("Error saving todos:", error);
    }
  }

  loadTodos() {
    try {
      const saved = localStorage.getItem("todos");
      if (saved) {
        this.todos = JSON.parse(saved);
      }
    } catch (error) {
      console.error("Error loading todos:", error);
      this.todos = [];
    }
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new TodoList();
});
