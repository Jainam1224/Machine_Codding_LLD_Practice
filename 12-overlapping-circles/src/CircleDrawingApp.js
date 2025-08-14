import { Circle } from "./Circle.js";
import { CircleManager } from "./CircleManager.js";
import { EventHandler } from "./EventHandler.js";
import { Renderer } from "./Renderer.js";

/**
 * Main application class that orchestrates all components
 * Uses modern JavaScript concepts: Classes, Modules, Private fields, Getters/Setters
 */
export class CircleDrawingApp {
  #canvas;
  #ctx;
  #circleManager;
  #eventHandler;
  #renderer;
  #animationId;
  #isInitialized = false;
  #resizeTimeout;

  constructor() {
    // Private fields for encapsulation
    this.#canvas = null;
    this.#ctx = null;
    this.#animationId = null;
  }

  /**
   * Initialize the application
   * Sets up all components and starts the render loop
   */
  init() {
    if (this.#isInitialized) {
      console.warn("CircleDrawingApp already initialized");
      return;
    }

    try {
      this.#setupCanvas();
      this.#setupComponents();
      this.#setupEventListeners();
      this.#startRenderLoop();
      this.#isInitialized = true;

      console.log("CircleDrawingApp initialized successfully");
    } catch (error) {
      console.error("Failed to initialize CircleDrawingApp:", error);
      this.#showError("Failed to initialize application");
    }
  }

  /**
   * Setup canvas and context
   * @private
   */
  #setupCanvas() {
    this.#canvas = document.getElementById("canvas");
    if (!this.#canvas) {
      throw new Error("Canvas element not found");
    }

    this.#ctx = this.#canvas.getContext("2d");
    if (!this.#ctx) {
      throw new Error("Failed to get 2D context");
    }

    // Set canvas properties for crisp rendering
    this.#ctx.imageSmoothingEnabled = true;
    this.#ctx.imageSmoothingQuality = "high";
  }

  /**
   * Setup all application components
   * @private
   */
  #setupComponents() {
    // Initialize components with dependency injection
    this.#circleManager = new CircleManager();
    this.#renderer = new Renderer(this.#canvas, this.#ctx);
    this.#eventHandler = new EventHandler(
      this.#canvas,
      this.#circleManager,
      this.#renderer
    );
  }

  /**
   * Setup global event listeners
   * @private
   */
  #setupEventListeners() {
    // Handle window resize
    window.addEventListener("resize", this.#handleResize.bind(this));

    // Handle visibility change for performance
    document.addEventListener(
      "visibilitychange",
      this.#handleVisibilityChange.bind(this)
    );

    // Handle keyboard shortcuts
    document.addEventListener("keydown", this.#handleKeydown.bind(this));
  }

  /**
   * Start the render loop using requestAnimationFrame
   * @private
   */
  #startRenderLoop() {
    const render = () => {
      this.#renderer.render(this.#circleManager.getCircles());
      this.#animationId = requestAnimationFrame(render);
    };
    render();
  }

  /**
   * Handle window resize
   * @private
   */
  #handleResize() {
    // Debounce resize events for performance
    if (this.#resizeTimeout) {
      clearTimeout(this.#resizeTimeout);
    }

    this.#resizeTimeout = setTimeout(() => {
      this.#renderer.handleResize();
    }, 100);
  }

  /**
   * Handle visibility change for performance optimization
   * @private
   */
  #handleVisibilityChange() {
    if (document.hidden) {
      // Pause animation when tab is not visible
      if (this.#animationId) {
        cancelAnimationFrame(this.#animationId);
        this.#animationId = null;
      }
    } else {
      // Resume animation when tab becomes visible
      if (!this.#animationId) {
        this.#startRenderLoop();
      }
    }
  }

  /**
   * Handle keyboard shortcuts
   * @private
   */
  #handleKeydown(event) {
    switch (event.key.toLowerCase()) {
      case "escape":
        this.#circleManager.clearCircles();
        break;
      case "c":
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          this.#circleManager.clearCircles();
        }
        break;
    }
  }

  /**
   * Show error message to user
   * @private
   */
  #showError(message) {
    const errorDiv = document.createElement("div");
    errorDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #f87171;
      color: white;
      padding: 1rem;
      border-radius: 8px;
      z-index: 1000;
      max-width: 300px;
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);

    setTimeout(() => {
      document.body.removeChild(errorDiv);
    }, 5000);
  }

  /**
   * Cleanup method for proper resource management
   */
  destroy() {
    if (this.#animationId) {
      cancelAnimationFrame(this.#animationId);
    }

    if (this.#eventHandler) {
      this.#eventHandler.destroy();
    }

    this.#isInitialized = false;
    console.log("CircleDrawingApp destroyed");
  }

  // Getters for external access
  get canvas() {
    return this.#canvas;
  }

  get circleManager() {
    return this.#circleManager;
  }

  get isInitialized() {
    return this.#isInitialized;
  }
}
