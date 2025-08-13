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

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (!this.container.contains(e.target)) {
        this.hideDropdown();
      }
    });
  }

  handleInput(value) {
    const query = value.toLowerCase().trim();

    if (query === "") {
      this.filteredData = [];
      this.hideDropdown();
      return;
    }

    // Filter data based on input
    this.filteredData = this.data.filter((item) =>
      item.toLowerCase().startsWith(query)
    );

    this.selectedIndex = -1;

    if (this.filteredData.length > 0) {
      this.showDropdown();
      this.renderDropdown();
    } else {
      this.hideDropdown();
    }
  }

  handleKeydown(e) {
    if (!this.isDropdownVisible) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        this.selectedIndex = Math.min(
          this.selectedIndex + 1,
          this.filteredData.length - 1
        );
        this.renderDropdown();
        break;

      case "ArrowUp":
        e.preventDefault();
        this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
        this.renderDropdown();
        break;

      case "Enter":
        e.preventDefault();
        if (this.selectedIndex >= 0) {
          this.selectItem(this.filteredData[this.selectedIndex]);
        }
        break;

      case "Escape":
        this.hideDropdown();
        this.searchInput.blur();
        break;
    }
  }

  renderDropdown() {
    if (this.filteredData.length === 0) {
      this.dropdown.innerHTML = "";
      return;
    }

    const dropdownHTML = this.filteredData
      .map((item, index) => {
        const isSelected = index === this.selectedIndex;
        const className = isSelected
          ? "dropdown-item selected"
          : "dropdown-item";

        return `<div class="${className}" data-index="${index}">${item}</div>`;
      })
      .join("");

    this.dropdown.innerHTML = dropdownHTML;

    // Add click events to dropdown items
    this.dropdown.querySelectorAll(".dropdown-item").forEach((item, index) => {
      item.addEventListener("click", () => {
        this.selectItem(this.filteredData[index]);
      });
    });
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
}

// Initialize the autocomplete search
document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  new AutocompleteSearch(app, mockData);
});
