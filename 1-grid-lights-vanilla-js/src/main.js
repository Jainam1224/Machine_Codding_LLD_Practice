import "./style.css";

// Grid Lights Game - 3x3 C Shape Pattern
class GridLightsGame {
  constructor() {
    // Configuration array: 1 = visible cell, 0 = hidden cell
    this.config = [
      [1, 1, 1],
      [1, 0, 1],
      [1, 1, 1],
    ];

    this.order = [];
    this.isDeactivating = false;
    this.deactivationInterval = null;

    this.init();
  }

  init() {
    this.createGrid();
    this.bindEvents();
    this.updateStatus();
  }

  // Create grid based on configuration array
  createGrid() {
    const container = document.getElementById("grid-container");
    const gridElement = document.createElement("div");
    gridElement.className = "grid";
    gridElement.style.gridTemplateColumns = `repeat(${this.config[0].length}, 1fr)`;

    // Flatten the config array and create cells
    this.config.flat().forEach((val, index) => {
      if (val) {
        // Create visible cell
        const cell = document.createElement("div");
        cell.className = "cell inactive";
        cell.dataset.index = index;

        gridElement.appendChild(cell);
      } else {
        // Create hidden placeholder
        const placeholder = document.createElement("div");
        placeholder.className = "cell hidden";
        gridElement.appendChild(placeholder);
      }
    });

    container.appendChild(gridElement);
  }

  bindEvents() {
    // Reset button event
    document
      .getElementById("resetBtn")
      .addEventListener("click", () => this.resetGame());

    // Use event delegation for cell clicks - more efficient
    const gridContainer = document.getElementById("grid-container");
    gridContainer.addEventListener("click", (event) => {
      const cell = event.target.closest(".cell");
      if (cell && !cell.classList.contains("hidden")) {
        this.handleCellClick(cell);
      }
    });
  }

  handleCellClick(cell) {
    // Don't allow clicks during deactivation
    if (this.isDeactivating) return;

    const index = parseInt(cell.dataset.index);

    // Don't allow clicking already activated cells
    if (this.order.includes(index)) return;

    // Activate the cell
    this.activateCell(cell, index);

    // Check if all cells are activated
    const totalCells = this.config.flat().filter(Boolean).length;
    if (this.order.length === totalCells) {
      this.startDeactivation();
    }
  }

  activateCell(cell, index) {
    cell.classList.remove("inactive");
    cell.classList.add("active");

    // Add to activation order
    this.order.push(index);

    // Show order number on the cell
    const orderNumber = this.order.length;
    cell.textContent = orderNumber;

    this.updateStatus();
  }

  startDeactivation() {
    this.isDeactivating = true;
    this.updateStatus("Deactivating cells in reverse order...");

    this.deactivationInterval = setInterval(() => {
      if (this.order.length > 0) {
        this.deactivateLastCell();
      } else {
        // All cells deactivated
        clearInterval(this.deactivationInterval);
        this.isDeactivating = false;
        this.updateStatus("Deactivated! Click cells again to restart.");
      }
    }, 300);
  }

  deactivateLastCell() {
    const lastIndex = this.order.pop();
    const cell = document.querySelector(`[data-index="${lastIndex}"]`);

    if (cell) {
      cell.classList.remove("active");
      cell.classList.add("deactivating");

      // Show deactivation order (reverse of activation order)
      const deactivationOrder = this.order.length + 1;
      cell.textContent = `${deactivationOrder}`;

      // Remove deactivating class after animation
      setTimeout(() => {
        cell.classList.remove("deactivating");
        cell.classList.add("inactive");
        cell.textContent = ""; // Clear the number
      }, 300);
    }
  }

  resetGame() {
    // Clear any ongoing deactivation
    if (this.deactivationInterval) {
      clearInterval(this.deactivationInterval);
    }

    this.isDeactivating = false;
    this.order = [];

    // Reset all cells
    const cells = document.querySelectorAll(".cell:not(.hidden)");
    cells.forEach((cell) => {
      cell.classList.remove("active", "deactivating");
      cell.classList.add("inactive");
      cell.textContent = ""; // Clear any order numbers
    });

    this.updateStatus();
  }

  updateStatus(message = null) {
    const statusElement = document.getElementById("status");

    if (message) {
      statusElement.textContent = message;
      return;
    }

    const totalCells = this.config.flat().filter(Boolean).length;

    if (this.isDeactivating) {
      statusElement.textContent = "Deactivating cells in reverse order...";
    } else if (this.order.length === 0) {
      statusElement.textContent = "Click cells in C-shape order";
    } else if (this.order.length === totalCells) {
      statusElement.textContent =
        "All cells activated! Starting deactivation...";
    } else {
      statusElement.textContent = `Activated: ${this.order.length}/${totalCells} cells`;
    }
  }
}

// Initialize the game when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new GridLightsGame();
});
