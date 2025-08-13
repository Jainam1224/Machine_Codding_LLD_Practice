/**
 * Simple Toast Component - Clean implementation for LLD interviews
 */
class Toast {
  constructor() {
    this.toasts = [];
    this.icons = {
      success: "✓",
      error: "✕",
      warning: "⚠",
      info: "ℹ",
    };
    this.init();
  }

  init() {
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
    this.toasts.push(toast);

    // Auto dismiss
    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(toast);
      }, duration);
    }

    return toast;
  }

  dismiss(toast) {
    if (toast && toast.parentNode) {
      toast.classList.add("toast-dismissing");
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
          this.toasts = this.toasts.filter((t) => t !== toast);
        }
      }, 300);
    }
  }

  // Convenience methods
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

  dismissAll() {
    this.toasts.forEach((toast) => this.dismiss(toast));
  }
}

export default Toast;
