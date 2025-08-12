import { useEffect, useState } from "react";
import "./App.css";

// const emojis = ["🐵", "🐶", "🦊", "🐱", "🦁", "🐯", "🐴", "🦄"];

// function generateGame(totalCount) {
//   const cards = [...emojis, ...emojis]
//     .sort(() => Math.random - 0.5)
//     .slice(0, totalCount)
//     .map((emoji, index) => ({
//       id: index,
//       emoji,
//     }));

//   return cards;
// }

function MemoryGame() {
  const [grid, setGrid] = useState(4);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [won, setWon] = useState(false);

  useEffect(() => {
    if (solved.length === cards.length && cards.length > 0) {
      setWon(true);
    }
  }, [solved, cards]);

  useEffect(() => {
    generateGame(grid);
  }, [grid]);

  function handleGridSizeChange(event) {
    const newSize = parseInt(event.target.value, 10);
    if (newSize >= 2 && newSize <= 10) {
      setGrid(newSize);
    }
  }

  function generateGame(grid) {
    const totalCount = grid * grid;
    const pairCount = Math.floor(totalCount / 2);
    const values = Array.from({ length: pairCount }, (_, index) => index + 1);
    const cards = [...values, ...values]
      .sort(() => Math.random() - 0.5)
      .slice(0, totalCount)
      .map((number, index) => ({
        id: index,
        number,
      }));

    setCards(cards);
    setFlipped([]);
    setSolved([]);
    setWon(false);
  }

  function checkMatch(secondId) {
    const [firstId] = flipped;
    if (cards[firstId].number === cards[secondId].number) {
      setSolved([...solved, firstId, secondId]);
      setFlipped([]);
      setDisabled(false);
    } else {
      setTimeout(() => {
        setFlipped([]);
        setDisabled(false);
      }, 1000);
    }
  }

  function handleCardClick(id) {
    if (disabled || won) return;

    if (flipped.length === 0) {
      setFlipped([id]);
    }

    if (flipped.length === 1) {
      setDisabled(true);
      if (id != flipped[0]) {
        setFlipped([...flipped, id]);
        checkMatch(id);
      } else {
        setFlipped([]);
        setDisabled(false);
      }
    }
  }

  const isFlipped = (id) => flipped.includes(id) || solved.includes(id);
  const isSolved = (id) => solved.includes(id);

  return (
    <div className="wrapper">
      <div className="grid-input">
        <label htmlFor="gridSize">Grid Size: </label>
        <input
          type="number"
          id="gridSize"
          min={2}
          max={8}
          defaultValue={grid}
          onChange={(e) => {
            handleGridSizeChange(e);
          }}
        />
      </div>

      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${grid}, 1fr)`,
        }}
      >
        {cards?.map((card) => {
          return (
            <div
              className={`cell ${isFlipped(card.id) ? "cell-flipped" : ""} ${
                isSolved(card.id) ? "cell-solved" : ""
              }`}
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              disabled={disabled || isSolved(card.id)}
              type="button"
            >
              {isFlipped(card.id) ? card.number : "?"}
            </div>
          );
        })}
      </div>

      {won && <div>You Won the Game!</div>}

      <button
        className="reset-button"
        onClick={() => {
          generateGame(grid);
        }}
      >
        {won ? "Play Again" : "Reset"}
      </button>
    </div>
  );
}

function App() {
  return (
    <div>
      <h1>Memory Game</h1>
      <MemoryGame />
    </div>
  );
}

export default App;
