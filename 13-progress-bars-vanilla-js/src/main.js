import "./style.css";

const CONCURRENCY_PROGRESS = 3;
const INITIAL_PROGRESSION = [0];

class ProgressBars {
  constructor() {
    // Global state variables
    this.progression = [...INITIAL_PROGRESSION];
    this.timerId = null;

    // DOM element references
    this.addBarBtn = document.getElementById("add-bar");
    this.startStopBtn = document.getElementById("start-stop-btn");
    this.resetBtn = document.getElementById("reset-progress");
    this.barsContainer = document.getElementById("bars-container");
    this.stateDisplay = document.getElementById("state-display");

    this.init();
  }

  init() {
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    this.addBarBtn.addEventListener("click", () => this.addBar());
    this.startStopBtn.addEventListener("click", () => {
      if (this.timerId !== null) {
        this.stopProgress();
      } else {
        this.startProgress();
      }
    });

    this.resetBtn.addEventListener("click", () => this.resetProgress());
  }

  startProgress() {
    // Prevent multiple timers from running
    if (this.timerId !== null) return;

    const timer = setInterval(() => {
      // Find the bars which aren't full.
      const nonFullBars = this.progression
        .map((value, index) => ({ value, index }))
        .filter(({ value }) => value < 100);

      // All bars are full, stop the timer.
      if (nonFullBars.length === 0) {
        this.stopProgress();
        return;
      }

      // Get the first CONCURRENCY_PROGRESS non-full bars and increment them.
      const barsToIncrement = nonFullBars.slice(0, CONCURRENCY_PROGRESS);
      const newProgression = [...this.progression]; // creating copy of progression
      for (const { index } of barsToIncrement) {
        newProgression[index] += 0.5;
        // Cap the progress at 100
        if (newProgression[index] > 100) {
          newProgression[index] = 100;
        }
      }
      this.progression = newProgression;
      this.render();
    }, 10);

    this.timerId = timer;
    this.startStopBtn.textContent = "Stop";
    this.render();
  }

  addBar() {
    this.progression = this.progression.concat(0);
    this.render();
  }

  stopProgress() {
    clearInterval(this.timerId);
    this.timerId = null;
    this.startStopBtn.textContent = "Start";
    this.render();
  }

  resetProgress() {
    this.stopProgress();
    this.progression = [...INITIAL_PROGRESSION];
    this.render();
  }

  render() {
    // Clear existing bars
    this.barsContainer.innerHTML = "";

    // Render a new set of progress bars
    this.progression.forEach((progress, _index) => {
      const bar = document.createElement("div");
      bar.className = "bar";

      const barContents = document.createElement("div");
      barContents.className = "bar-contents";
      barContents.style.transform = `scaleX(${progress / 100})`;

      bar.appendChild(barContents);
      this.barsContainer.appendChild(bar);
    });

    // Update the state display
    const isRunning = this.timerId !== null;
    this.stateDisplay.textContent = JSON.stringify(
      { isRunning, progression: this.progression },
      null,
      2
    );
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new ProgressBars();
});
