import Toast from "./toast.js";

/**
 * Simple Demo class for LLD interview
 * Demonstrates: Basic toast functionality with position selection
 */
class ToastDemo {
  constructor() {
    this.toast = new Toast();
    this.currentPosition = "top-right";
    this.init();
  }

  init() {
    this.createDemoInterface();
    this.setupEventListeners();
  }

  createDemoInterface() {
    const demoHTML = `
      <div class="demo-container">
        <header class="demo-header">
          <h1>🍞 Toast Component</h1>
          <p>Simple toast notification system for LLD interviews</p>
        </header>

        <div class="demo-content">
          <div class="demo-section">
            <h2>Quick Actions</h2>
            <div class="button-group">
              <button class="btn btn-success" data-action="success">Success Toast</button>
              <button class="btn btn-error" data-action="error">Error Toast</button>
              <button class="btn btn-warning" data-action="warning">Warning Toast</button>
              <button class="btn btn-info" data-action="info">Info Toast</button>
            </div>
          </div>

          <div class="demo-section">
            <h2>Position Selection</h2>
            <div class="position-selector">
              <label for="position">Choose Position:</label>
              <select id="position">
                <option value="top-right">Top Right</option>
                <option value="top-left">Top Left</option>
                <option value="top-center">Top Center</option>
                <option value="bottom-right">Bottom Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="bottom-center">Bottom Center</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    `;

    const app = document.getElementById("app");
    if (app) {
      app.innerHTML = demoHTML;
    } else {
      document.body.insertAdjacentHTML("beforeend", demoHTML);
    }
  }

  setupEventListeners() {
    // Quick action buttons
    document.querySelectorAll("[data-action]").forEach((button) => {
      button.addEventListener("click", (e) => {
        const action = e.target.dataset.action;
        const messages = {
          success: "Operation completed successfully!",
          error: "An error occurred while processing your request.",
          warning: "Please review your input before proceeding.",
          info: "Here is some helpful information for you.",
        };

        this.toast[action](messages[action], this.currentPosition);
      });
    });

    // Position change handler
    document.getElementById("position").addEventListener("change", (e) => {
      this.currentPosition = e.target.value;
    });
  }
}

export default ToastDemo;
