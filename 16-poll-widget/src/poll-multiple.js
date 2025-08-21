class MultiplePollWidget {
  constructor() {
    this.votes = {
      React: 0,
      Vue: 0,
      Angular: 0,
      "Node.js": 0,
      Python: 0,
    };
    this.totalVotes = 0;
    this.selectedOptions = new Set();

    this.init();
  }

  init() {
    this.bindEvents();
    this.loadVotes();
    this.updateDisplay();
  }

  bindEvents() {
    // Checkbox change events
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", (e) => {
        if (e.target.checked) {
          this.selectedOptions.add(e.target.value);
        } else {
          this.selectedOptions.delete(e.target.value);
        }
        this.updateVoteButton();
      });
    });

    // Vote button click event
    const voteBtn = document.getElementById("voteBtn");
    voteBtn.addEventListener("click", () => {
      this.submitVote();
    });
  }

  updateVoteButton() {
    const voteBtn = document.getElementById("voteBtn");
    voteBtn.disabled = this.selectedOptions.size === 0;
  }

  submitVote() {
    if (this.selectedOptions.size === 0) return;

    // Increment vote count for each selected option
    this.selectedOptions.forEach((option) => {
      this.votes[option]++;
    });
    this.totalVotes++;

    // Save to localStorage
    this.saveVotes();

    // Update display
    this.updateDisplay();

    // Reset selection
    this.selectedOptions.clear();
    document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
      checkbox.checked = false;
    });
    this.updateVoteButton();

    // Show success message
    this.showMessage("Votes submitted successfully!");
  }

  updateDisplay() {
    // Update vote counts
    Object.keys(this.votes).forEach((option) => {
      const optionElement = this.getOptionElement(option);
      if (optionElement) {
        const voteCountElement = optionElement.querySelector(".vote-count");
        const progressElement = optionElement.querySelector(".progress");

        voteCountElement.textContent = `${this.votes[option]} votes`;

        // Calculate percentage for progress bar
        const percentage =
          this.totalVotes > 0
            ? (this.votes[option] / this.totalVotes) * 100
            : 0;
        progressElement.style.width = `${percentage}%`;
        progressElement.setAttribute("data-value", percentage.toFixed(1));
      }
    });

    // Update total votes
    document.getElementById("totalVotes").textContent = this.totalVotes;
  }

  getOptionElement(optionName) {
    const options = document.querySelectorAll(".option");
    for (let option of options) {
      const label = option.querySelector("label");
      if (label.textContent === optionName) {
        return option;
      }
    }
    return null;
  }

  saveVotes() {
    localStorage.setItem("multiplePollVotes", JSON.stringify(this.votes));
    localStorage.setItem("multiplePollTotal", this.totalVotes.toString());
  }

  loadVotes() {
    const savedVotes = localStorage.getItem("multiplePollVotes");
    const savedTotal = localStorage.getItem("multiplePollTotal");

    if (savedVotes) {
      this.votes = JSON.parse(savedVotes);
    }

    if (savedTotal) {
      this.totalVotes = parseInt(savedTotal);
    }
  }

  showMessage(message) {
    // Create temporary message element
    const messageElement = document.createElement("div");
    messageElement.textContent = message;
    messageElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;

    // Add animation styles
    const style = document.createElement("style");
    style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
    document.head.appendChild(style);

    document.body.appendChild(messageElement);

    // Remove message after 3 seconds
    setTimeout(() => {
      messageElement.remove();
    }, 3000);
  }
}

// Initialize the poll widget when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new MultiplePollWidget();
});
