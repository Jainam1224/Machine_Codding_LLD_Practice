import Toast from "./toast.js";

/**
 * Simple Demo
 */
class ToastDemo {
  constructor() {
    this.toast = new Toast();
    this.currentPosition = "top-right";
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
              <button class="btn btn-success" data-type="success">Success</button>
              <button class="btn btn-error" data-type="error">Error</button>
              <button class="btn btn-warning" data-type="warning">Warning</button>
              <button class="btn btn-info" data-type="info">Info</button>
            </div>
          </div>

          <div class="demo-section">
            <h2>Position</h2>
            <div class="position-selector">
              <label for="position">Position:</label>
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
      app.innerHTML = html;
    } else {
      document.body.insertAdjacentHTML("beforeend", html);
    }
  }

  addListeners() {
    // Toast buttons
    document.querySelectorAll("[data-type]").forEach(button => {
      button.addEventListener("click", (e) => {
        const type = e.target.dataset.type;
        const messages = {
          success: "Operation completed successfully!",
          error: "An error occurred!",
          warning: "Please check your input!",
          info: "Here's some information!",
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
