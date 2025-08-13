// Simple Tic-Tac-Toe Game
class TicTacToe {
  constructor() {
    this.board = Array(9).fill("");
    this.currentPlayer = "X";
    this.gameActive = true;
    this.winner = null;
    this.winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Columns
      [0, 4, 8],
      [2, 4, 6], // Diagonals
    ];
    this.init();
  }

  init() {
    this.createGameBoard();
    this.createStatusBar();
    this.createResetButton();
    this.updateDisplay();
  }

  makeMove(index) {
    if (!this.gameActive || this.board[index] !== "") {
      return false;
    }

    this.board[index] = this.currentPlayer;

    if (this.checkWinner()) {
      this.winner = this.currentPlayer;
      this.gameActive = false;
    } else if (this.isBoardFull()) {
      this.gameActive = false;
    } else {
      this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
    }

    this.updateDisplay();
    return true;
  }

  checkWinner() {
    return this.winningCombinations.some((combination) => {
      const [a, b, c] = combination;
      return (
        this.board[a] &&
        this.board[a] === this.board[b] &&
        this.board[a] === this.board[c]
      );
    });
  }

  isBoardFull() {
    return this.board.every((cell) => cell !== "");
  }

  reset() {
    this.board = Array(9).fill("");
    this.currentPlayer = "X";
    this.gameActive = true;
    this.winner = null;
    this.updateDisplay();
  }

  getWinningLine() {
    for (let combination of this.winningCombinations) {
      const [a, b, c] = combination;
      if (
        this.board[a] &&
        this.board[a] === this.board[b] &&
        this.board[a] === this.board[c]
      ) {
        return combination;
      }
    }
    return null;
  }

  createGameBoard() {
    const gameContainer = document.getElementById("game-container");
    const board = document.createElement("div");
    board.className = "game-board";

    for (let i = 0; i < 9; i++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.index = i;
      cell.addEventListener("click", () => this.handleCellClick(i));
      board.appendChild(cell);
    }

    gameContainer.appendChild(board);
  }

  createStatusBar() {
    const gameContainer = document.getElementById("game-container");
    this.statusElement = document.createElement("div");
    this.statusElement.className = "status";
    gameContainer.appendChild(this.statusElement);
  }

  createResetButton() {
    const gameContainer = document.getElementById("game-container");
    this.resetButton = document.createElement("button");
    this.resetButton.className = "reset-btn";
    this.resetButton.textContent = "Reset Game";
    this.resetButton.addEventListener("click", () => this.reset());
    gameContainer.appendChild(this.resetButton);
  }

  handleCellClick(index) {
    this.makeMove(index);
  }

  updateDisplay() {
    const cells = document.querySelectorAll(".cell");

    // Update board
    cells.forEach((cell, index) => {
      cell.textContent = this.board[index];
      cell.className = "cell";
    });

    // Highlight winning line
    const winningLine = this.getWinningLine();
    if (winningLine) {
      winningLine.forEach((index) => {
        cells[index].classList.add("winner");
      });
    }

    // Update status
    if (this.winner) {
      this.statusElement.textContent = `Player ${this.winner} wins!`;
      this.statusElement.className = "status winner-status";
    } else if (!this.gameActive) {
      this.statusElement.textContent = "It's a draw!";
      this.statusElement.className = "status draw-status";
    } else {
      this.statusElement.textContent = `Player ${this.currentPlayer}'s turn`;
      this.statusElement.className = "status";
    }
  }
}

// CSS Styles
const styles = `
  .game-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: Arial, sans-serif;
    margin: 20px;
  }

  .game-board {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 5px;
    background-color: #333;
    padding: 5px;
    border-radius: 10px;
    margin-bottom: 20px;
  }

  .cell {
    width: 100px;
    height: 100px;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .cell:hover {
    background-color: #f0f0f0;
  }

  .cell.winner {
    background-color: #90EE90;
    color: #006400;
  }

  .status {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    text-align: center;
  }

  .winner-status {
    color: #28a745;
  }

  .draw-status {
    color: #ffc107;
  }

  .reset-btn {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 5px;
  }

  .reset-btn:hover {
    background-color: #c82333;
  }
`;

// Initialize the game
document.addEventListener("DOMContentLoaded", () => {
  // Add styles to head
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);

  // Create game container if it doesn't exist
  if (!document.getElementById("game-container")) {
    const container = document.createElement("div");
    container.id = "game-container";
    container.className = "game-container";
    document.body.appendChild(container);
  }

  // Initialize game
  new TicTacToe();
});
