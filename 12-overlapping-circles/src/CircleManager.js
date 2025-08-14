import { Circle } from "./Circle.js";

/**
 * CircleManager class for managing multiple circles and overlap detection
 * Uses modern JavaScript concepts: Classes, Private fields, WeakMap, Event handling
 */
export class CircleManager {
  #circles = new Map();
  #overlapCache = new WeakMap();
  #maxCircles = 2; // Limit to 2 circles as per requirements
  #overlapListeners = new Set();

  constructor() {
    // Initialize with empty state
  }

  /**
   * Add a circle to the manager
   * @param {Circle} circle - The circle to add
   * @returns {boolean} - True if added successfully
   */
  addCircle(circle) {
    if (!(circle instanceof Circle)) {
      throw new TypeError("Argument must be a Circle instance");
    }

    // If we already have 2 circles, remove the oldest one
    if (this.#circles.size >= this.#maxCircles) {
      const firstKey = this.#circles.keys().next().value;
      this.#circles.delete(firstKey);
    }

    this.#circles.set(circle.id, circle);
    this.updateOverlapStates();
    this.#notifyOverlapListeners();

    return true;
  }

  /**
   * Remove a circle by ID
   * @param {number} circleId - The ID of the circle to remove
   * @returns {boolean} - True if removed successfully
   */
  removeCircle(circleId) {
    const removed = this.#circles.delete(circleId);
    if (removed) {
      this.updateOverlapStates();
      this.#notifyOverlapListeners();
    }
    return removed;
  }

  /**
   * Get a circle by ID
   * @param {number} circleId - The ID of the circle
   * @returns {Circle|undefined} - The circle or undefined if not found
   */
  getCircle(circleId) {
    return this.#circles.get(circleId);
  }

  /**
   * Get all circles as an array
   * @returns {Circle[]} - Array of all circles
   */
  getCircles() {
    return Array.from(this.#circles.values());
  }

  /**
   * Get the number of circles
   * @returns {number}
   */
  getCircleCount() {
    return this.#circles.size;
  }

  /**
   * Clear all circles
   */
  clearCircles() {
    this.#circles.clear();
    this.#overlapCache.clear();
    this.#notifyOverlapListeners();
  }

  /**
   * Check if any circles overlap
   * @returns {boolean}
   */
  hasOverlap() {
    const circles = this.getCircles();
    if (circles.length < 2) return false;

    // Use cached result if available
    const cacheKey = this.#getCacheKey(circles);
    if (this.#overlapCache.has(cacheKey)) {
      return this.#overlapCache.get(cacheKey);
    }

    const hasOverlap = circles[0].overlapsWith(circles[1]);
    this.#overlapCache.set(cacheKey, hasOverlap);

    return hasOverlap;
  }

  /**
   * Get overlapping circles
   * @returns {Circle[]} - Array of overlapping circles
   */
  getOverlappingCircles() {
    const circles = this.getCircles();
    if (circles.length < 2) return [];

    return circles.filter((circle) => circle.isOverlapping);
  }

  /**
   * Update overlap states for all circles
   */
  updateOverlapStates() {
    const circles = this.getCircles();

    // Reset all overlap states
    circles.forEach((circle) => {
      circle.isOverlapping = false;
    });

    // Check for overlaps if we have at least 2 circles
    if (circles.length >= 2) {
      const hasOverlap = circles[0].overlapsWith(circles[1]);

      if (hasOverlap) {
        circles[0].isOverlapping = true;
        circles[1].isOverlapping = true;
      }
    }
  }

  /**
   * Get a cache key for overlap detection
   * @param {Circle[]} circles - Array of circles
   * @returns {string} - Cache key
   * @private
   */
  #getCacheKey(circles) {
    // Create a deterministic key based on circle properties
    return circles
      .map(
        (circle) =>
          `${circle.id}-${circle.x.toFixed(2)}-${circle.y.toFixed(
            2
          )}-${circle.radius.toFixed(2)}`
      )
      .sort()
      .join("|");
  }

  /**
   * Add an overlap state change listener
   * @param {Function} listener - Function to call when overlap state changes
   */
  addOverlapListener(listener) {
    if (typeof listener !== "function") {
      throw new TypeError("Listener must be a function");
    }
    this.#overlapListeners.add(listener);
  }

  /**
   * Remove an overlap state change listener
   * @param {Function} listener - Function to remove
   */
  removeOverlapListener(listener) {
    this.#overlapListeners.delete(listener);
  }

  /**
   * Notify all overlap listeners
   * @private
   */
  #notifyOverlapListeners() {
    const hasOverlap = this.hasOverlap();
    const overlappingCircles = this.getOverlappingCircles();

    this.#overlapListeners.forEach((listener) => {
      try {
        listener(hasOverlap, overlappingCircles);
      } catch (error) {
        console.error("Error in overlap listener:", error);
      }
    });
  }

  /**
   * Get statistics about the circles
   * @returns {Object} - Statistics object
   */
  getStatistics() {
    const circles = this.getCircles();
    const totalArea = circles.reduce((sum, circle) => sum + circle.area, 0);
    const totalCircumference = circles.reduce(
      (sum, circle) => sum + circle.circumference,
      0
    );
    const hasOverlap = this.hasOverlap();

    return {
      circleCount: circles.length,
      totalArea: totalArea,
      totalCircumference: totalCircumference,
      hasOverlap: hasOverlap,
      overlappingCount: this.getOverlappingCircles().length,
    };
  }

  /**
   * Find circles that contain a specific point
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @returns {Circle[]} - Array of circles containing the point
   */
  findCirclesAtPoint(x, y) {
    return this.getCircles().filter((circle) => circle.containsPoint(x, y));
  }

  /**
   * Get the circle with the largest area
   * @returns {Circle|undefined} - The largest circle or undefined if no circles
   */
  getLargestCircle() {
    const circles = this.getCircles();
    if (circles.length === 0) return undefined;

    return circles.reduce((largest, current) =>
      current.area > largest.area ? current : largest
    );
  }

  /**
   * Get the circle with the smallest area
   * @returns {Circle|undefined} - The smallest circle or undefined if no circles
   */
  getSmallestCircle() {
    const circles = this.getCircles();
    if (circles.length === 0) return undefined;

    return circles.reduce((smallest, current) =>
      current.area < smallest.area ? current : smallest
    );
  }

  /**
   * Export all circles as JSON
   * @returns {Object} - JSON representation
   */
  toJSON() {
    return {
      circles: this.getCircles().map((circle) => circle.toJSON()),
      statistics: this.getStatistics(),
    };
  }

  /**
   * Import circles from JSON
   * @param {Object} data - JSON data
   */
  fromJSON(data) {
    this.clearCircles();

    if (data.circles && Array.isArray(data.circles)) {
      data.circles.forEach((circleData) => {
        const circle = Circle.fromJSON(circleData);
        this.addCircle(circle);
      });
    }
  }

  /**
   * Get the maximum number of circles allowed
   * @returns {number}
   */
  get maxCircles() {
    return this.#maxCircles;
  }

  /**
   * Set the maximum number of circles allowed
   * @param {number} value
   */
  set maxCircles(value) {
    if (value < 1) {
      throw new Error("Max circles must be at least 1");
    }
    this.#maxCircles = value;

    // Remove excess circles if necessary
    while (this.#circles.size > this.#maxCircles) {
      const firstKey = this.#circles.keys().next().value;
      this.#circles.delete(firstKey);
    }
  }

  /**
   * Cleanup method for proper resource management
   */
  destroy() {
    this.clearCircles();
    this.#overlapListeners.clear();
    this.#overlapCache = null;
  }
}
