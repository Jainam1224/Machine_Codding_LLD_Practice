import "./style.css";

class MemoryGame {
  constructor() {
    this.grid = 4;
    this.cards = [];
    this.flipped = [];
    this.solved = [];
    this.disabled = false;
    this.won = false;

    this.gridElement = document.getElementById("grid");
    this.gridSizeInput = document.getElementById("gridSize");
    this.winMessage = document.getElementById("winMessage");
    this.resetButton = document.getElementById("resetButton");

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.generateGame(this.grid);
  }

  setupEventListeners() {
    this.gridSizeInput.addEventListener("change", (e) => {
      this.handleGridSizeChange(e);
    });

    this.resetButton.addEventListener("click", () => {
      this.generateGame(this.grid);
    });
  }

  handleGridSizeChange(event) {
    const newSize = parseInt(event.target.value, 10);
    if (newSize >= 2 && newSize <= 8) {
      this.grid = newSize;
      this.generateGame(this.grid);
    }
  }

  generateGame(grid) {
    const totalCount = grid * grid;
    const pairCount = Math.floor(totalCount / 2);
    const values = Array.from({ length: pairCount }, (_, index) => index + 1);

    this.cards = [...values, ...values]
      .sort(() => Math.random() - 0.5)
      .slice(0, totalCount)
      .map((number, index) => ({
        id: index,
        number,
      }));

    this.flipped = [];
    this.solved = [];
    this.won = false;
    this.disabled = false;

    this.render();
  }

  checkMatch(secondId) {
    const [firstId] = this.flipped;
    if (this.cards[firstId].number === this.cards[secondId].number) {
      // Match found - add to solved
      this.solved.push(firstId, secondId);
      this.flipped = [];
      this.disabled = false;
      this.checkWin();
    } else {
      // No match - flip back after delay
      setTimeout(() => {
        this.flipped = [];
        this.disabled = false;
        this.render();
      }, 1000);
    }
    this.render();
  }

  checkWin() {
    if (this.solved.length === this.cards.length && this.cards.length > 0) {
      this.won = true;
      this.winMessage.style.display = "block";
      this.resetButton.textContent = "Play Again";
    }
  }

  handleCardClick(id) {
    if (
      this.disabled ||
      this.won ||
      this.solved.includes(id) ||
      this.flipped.includes(id)
    )
      return;

    if (this.flipped.length === 0) {
      // First card flipped
      this.flipped = [id];
    } else if (this.flipped.length === 1) {
      // Second card flipped
      this.disabled = true;
      if (id !== this.flipped[0]) {
        this.flipped.push(id);
        this.checkMatch(id);
      } else {
        // Clicked the same card - unflip it
        this.flipped = [];
        this.disabled = false;
      }
    }

    this.render();
  }

  isFlipped(id) {
    return this.flipped.includes(id);
  }

  isSolved(id) {
    return this.solved.includes(id);
  }

  isVisible(id) {
    return this.isFlipped(id) || this.isSolved(id);
  }

  render() {
    // Update grid template columns
    this.gridElement.style.gridTemplateColumns = `repeat(${this.grid}, 1fr)`;

    // Clear existing cards
    this.gridElement.innerHTML = "";

    // Create cards
    this.cards.forEach((card) => {
      const cardElement = document.createElement("div");
      cardElement.className = `cell`;

      // Add appropriate classes based on state
      if (this.isSolved(card.id)) {
        cardElement.classList.add("cell-solved");
      } else if (this.isFlipped(card.id)) {
        cardElement.classList.add("cell-flipped");
      }

      // Show number if card is visible (flipped or solved), otherwise show "?"
      cardElement.textContent = this.isVisible(card.id) ? card.number : "?";

      cardElement.addEventListener("click", () =>
        this.handleCardClick(card.id)
      );

      this.gridElement.appendChild(cardElement);
    });

    // Update win message visibility
    if (this.won) {
      this.winMessage.style.display = "block";
      this.resetButton.textContent = "Play Again";
    } else {
      this.winMessage.style.display = "none";
      this.resetButton.textContent = "Reset";
    }
  }
}

// Initialize the game when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new MemoryGame();
});
