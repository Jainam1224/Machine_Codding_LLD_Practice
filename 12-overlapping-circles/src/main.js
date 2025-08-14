import "./style.css";
import { CircleDrawingApp } from "./CircleDrawingApp.js";

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const app = new CircleDrawingApp();
  app.init();
});
