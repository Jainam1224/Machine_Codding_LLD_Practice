# Tic-Tac-Toe Game - Vanilla JavaScript + Vite

A simple Tic-Tac-Toe game built with vanilla JavaScript and Vite.

## Features

- Classic 3x3 Tic-Tac-Toe gameplay
- Turn-based player system (X and O)
- Win detection with highlighted winning combinations
- Draw detection
- Reset functionality
- Responsive design with hover effects

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:

```bash
npm run dev
```

The game will be available at `http://localhost:5173`

### Building for Production

Build the project:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

### Linting

Run ESLint to check code quality:

```bash
npm run lint
```

## Game Rules

- Players take turns placing X and O on the 3x3 grid
- First player to get 3 of their marks in a row (horizontally, vertically, or diagonally) wins
- If all cells are filled without a winner, the game is a draw
- Click the "Reset Game" button to start a new game

## Project Structure

```
├── src/
│   └── TicTacToe.js    # Main game logic and UI
├── index.html          # Entry point
├── vite.config.js      # Vite configuration
└── package.json        # Dependencies and scripts
```

## Technologies Used

- Vanilla JavaScript (ES6+)
- Vite (Build tool and dev server)
- CSS Grid for layout
- DOM manipulation
