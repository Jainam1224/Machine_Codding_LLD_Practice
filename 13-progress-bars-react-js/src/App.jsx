import { useState } from "react";
import "./App.css";

const CONCURRENCY_PROGRESS = 3;
const INITIAL_PROGRESSION = [0];

export default function App() {
  const [progression, setProgression] = useState(INITIAL_PROGRESSION);
  const [timerId, setTimerId] = useState(null);

  const addBar = () => {
    setProgression(progression.concat(0));
  };

  const stopProgress = () => {
    clearInterval(timerId);
    setTimerId(null);
  };

  const startProgress = () => {
    const timer = setInterval(() => {
      setProgression((curProgression) => {
        // Find the bars which aren't full.
        const nonFullBars = curProgression
          .map((value, index) => ({ value, index }))
          .filter(({ value }) => value < 100);
        // All bars are full, none to increment.
        if (nonFullBars.length === 0) {
          return curProgression;
        }

        // Get the first LIMIT non-full bars and increment them.
        const barsToIncrement = nonFullBars.slice(0, CONCURRENCY_PROGRESS);
        const newProgression = curProgression.slice(); // creating copy of curProgression
        for (const { index } of barsToIncrement) {
          newProgression[index] += 0.5;
        }
        return newProgression;
      });
    }, 10);

    setTimerId(timer);
  };

  const resetProgress = () => {
    stopProgress();
    setProgression(INITIAL_PROGRESSION);
  };

  const isRunning = timerId !== null;

  return (
    <div className="wrapper">
      <div className="buttons">
        <button onClick={addBar}>Add</button>
        <button onClick={isRunning ? stopProgress : startProgress}>
          {isRunning ? "Stop" : "Start"}
        </button>
        <button onClick={resetProgress}>Reset</button>
      </div>

      <div className="bars">
        {progression.map((progress, index) => (
          <ProgressBar key={index} progress={progress} />
        ))}
      </div>

      <pre>{JSON.stringify({ isRunning, progression }, null, 2)}</pre>
    </div>
  );
}

function ProgressBar({ progress }) {
  return (
    <div className="bar">
      <div
        className="bar-contents"
        style={{ transform: `scaleX(${progress / 100})` }}
      />
    </div>
  );
}
