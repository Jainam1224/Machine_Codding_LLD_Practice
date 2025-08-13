import "./style.css";

// Mock data with names for autocomplete
const mockData = [
  "Alice Johnson",
  "Bob Smith",
  "Charlie Brown",
  "David Wilson",
  "Emma Davis",
  "Frank Miller",
  "Grace Lee",
  "Henry Taylor",
  "Ivy Chen",
  "Jack Anderson",
  "Kate Williams",
  "Liam O'Connor",
  "Mia Rodriguez",
  "Noah Thompson",
  "Olivia Garcia",
  "Paul Martinez",
  "Quinn Johnson",
  "Rachel Davis",
  "Sam Wilson",
  "Tina Brown",
  "Uma Patel",
  "Victor Kim",
  "Wendy Zhang",
  "Xavier Lopez",
  "Yara Singh",
  "Zoe Thompson",
  "Adam Johnson",
  "Betty White",
  "Carlos Rodriguez",
  "Diana Prince",
  "Ethan Hunt",
  "Fiona Gallagher",
  "George Washington",
  "Helen Keller",
  "Ian McKellen",
  "Julia Roberts",
  "Kevin Bacon",
  "Lisa Simpson",
  "Michael Jordan",
  "Nancy Drew",
  "Oscar Wilde",
  "Penny Lane",
  "Quentin Tarantino",
  "Rose Tyler",
  "Steve Jobs",
  "Tina Fey",
  "Uma Thurman",
  "Vin Diesel",
  "Will Smith",
  "Zoe Saldana",
];

// Autocomplete functionality
class AutocompleteSearch {
  constructor(container, data) {
    this.container = container;
    this.data = data;
    this.filteredData = [];
    this.selectedIndex = -1;
    this.isDropdownVisible = false;

    this.init();
  }

  init() {
    this.render();
    this.bindEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="autocomplete-container">
        <h1>Name Autocomplete Search</h1>
        <div class="search-wrapper">
          <input 
            type="text" 
            id="searchInput" 
            placeholder="Type a name to search..."
            autocomplete="off"
          >
          <div id="dropdown" class="dropdown"></div>
        </div>
        <div class="info">
          <p>Start typing to see autocomplete suggestions</p>
          <p>Use arrow keys to navigate, Enter to select, Esc to close</p>
        </div>
      </div>
    `;

    this.searchInput = document.getElementById("searchInput");
    this.dropdown = document.getElementById("dropdown");
  }

  bindEvents() {
    this.searchInput.addEventListener("input", (e) => {
      this.handleInput(e.target.value);
    });

    this.searchInput.addEventListener("keydown", (e) => {
      this.handleKeydown(e);
    });

    this.searchInput.addEventListener("focus", () => {
      if (this.filteredData.length > 0) {
        this.showDropdown();
      }
    });

    // Event delegation for dropdown clicks
    this.dropdown.addEventListener("click", (e) => {
      if (e.target.classList.contains("dropdown-item")) {
        const index = parseInt(e.target.dataset.index);
        this.selectItem(this.filteredData[index]);
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (!this.container.contains(e.target)) {
        this.hideDropdown();
      }
    });
  }

  handleInput(value) {
    const query = value.toLowerCase().trim();

    if (!query) {
      this.filteredData = [];
      this.toggleDropdown(false);
      return;
    }

    this.filteredData = this.data.filter((item) =>
      item.toLowerCase().startsWith(query)
    );
    this.selectedIndex = -1;

    this.toggleDropdown(this.filteredData.length > 0);
    if (this.filteredData.length > 0) {
      this.renderDropdown();
    }
  }

  handleKeydown(e) {
    if (!this.isDropdownVisible) return;

    const actions = {
      ArrowDown: () => {
        e.preventDefault();
        this.selectedIndex = Math.min(
          this.selectedIndex + 1,
          this.filteredData.length - 1
        );
        this.renderDropdown();
      },
      ArrowUp: () => {
        e.preventDefault();
        this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
        this.renderDropdown();
      },
      Enter: () => {
        e.preventDefault();
        if (this.selectedIndex >= 0) {
          this.selectItem(this.filteredData[this.selectedIndex]);
        }
      },
      Escape: () => {
        this.toggleDropdown(false);
        this.searchInput.blur();
      },
    };

    actions[e.key]?.();
  }

  renderDropdown() {
    this.dropdown.innerHTML = this.filteredData
      .map(
        (item, index) =>
          `<div class="dropdown-item${
            index === this.selectedIndex ? " selected" : ""
          }" data-index="${index}">${item}</div>`
      )
      .join("");
  }

  selectItem(item) {
    this.searchInput.value = item;
    this.hideDropdown();
    this.searchInput.focus();
  }

  showDropdown() {
    this.dropdown.style.display = "block";
    this.isDropdownVisible = true;
  }

  hideDropdown() {
    this.dropdown.style.display = "none";
    this.isDropdownVisible = false;
    this.selectedIndex = -1;
  }

  toggleDropdown(show) {
    this.dropdown.style.display = show ? "block" : "none";
    this.isDropdownVisible = show;
    if (!show) this.selectedIndex = -1;
  }
}

// Initialize the autocomplete search
document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  new AutocompleteSearch(app, mockData);
});
