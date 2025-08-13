import "./style.css";
import "./toast.css";
import "./demo.css";
import ToastDemo from "./demo.js";

// Initialize the toast demo
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing demo...");

  // First, test if the toast component works
  import("./toast.js")
    .then(({ default: Toast }) => {
      const toast = new Toast();
      toast.success("Toast component loaded successfully!");

      // Then initialize the demo
      try {
        new ToastDemo();
        console.log("Toast demo initialized successfully");
      } catch (error) {
        console.error("Error initializing toast demo:", error);
      }
    })
    .catch((error) => {
      console.error("Error loading toast component:", error);
    });
});
