import "./style.css";

// API Configuration
const API_BASE_URL = "https://jsonplaceholder.typicode.com";
const PRODUCTS_PER_PAGE = 10;

// Product data will be fetched from API
let products = [];
let isLoading = false;
let error = null;

class PaginationApp {
  constructor() {
    this.currentPage = 1;
    this.totalPages = 0;
    this.init();
  }

  async init() {
    await this.fetchProducts();
    this.render();
  }

  async fetchProducts() {
    try {
      isLoading = true;
      this.render(); // Show loading state

      // Fetch posts from JSONPlaceholder API and transform them to products
      const response = await fetch(`${API_BASE_URL}/posts`);
      const posts = await response.json();

      // Transform posts to products with images
      products = posts.map((post, index) => ({
        id: post.id,
        title: post.title.charAt(0).toUpperCase() + post.title.slice(1), // Capitalize first letter
        image: `https://picsum.photos/300/200?random=${post.id}`,
        body: post.body,
      }));

      this.totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
      error = null;
    } catch (err) {
      error = "Failed to fetch products. Please try again.";
      console.error("Error fetching products:", err);
    } finally {
      isLoading = false;
    }
  }

  getCurrentPageProducts() {
    const startIndex = (this.currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    return products.slice(startIndex, endIndex);
  }

  goToPage(page) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.render();
    }
  }

  renderProducts() {
    const currentProducts = this.getCurrentPageProducts();
    return `
      <div class="products-grid">
        ${currentProducts
          .map(
            (product) => `
          <div class="product-card">
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <h3 class="product-title">${product.title}</h3>
          </div>
        `
          )
          .join("")}
      </div>
    `;
  }

  renderPagination() {
    const pages = [];

    // Previous button
    pages.push(`
      <button 
        class="pagination-btn ${this.currentPage === 1 ? "disabled" : ""}" 
        onclick="app.goToPage(${this.currentPage - 1})"
      >
        Previous
      </button>
    `);

    // Page numbers
    for (let i = 1; i <= this.totalPages; i++) {
      if (
        i === 1 ||
        i === this.totalPages ||
        (i >= this.currentPage - 1 && i <= this.currentPage + 1)
      ) {
        pages.push(`
          <button 
            class="pagination-btn ${i === this.currentPage ? "active" : ""}" 
            onclick="app.goToPage(${i})"
          >
            ${i}
          </button>
        `);
      } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
        pages.push('<span class="pagination-dots">...</span>');
      }
    }

    // Next button
    pages.push(`
      <button 
        class="pagination-btn ${
          this.currentPage === this.totalPages ? "disabled" : ""
        }" 
        onclick="app.goToPage(${this.currentPage + 1})"
      >
        Next
      </button>
    `);

    return `
      <div class="pagination">
        ${pages.join("")}
      </div>
    `;
  }

  render() {
    const app = document.getElementById("app");
    app.innerHTML = `
      <div class="container">
        <header>
          <h1>Product Pagination Demo</h1>
          <p>${this.getStatusText()}</p>
        </header>
        
        <main>
          ${this.renderMainContent()}
        </main>
        
        <footer>
          ${!isLoading && !error ? this.renderPagination() : ""}
        </footer>
      </div>
    `;
  }

  getStatusText() {
    if (isLoading) {
      return "Loading products...";
    }
    if (error) {
      return error;
    }
    return `Showing ${this.getCurrentPageProducts().length} of ${
      products.length
    } products`;
  }

  renderMainContent() {
    if (isLoading) {
      return this.renderLoadingState();
    }
    if (error) {
      return this.renderErrorState();
    }
    return this.renderProducts();
  }

  renderLoadingState() {
    return `
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>Fetching products from API...</p>
      </div>
    `;
  }

  renderErrorState() {
    return `
      <div class="error-container">
        <p class="error-message">${error}</p>
        <button onclick="app.retryFetch()" class="retry-btn">Retry</button>
      </div>
    `;
  }

  async retryFetch() {
    await this.fetchProducts();
    this.render();
  }
}

// Initialize the app and make it globally accessible
const app = new PaginationApp();
window.app = app;
