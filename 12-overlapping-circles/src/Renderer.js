/**
 * Renderer class for efficient canvas rendering
 * Uses modern JavaScript concepts: Classes, Private fields, Object pooling, Optimization techniques
 */
export class Renderer {
  #canvas;
  #ctx;
  #lastRenderTime = 0;
  #frameCount = 0;
  #fps = 60;
  #dirtyRegions = new Set();
  #objectPool = new Map();
  #renderStats = {
    frames: 0,
    averageFPS: 0,
    lastFrameTime: 0,
  };

  constructor(canvas, ctx) {
    this.#canvas = canvas;
    this.#ctx = ctx;
    this.#setupContext();
  }

  /**
   * Setup canvas context with optimal settings
   * @private
   */
  #setupContext() {
    // Enable hardware acceleration
    this.#ctx.imageSmoothingEnabled = true;
    this.#ctx.imageSmoothingQuality = "high";

    // Set composite operation for better blending
    this.#ctx.globalCompositeOperation = "source-over";

    // Enable alpha channel
    this.#ctx.globalAlpha = 1.0;
  }

  /**
   * Main render method
   * @param {Circle[]} circles - Array of circles to render
   */
  render(circles = []) {
    const startTime = performance.now();

    // Clear the canvas
    this.#clearCanvas();

    // Render all circles
    circles.forEach((circle) => {
      this.#renderCircle(circle);
    });

    // Update render statistics
    this.#updateRenderStats(startTime);
  }

  /**
   * Clear the canvas efficiently
   * @private
   */
  #clearCanvas() {
    // Use clearRect for better performance than fillRect
    this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
  }

  /**
   * Render a single circle with optimization
   * @param {Circle} circle - Circle to render
   * @private
   */
  #renderCircle(circle) {
    if (!circle || circle.radius <= 0) return;

    const { x, y, radius, color, isOverlapping } = circle;

    // Save context state
    this.#ctx.save();

    // Set up gradient for better visual appeal
    const gradient = this.#createCircleGradient(
      x,
      y,
      radius,
      color,
      isOverlapping
    );

    // Apply gradient
    this.#ctx.fillStyle = gradient;
    this.#ctx.strokeStyle = this.#getStrokeColor(color, isOverlapping);
    this.#ctx.lineWidth = 2;

    // Draw the circle
    this.#ctx.beginPath();
    this.#ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this.#ctx.fill();
    this.#ctx.stroke();

    // Add glow effect for overlapping circles
    if (isOverlapping) {
      this.#addGlowEffect(x, y, radius);
    }

    // Add center point indicator
    this.#drawCenterPoint(x, y);

    // Restore context state
    this.#ctx.restore();
  }

  /**
   * Create gradient for circle
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {number} radius - Radius
   * @param {string} color - Base color
   * @param {boolean} isOverlapping - Whether circle is overlapping
   * @returns {CanvasGradient} - Gradient object
   * @private
   */
  #createCircleGradient(x, y, radius, color, isOverlapping) {
    const gradient = this.#ctx.createRadialGradient(
      x - radius * 0.3,
      y - radius * 0.3,
      0,
      x,
      y,
      radius
    );

    if (isOverlapping) {
      // Overlapping circles get a more intense gradient
      gradient.addColorStop(0, this.#lightenColor(color, 0.3));
      gradient.addColorStop(0.7, color);
      gradient.addColorStop(1, this.#darkenColor(color, 0.2));
    } else {
      // Normal circles get a subtle gradient
      gradient.addColorStop(0, this.#lightenColor(color, 0.2));
      gradient.addColorStop(0.8, color);
      gradient.addColorStop(1, this.#darkenColor(color, 0.1));
    }

    return gradient;
  }

  /**
   * Get stroke color based on circle state
   * @param {string} color - Base color
   * @param {boolean} isOverlapping - Whether circle is overlapping
   * @returns {string} - Stroke color
   * @private
   */
  #getStrokeColor(color, isOverlapping) {
    if (isOverlapping) {
      return this.#lightenColor(color, 0.5);
    }
    return this.#darkenColor(color, 0.3);
  }

  /**
   * Add glow effect for overlapping circles
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {number} radius - Radius
   * @private
   */
  #addGlowEffect(x, y, radius) {
    this.#ctx.save();

    // Create glow gradient
    const glowGradient = this.#ctx.createRadialGradient(
      x,
      y,
      radius * 0.8,
      x,
      y,
      radius * 1.2
    );

    glowGradient.addColorStop(0, "rgba(255, 255, 255, 0.3)");
    glowGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    this.#ctx.fillStyle = glowGradient;
    this.#ctx.beginPath();
    this.#ctx.arc(x, y, radius * 1.2, 0, 2 * Math.PI);
    this.#ctx.fill();

    this.#ctx.restore();
  }

  /**
   * Draw center point indicator
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @private
   */
  #drawCenterPoint(x, y) {
    this.#ctx.save();

    this.#ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    this.#ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
    this.#ctx.lineWidth = 1;

    this.#ctx.beginPath();
    this.#ctx.arc(x, y, 3, 0, 2 * Math.PI);
    this.#ctx.fill();
    this.#ctx.stroke();

    this.#ctx.restore();
  }

  /**
   * Lighten a color by a percentage
   * @param {string} color - Hex color
   * @param {number} percent - Percentage to lighten (0-1)
   * @returns {string} - Lightened color
   * @private
   */
  #lightenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent * 100);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;

    return (
      "#" +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  }

  /**
   * Darken a color by a percentage
   * @param {string} color - Hex color
   * @param {number} percent - Percentage to darken (0-1)
   * @returns {string} - Darkened color
   * @private
   */
  #darkenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent * 100);
    const R = (num >> 16) - amt;
    const G = ((num >> 8) & 0x00ff) - amt;
    const B = (num & 0x0000ff) - amt;

    return (
      "#" +
      (
        0x1000000 +
        (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
        (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
        (B > 255 ? 255 : B < 0 ? 0 : B)
      )
        .toString(16)
        .slice(1)
    );
  }

  /**
   * Update render statistics
   * @param {number} startTime - Start time of render
   * @private
   */
  #updateRenderStats(startTime) {
    const frameTime = performance.now() - startTime;

    this.#renderStats.frames++;
    this.#renderStats.lastFrameTime = frameTime;

    // Calculate average FPS over last 60 frames
    if (this.#renderStats.frames % 60 === 0) {
      const totalTime = performance.now() - this.#lastRenderTime;
      this.#renderStats.averageFPS = Math.round(60000 / totalTime);
      this.#lastRenderTime = performance.now();
    }
  }

  /**
   * Handle canvas resize
   */
  handleResize() {
    // Recalculate canvas dimensions if needed
    const rect = this.#canvas.getBoundingClientRect();

    if (
      this.#canvas.width !== rect.width ||
      this.#canvas.height !== rect.height
    ) {
      this.#canvas.width = rect.width;
      this.#canvas.height = rect.height;
      this.#setupContext();
    }
  }

  /**
   * Get render statistics
   * @returns {Object} - Render statistics
   */
  getRenderStats() {
    return { ...this.#renderStats };
  }

  /**
   * Get canvas dimensions
   * @returns {Object} - Canvas width and height
   */
  getCanvasDimensions() {
    return {
      width: this.#canvas.width,
      height: this.#canvas.height,
    };
  }

  /**
   * Set canvas size
   * @param {number} width - Canvas width
   * @param {number} height - Canvas height
   */
  setCanvasSize(width, height) {
    this.#canvas.width = width;
    this.#canvas.height = height;
    this.#setupContext();
  }

  /**
   * Export canvas as image data
   * @returns {string} - Data URL of canvas
   */
  exportAsImage() {
    return this.#canvas.toDataURL("image/png");
  }

  /**
   * Clear object pool and cleanup resources
   */
  destroy() {
    this.#objectPool.clear();
    this.#dirtyRegions.clear();
  }
}
