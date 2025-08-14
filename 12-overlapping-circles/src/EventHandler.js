import { Circle } from "./Circle.js";

/**
 * EventHandler class for managing mouse events and circle drawing
 * Uses modern JavaScript concepts: Classes, Private fields, Event handling, Debouncing, Throttling
 */
export class EventHandler {
  #canvas;
  #circleManager;
  #renderer;
  #isDrawing = false;
  #currentCircle = null;
  #startX = 0;
  #startY = 0;
  #mouseButton = null;
  #eventListeners = new Map();
  #throttleTimeout = null;
  #debounceTimeout = null;

  // Mouse button constants
  static LEFT_BUTTON = 0;
  static RIGHT_BUTTON = 2;

  constructor(canvas, circleManager, renderer) {
    this.#canvas = canvas;
    this.#circleManager = circleManager;
    this.#renderer = renderer;

    this.#setupEventListeners();
  }

  /**
   * Setup all event listeners
   * @private
   */
  #setupEventListeners() {
    // Mouse events
    this.#addEventListener("mousedown", this.#handleMouseDown.bind(this));
    this.#addEventListener("mousemove", this.#handleMouseMove.bind(this));
    this.#addEventListener("mouseup", this.#handleMouseUp.bind(this));
    this.#addEventListener("click", this.#handleClick.bind(this));

    // Prevent context menu on right click
    this.#addEventListener("contextmenu", this.#handleContextMenu.bind(this));

    // Touch events for mobile support
    this.#addEventListener("touchstart", this.#handleTouchStart.bind(this));
    this.#addEventListener("touchmove", this.#handleTouchMove.bind(this));
    this.#addEventListener("touchend", this.#handleTouchEnd.bind(this));

    // Keyboard events
    this.#addEventListener("keydown", this.#handleKeyDown.bind(this));
  }

  /**
   * Add event listener with proper cleanup tracking
   * @param {string} event - Event name
   * @param {Function} handler - Event handler
   * @private
   */
  #addEventListener(event, handler) {
    this.#canvas.addEventListener(event, handler);
    this.#eventListeners.set(event, handler);
  }

  /**
   * Get canvas-relative coordinates
   * @param {MouseEvent|TouchEvent} event - Mouse or touch event
   * @returns {Object} - Object with x and y coordinates
   * @private
   */
  #getCanvasCoordinates(event) {
    const rect = this.#canvas.getBoundingClientRect();
    const clientX =
      event.clientX || (event.touches && event.touches[0]?.clientX);
    const clientY =
      event.clientY || (event.touches && event.touches[0]?.clientY);

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }

  /**
   * Handle mouse down event
   * @param {MouseEvent} event - Mouse event
   * @private
   */
  #handleMouseDown(event) {
    event.preventDefault();

    const coords = this.#getCanvasCoordinates(event);
    this.#startX = coords.x;
    this.#startY = coords.y;
    this.#mouseButton = event.button;
    this.#isDrawing = true;

    // Create a new circle at the start position
    this.#currentCircle = new Circle(
      this.#startX,
      this.#startY,
      0,
      this.#mouseButton === EventHandler.LEFT_BUTTON ? "#646cff" : "#f87171"
    );

    // Add the circle to the manager
    this.#circleManager.addCircle(this.#currentCircle);
  }

  /**
   * Handle mouse move event (throttled for performance)
   * @param {MouseEvent} event - Mouse event
   * @private
   */
  #handleMouseMove(event) {
    if (!this.#isDrawing || !this.#currentCircle) return;

    // Throttle mousemove events for better performance
    if (this.#throttleTimeout) return;

    this.#throttleTimeout = setTimeout(() => {
      this.#throttleTimeout = null;
    }, 16); // ~60fps

    const coords = this.#getCanvasCoordinates(event);

    // Calculate radius based on distance from start point
    const deltaX = coords.x - this.#startX;
    const deltaY = coords.y - this.#startY;
    const radius = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Update the current circle's radius
    this.#currentCircle.radius = radius;

    // Update overlap detection when circle properties change
    this.#circleManager.updateOverlapStates();
  }

  /**
   * Handle mouse up event
   * @param {MouseEvent} event - Mouse event
   * @private
   */
  #handleMouseUp(event) {
    if (!this.#isDrawing) return;

    // Debounce mouseup to distinguish between click and drag
    if (this.#debounceTimeout) {
      clearTimeout(this.#debounceTimeout);
    }

    this.#debounceTimeout = setTimeout(() => {
      this.#finishDrawing();
    }, 10);
  }

  /**
   * Handle click event (for clearing circles)
   * @param {MouseEvent} event - Mouse event
   * @private
   */
  #handleClick(event) {
    // Only handle left click with no drag
    if (event.button !== EventHandler.LEFT_BUTTON) return;

    // If we're not drawing, this is a simple click to clear
    if (!this.#isDrawing) {
      this.#circleManager.clearCircles();
      return;
    }

    const coords = this.#getCanvasCoordinates(event);
    const deltaX = coords.x - this.#startX;
    const deltaY = coords.y - this.#startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // If it's a click (no significant movement), clear circles
    if (distance < 5) {
      this.#circleManager.clearCircles();
    }
  }

  /**
   * Handle context menu (right click)
   * @param {MouseEvent} event - Mouse event
   * @private
   */
  #handleContextMenu(event) {
    event.preventDefault();
  }

  /**
   * Handle touch start event
   * @param {TouchEvent} event - Touch event
   * @private
   */
  #handleTouchStart(event) {
    event.preventDefault();

    if (event.touches.length === 1) {
      const touch = event.touches[0];
      const mouseEvent = new MouseEvent("mousedown", {
        clientX: touch.clientX,
        clientY: touch.clientY,
        button: 0, // Treat as left click
      });
      this.#handleMouseDown(mouseEvent);
    }
  }

  /**
   * Handle touch move event
   * @param {TouchEvent} event - Touch event
   * @private
   */
  #handleTouchMove(event) {
    event.preventDefault();

    if (event.touches.length === 1) {
      const touch = event.touches[0];
      const mouseEvent = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
      this.#handleMouseMove(mouseEvent);
    }
  }

  /**
   * Handle touch end event
   * @param {TouchEvent} event - Touch event
   * @private
   */
  #handleTouchEnd(event) {
    event.preventDefault();

    const mouseEvent = new MouseEvent("mouseup", {
      button: 0,
    });
    this.#handleMouseUp(mouseEvent);
  }

  /**
   * Handle key down event
   * @param {KeyboardEvent} event - Keyboard event
   * @private
   */
  #handleKeyDown(event) {
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
   * Finish the drawing process
   * @private
   */
  #finishDrawing() {
    this.#isDrawing = false;
    this.#currentCircle = null;
    this.#mouseButton = null;
  }

  /**
   * Check if currently drawing
   * @returns {boolean}
   */
  isDrawing() {
    return this.#isDrawing;
  }

  /**
   * Get the current drawing circle
   * @returns {Circle|null}
   */
  getCurrentCircle() {
    return this.#currentCircle;
  }

  /**
   * Get drawing statistics
   * @returns {Object}
   */
  getDrawingStats() {
    return {
      isDrawing: this.#isDrawing,
      mouseButton: this.#mouseButton,
      startPosition: { x: this.#startX, y: this.#startY },
      currentCircle: this.#currentCircle?.id || null,
    };
  }

  /**
   * Cleanup method for proper resource management
   */
  destroy() {
    // Remove all event listeners
    this.#eventListeners.forEach((handler, event) => {
      this.#canvas.removeEventListener(event, handler);
    });

    this.#eventListeners.clear();

    // Clear timeouts
    if (this.#throttleTimeout) {
      clearTimeout(this.#throttleTimeout);
    }
    if (this.#debounceTimeout) {
      clearTimeout(this.#debounceTimeout);
    }

    // Reset state
    this.#isDrawing = false;
    this.#currentCircle = null;
    this.#mouseButton = null;
  }
}
