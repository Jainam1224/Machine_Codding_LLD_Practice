/**
 * Circle class representing a circle with position, radius, and color
 * Uses modern JavaScript concepts: Classes, Private fields, Getters/Setters, Static methods
 */
export class Circle {
  #x;
  #y;
  #radius;
  #color;
  #isOverlapping = false;
  #id;

  // Static properties for default values
  static #defaultColor = "#646cff";
  static #overlapColor = "#fbbf24";
  static #nextId = 1;

  /**
   * Create a new Circle instance
   * @param {number} x - X coordinate of center
   * @param {number} y - Y coordinate of center
   * @param {number} radius - Radius of the circle
   * @param {string} color - Color of the circle (optional)
   */
  constructor(x, y, radius, color = Circle.#defaultColor) {
    this.#x = x;
    this.#y = y;
    this.#radius = Math.max(0, radius); // Ensure non-negative radius
    this.#color = color;
    this.#id = Circle.#nextId++;
  }

  /**
   * Get the unique ID of this circle
   * @returns {number}
   */
  get id() {
    return this.#id;
  }

  /**
   * Get the X coordinate
   * @returns {number}
   */
  get x() {
    return this.#x;
  }

  /**
   * Set the X coordinate
   * @param {number} value
   */
  set x(value) {
    this.#x = value;
  }

  /**
   * Get the Y coordinate
   * @returns {number}
   */
  get y() {
    return this.#y;
  }

  /**
   * Set the Y coordinate
   * @param {number} value
   */
  set y(value) {
    this.#y = value;
  }

  /**
   * Get the radius
   * @returns {number}
   */
  get radius() {
    return this.#radius;
  }

  /**
   * Set the radius (ensures non-negative)
   * @param {number} value
   */
  set radius(value) {
    this.#radius = Math.max(0, value);
  }

  /**
   * Get the current color
   * @returns {string}
   */
  get color() {
    return this.#isOverlapping ? Circle.#overlapColor : this.#color;
  }

  /**
   * Set the base color
   * @param {string} value
   */
  set color(value) {
    this.#color = value;
  }

  /**
   * Get the overlap state
   * @returns {boolean}
   */
  get isOverlapping() {
    return this.#isOverlapping;
  }

  /**
   * Set the overlap state
   * @param {boolean} value
   */
  set isOverlapping(value) {
    this.#isOverlapping = Boolean(value);
  }

  /**
   * Get the area of the circle
   * @returns {number}
   */
  get area() {
    return Math.PI * this.#radius * this.#radius;
  }

  /**
   * Get the circumference of the circle
   * @returns {number}
   */
  get circumference() {
    return 2 * Math.PI * this.#radius;
  }

  /**
   * Check if a point is inside this circle
   * @param {number} pointX - X coordinate of the point
   * @param {number} pointY - Y coordinate of the point
   * @returns {boolean}
   */
  containsPoint(pointX, pointY) {
    const distance = Math.sqrt(
      Math.pow(pointX - this.#x, 2) + Math.pow(pointY - this.#y, 2)
    );
    return distance <= this.#radius;
  }

  /**
   * Check if this circle overlaps with another circle
   * @param {Circle} other - The other circle to check against
   * @returns {boolean}
   */
  overlapsWith(other) {
    if (!(other instanceof Circle)) {
      throw new TypeError("Argument must be a Circle instance");
    }

    const distance = Math.sqrt(
      Math.pow(this.#x - other.x, 2) + Math.pow(this.#y - other.y, 2)
    );
    const sumOfRadii = this.#radius + other.radius;

    return distance < sumOfRadii;
  }

  /**
   * Calculate the overlap area with another circle
   * @param {Circle} other - The other circle
   * @returns {number} - Overlap area (0 if no overlap)
   */
  getOverlapArea(other) {
    if (!this.overlapsWith(other)) {
      return 0;
    }

    const distance = Math.sqrt(
      Math.pow(this.#x - other.x, 2) + Math.pow(this.#y - other.y, 2)
    );

    if (distance === 0) {
      // Circles are concentric, return area of smaller circle
      return Math.min(this.area, other.area);
    }

    const r1 = this.#radius;
    const r2 = other.radius;

    // Calculate overlap area using the formula for intersection of two circles
    const a = Math.acos(
      (distance * distance + r1 * r1 - r2 * r2) / (2 * distance * r1)
    );
    const b = Math.acos(
      (distance * distance + r2 * r2 - r1 * r1) / (2 * distance * r2)
    );

    const area1 = r1 * r1 * a - 0.5 * r1 * r1 * Math.sin(2 * a);
    const area2 = r2 * r2 * b - 0.5 * r2 * r2 * Math.sin(2 * b);

    return area1 + area2;
  }

  /**
   * Move the circle to a new position
   * @param {number} newX - New X coordinate
   * @param {number} newY - New Y coordinate
   */
  moveTo(newX, newY) {
    this.#x = newX;
    this.#y = newY;
  }

  /**
   * Scale the circle by a factor
   * @param {number} factor - Scale factor
   */
  scale(factor) {
    if (factor <= 0) {
      throw new Error("Scale factor must be positive");
    }
    this.#radius *= factor;
  }

  /**
   * Create a copy of this circle
   * @returns {Circle}
   */
  clone() {
    return new Circle(this.#x, this.#y, this.#radius, this.#color);
  }

  /**
   * Get circle data as a plain object
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.#id,
      x: this.#x,
      y: this.#y,
      radius: this.#radius,
      color: this.#color,
      isOverlapping: this.#isOverlapping,
      area: this.area,
      circumference: this.circumference,
    };
  }

  /**
   * Create a circle from JSON data
   * @param {Object} data - Circle data
   * @returns {Circle}
   */
  static fromJSON(data) {
    const circle = new Circle(data.x, data.y, data.radius, data.color);
    circle.#id = data.id;
    circle.#isOverlapping = data.isOverlapping;
    return circle;
  }

  /**
   * Get the default color
   * @returns {string}
   */
  static get defaultColor() {
    return Circle.#defaultColor;
  }

  /**
   * Set the default color for new circles
   * @param {string} color
   */
  static set defaultColor(color) {
    Circle.#defaultColor = color;
  }

  /**
   * Get the overlap color
   * @returns {string}
   */
  static get overlapColor() {
    return Circle.#overlapColor;
  }

  /**
   * Set the overlap color
   * @param {string} color
   */
  static set overlapColor(color) {
    Circle.#overlapColor = color;
  }

  /**
   * Reset the ID counter (useful for testing)
   */
  static resetIdCounter() {
    Circle.#nextId = 1;
  }

  /**
   * String representation of the circle
   * @returns {string}
   */
  toString() {
    return `Circle(id: ${this.#id}, x: ${this.#x}, y: ${this.#y}, radius: ${
      this.#radius
    })`;
  }
}
