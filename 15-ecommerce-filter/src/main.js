import "./style.css";
// Data for the products
const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    category: "electronics",
    price: 150,
    color: "black",
    image: "https://placehold.co/400x300/e5e7eb/6b7280?text=Headphones",
  },
  {
    id: 2,
    name: "Men's T-Shirt",
    category: "clothing",
    price: 25,
    color: "blue",
    image: "https://placehold.co/400x300/e5e7eb/6b7280?text=T-Shirt",
  },
  {
    id: 3,
    name: "The Art of Code",
    category: "books",
    price: 45,
    color: "black",
    image: "https://placehold.co/400x300/e5e7eb/6b7280?text=Book",
  },
  {
    id: 4,
    name: "Smartwatch",
    category: "electronics",
    price: 250,
    color: "red",
    image: "https://placehold.co/400x300/e5e7eb/6b7280?text=Smartwatch",
  },
  {
    id: 5,
    name: "Cozy Blanket",
    category: "home",
    price: 60,
    color: "blue",
    image: "https://placehold.co/400x300/e5e7eb/6b7280?text=Blanket",
  },
  {
    id: 6,
    name: "Casual Jeans",
    category: "clothing",
    price: 80,
    color: "blue",
    image: "https://placehold.co/400x300/e5e7eb/6b7280?text=Jeans",
  },
  {
    id: 7,
    name: "4K TV",
    category: "electronics",
    price: 450,
    color: "black",
    image: "https://placehold.co/400x300/e5e7eb/6b7280?text=4K+TV",
  },
  {
    id: 8,
    name: 'Novel "The Journey"',
    category: "books",
    price: 20,
    color: "white",
    image: "https://placehold.co/400x300/e5e7eb/6b7280?text=Book",
  },
  {
    id: 9,
    name: "Scented Candle Set",
    category: "home",
    price: 35,
    color: "white",
    image: "https://placehold.co/400x300/e5e7eb/6b7280?text=Candles",
  },
  {
    id: 10,
    name: "Running Shoes",
    category: "clothing",
    price: 120,
    color: "red",
    image: "https://placehold.co/400x300/e5e7eb/6b7280?text=Shoes",
  },
  {
    id: 11,
    name: "Coffee Maker",
    category: "home",
    price: 180,
    color: "black",
    image: "https://placehold.co/400x300/e5e7eb/6b7280?text=Coffee+Maker",
  },
  {
    id: 12,
    name: "Gaming Mouse",
    category: "electronics",
    price: 90,
    color: "black",
    image: "https://placehold.co/400x300/e5e7eb/6b7280?text=Gaming+Mouse",
  },
  {
    id: 13,
    name: "Winter Coat",
    category: "clothing",
    price: 220,
    color: "green",
    image: "https://placehold.co/400x300/e5e7eb/6b7280?text=Coat",
  },
];

class ProductsFilter {
  constructor() {
    this.filters = {
      category: "all",
      maxPrice: 500,
      color: "all",
    };

    // DOM element references
    this.productGrid = document.getElementById("product-grid");
    this.categoryFilter = document.getElementById("category-filter");
    this.priceFilter = document.getElementById("price-filter");
    this.priceValueDisplay = document.getElementById("price-value");
    this.colorFilters = document.querySelectorAll(".filter-color");
    this.clearFiltersBtn = document.getElementById("clear-filters-btn");

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.applyFilters();
  }

  applyFilters() {
    const filtered = products.filter((product) => {
      const isCategoryMatch =
        this.filters.category === "all" ||
        product.category === this.filters.category;
      const isPriceMatch = product.price <= this.filters.maxPrice;
      const isColorMatch =
        this.filters.color === "all" || product.color === this.filters.color;
      return isCategoryMatch && isPriceMatch && isColorMatch;
    });
    this.renderProducts(filtered);
  }

  setupEventListeners() {
    // Listen for changes on the category filter
    this.categoryFilter.addEventListener("change", (e) => {
      this.filters.category = e.target.value;
      this.applyFilters();
    });

    // Listen for changes on the price slider
    this.priceFilter.addEventListener("input", (e) => {
      this.filters.maxPrice = Number(e.target.value);
      this.priceValueDisplay.textContent = this.filters.maxPrice;
      this.applyFilters();
    });

    // Listen for clicks on the color filter buttons
    this.colorFilters.forEach((button) => {
      button.addEventListener("click", (e) => {
        const selectedColor = e.target.dataset.color;

        // Toggle active state for color buttons
        this.colorFilters.forEach((btn) => btn.classList.remove("active"));
        if (this.filters.color === selectedColor) {
          this.filters.color = "all"; // Unselect if already selected
        } else {
          this.filters.color = selectedColor;
          e.target.classList.add("active");
        }
        this.applyFilters();
      });
    });

    // Clear all filters
    this.clearFiltersBtn.addEventListener("click", () => {
      this.filters.category = "all";
      this.filters.maxPrice = 500;
      this.filters.color = "all";

      this.categoryFilter.value = "all";
      this.priceFilter.value = 500;
      this.priceValueDisplay.textContent = 500;
      this.colorFilters.forEach((btn) => btn.classList.remove("active"));

      this.applyFilters();
    });
  }

  renderProducts(filteredProducts) {
    // Check if there are products to display
    if (filteredProducts.length === 0) {
      this.productGrid.innerHTML = `<p class="no-products">No products found for the selected filters.</p>`;
      return;
    }

    // Generate HTML for each product card
    const productHTML = filteredProducts
      .map(
        (product) => `
                <div class="product-card">
                    <img src="${product.image}" alt="${product.name}" class="product-card-img">
                    <div class="product-card-body">
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-category">${product.category} - ${product.color}</p>
                        <p class="product-price">$${product.price}</p>
                    </div>
                </div>
            `
      )
      .join("");

    // Insert the generated HTML into the grid
    this.productGrid.innerHTML = productHTML;
  }
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  new ProductsFilter();
});
