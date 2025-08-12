import { useState } from "react";
import "./App.css";

const config = [
  [1, 1, 1],
  [1, 0, 0],
  [1, 1, 1],
];

function Cell({ filled, onClick, isDisabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className={filled ? "cell cell-activated" : "cell"}
    />
  );
}

function GridSequence() {
  const [order, setOrder] = useState([]);
  const [isDeactivating, setIsDeactivating] = useState(false);

  function deactivateCells() {
    setIsDeactivating(true);
    const timer = setInterval(() => {
      setOrder((origOrder) => {
        const newOrder = origOrder.slice();
        newOrder.pop();

        if (newOrder.length === 0) {
          clearInterval(timer);
          setIsDeactivating(false);
        }

        return newOrder;
      });
    }, 300);
  }

  function activateCells(index) {
    const newOrder = [...order, index];
    setOrder(newOrder);

    if (newOrder.length === config.flat(1).filter(Boolean).length) {
      deactivateCells();
    }
  }

  return (
    <div className="wrapper">
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${config[0].length}, 1fr)`,
        }}
      >
        {config.flat(1).map((val, index) => {
          return val ? (
            <Cell
              key={index}
              filled={order.includes(index)}
              onClick={() => activateCells(index)}
              isDisabled={isDeactivating || order.includes(index)}
            />
          ) : (
            <span />
          );
        })}
      </div>
    </div>
  );
}

function App() {
  return (
    <div>
      <h1>Grid Lights</h1>
      <GridSequence />
    </div>
  );
}

export default App;
