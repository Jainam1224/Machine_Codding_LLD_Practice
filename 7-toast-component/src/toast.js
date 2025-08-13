/**
 * Toast Types Enum
 */
export const ToastType = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
};

/**
 * Toast Positions Enum
 */
export const ToastPosition = {
  TOP_RIGHT: "top-right",
  TOP_LEFT: "top-left",
  TOP_CENTER: "top-center",
  BOTTOM_RIGHT: "bottom-right",
  BOTTOM_LEFT: "bottom-left",
  BOTTOM_CENTER: "bottom-center",
};

/**
 * Simple Toast Component
 */
class Toast {
  constructor() {
    this.icons = {
      [ToastType.SUCCESS]: "✅",
      [ToastType.ERROR]: "❌",
      [ToastType.WARNING]: "⚠️",
      [ToastType.INFO]: "ℹ",
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

  show(type, message, position = ToastPosition.TOP_RIGHT, duration = 3000) {
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

  success(message, position = ToastPosition.TOP_RIGHT, duration = 3000) {
    return this.show(ToastType.SUCCESS, message, position, duration);
  }

  error(message, position = ToastPosition.TOP_RIGHT, duration = 3000) {
    return this.show(ToastType.ERROR, message, position, duration);
  }

  warning(message, position = ToastPosition.TOP_RIGHT, duration = 3000) {
    return this.show(ToastType.WARNING, message, position, duration);
  }

  info(message, position = ToastPosition.TOP_RIGHT, duration = 3000) {
    return this.show(ToastType.INFO, message, position, duration);
  }
}

export default Toast;
