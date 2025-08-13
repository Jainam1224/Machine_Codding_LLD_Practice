import Toast, { ToastType, ToastPosition } from "./toast.js";

/**
 * Simple Demo
 */
class ToastDemo {
  constructor() {
    this.toast = new Toast();
    this.currentPosition = ToastPosition.TOP_RIGHT;
    this.setup();
  }

  setup() {
    this.createInterface();
    this.addListeners();
  }

  createInterface() {
    const html = `
      <div class="demo-container">
        <header class="demo-header">
          <h1>🍞 Toast Component</h1>
          <p>Simple toast notification system</p>
        </header>

        <div class="demo-content">
          <div class="demo-section">
            <h2>Toast Types</h2>
            <div class="button-group">
              <button class="btn btn-success" data-type="${ToastType.SUCCESS}">Success</button>
              <button class="btn btn-error" data-type="${ToastType.ERROR}">Error</button>
              <button class="btn btn-warning" data-type="${ToastType.WARNING}">Warning</button>
              <button class="btn btn-info" data-type="${ToastType.INFO}">Info</button>
            </div>
          </div>

          <div class="demo-section">
            <h2>Select Toast Position</h2>
            <div class="position-selector">
              <label for="position">Position:</label>
              <select id="position">
                <option value="${ToastPosition.TOP_RIGHT}">Top Right</option>
                <option value="${ToastPosition.TOP_LEFT}">Top Left</option>
                <option value="${ToastPosition.TOP_CENTER}">Top Center</option>
                <option value="${ToastPosition.BOTTOM_RIGHT}">Bottom Right</option>
                <option value="${ToastPosition.BOTTOM_LEFT}">Bottom Left</option>
                <option value="${ToastPosition.BOTTOM_CENTER}">Bottom Center</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    `;

    const app = document.getElementById("app");
    if (app) {
      app.innerHTML = html;
    } else {
      // Create app container if it doesn't exist (fallback)
      const appContainer = document.createElement("div");
      appContainer.id = "app";
      appContainer.innerHTML = html;
      document.body.appendChild(appContainer);
    }
  }

  addListeners() {
    // Toast buttons
    document.querySelectorAll("[data-type]").forEach((button) => {
      button.addEventListener("click", (e) => {
        const type = e.target.dataset.type;
        const messages = {
          [ToastType.SUCCESS]: "Operation completed successfully!",
          [ToastType.ERROR]: "An error occurred!",
          [ToastType.WARNING]: "Please check your input!",
          [ToastType.INFO]: "Here's some information!",
        };
        this.toast[type](messages[type], this.currentPosition);
      });
    });

    // Position selector
    document.getElementById("position").addEventListener("change", (e) => {
      this.currentPosition = e.target.value;
    });
  }
}

export default ToastDemo;
