/**
 * Simple Toast Component
 */
class Toast {
  constructor() {
    this.icons = {
      success: "✓",
      error: "✕",
      warning: "⚠",
      info: "ℹ",
    };
    this.createContainer();
  }

  createContainer() {
    if (!document.getElementById("toast-container")) {
      const container = document.createElement("div");
      container.id = "toast-container";
      container.className = "toast-container";
      document.body.appendChild(container);
    }
  }

  show(type, message, position = "top-right", duration = 3000) {
    const toast = document.createElement("div");
    toast.className = `toast ${type} ${position}`;

    toast.innerHTML = `
      <span class="toast-icon">${this.icons[type]}</span>
      <span class="toast-message">${message}</span>
      <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;

    const container = document.getElementById("toast-container");
    container.appendChild(toast);

    if (duration > 0) {
      setTimeout(() => {
        toast.remove();
      }, duration);
    }

    return toast;
  }

  success(message, position = "top-right", duration = 3000) {
    return this.show("success", message, position, duration);
  }

  error(message, position = "top-right", duration = 3000) {
    return this.show("error", message, position, duration);
  }

  warning(message, position = "top-right", duration = 3000) {
    return this.show("warning", message, position, duration);
  }

  info(message, position = "top-right", duration = 3000) {
    return this.show("info", message, position, duration);
  }
}

export default Toast;
