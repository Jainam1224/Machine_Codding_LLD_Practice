import "./style.css";

// Constants
const API_URL = "https://picsum.photos/v2/list";
const IMAGES_COUNT = 10;
const AUTOPLAY_INTERVAL = 3000; // 3 seconds
const TRANSITION_DURATION = 300; // milliseconds
const AUTOPLAY_RESTART_DELAY = 350; // milliseconds
const INITIAL_VISIBLE_IMAGES = 2; // Number of images to load initially

class ImageCarousel {
  constructor() {
    this.images = [];
    this.currentIndex = 0;
    this.autoplayInterval = null;
    this.isTransitioning = false;
    this.isLoading = false;

    this.init();
  }

  async init() {
    try {
      await this.fetchImages();
      this.render();
      this.initEvents();
      this.startAutoplay();
    } catch (error) {
      console.error("Failed to initialize carousel:", error);
      this.showError("Failed to load images. Please refresh the page.");
    }
  }

  async fetchImages() {
    try {
      this.isLoading = true;
      this.showLoading();

      const response = await fetch(`${API_URL}?limit=${IMAGES_COUNT}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("No images received from API");
      }

      this.images = data.map((image, index) => ({
        id: index,
        src: image.download_url,
        alt: image.author,
      }));

      return this.images;
    } catch (error) {
      throw new Error(`Failed to fetch images: ${error.message}`);
    } finally {
      this.isLoading = false;
    }
  }

  showLoading() {
    const carouselItems = document.getElementById("carousel-items");
    carouselItems.innerHTML = `
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading images...</p>
      </div>
    `;
  }

  showError(message) {
    const carouselItems = document.getElementById("carousel-items");
    carouselItems.innerHTML = `
      <div class="error-container">
        <p>${message}</p>
        <button onclick="location.reload()">Retry</button>
      </div>
    `;
  }

  render() {
    if (this.images.length === 0) {
      this.showError("No images available");
      return;
    }

    this.renderImages();
    this.renderDots();
    this.updateActiveDot();
  }

  renderImages() {
    const carouselItems = document.getElementById("carousel-items");

    // Render all image containers but only load visible images
    carouselItems.innerHTML = this.images
      .map((image, index) => {
        const isVisible = index < INITIAL_VISIBLE_IMAGES;
        return `
          <div class="carousel-item" data-index="${index}">
            ${isVisible ? `<img src="${image.src}" alt="${image.alt}" />` : ""}
          </div>
        `;
      })
      .join("");

    // Set initial transform to show current image
    this.updateTransform();
  }

  renderDots() {
    const dotsContainer = document.getElementById("carousel-dots");
    dotsContainer.innerHTML = this.images
      .map((_, index) => `<div class="dot" data-index="${index}"></div>`)
      .join("");
  }

  updateTransform() {
    const carouselItems = document.getElementById("carousel-items");
    const translateX = -this.currentIndex * 100;
    carouselItems.style.transform = `translateX(${translateX}%)`;
  }

  updateActiveDot() {
    const dots = document.querySelectorAll(".dot");
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === this.currentIndex);
    });
  }

  goToImage(index) {
    if (this.isTransitioning || index === this.currentIndex) return;

    this.isTransitioning = true;
    this.currentIndex = index;

    // Load images that will be visible
    this.loadVisibleImages(index);

    // Update transform for smooth transition
    this.updateTransform();
    this.updateActiveDot();

    // Reset transition flag after animation
    setTimeout(() => {
      this.isTransitioning = false;
    }, TRANSITION_DURATION);
  }

  loadVisibleImages(currentIndex) {
    // Load current image and adjacent images
    const indicesToLoad = [currentIndex];
    if (currentIndex > 0) indicesToLoad.push(currentIndex - 1);
    if (currentIndex < this.images.length - 1) {
      indicesToLoad.push(currentIndex + 1);
    }

    indicesToLoad.forEach((index) => {
      const container = document.querySelector(`[data-index="${index}"]`);
      if (container && !container.querySelector("img")) {
        const image = this.images[index];
        container.innerHTML = `<img src="${image.src}" alt="${image.alt}" />`;
      }
    });
  }

  next() {
    const nextIndex = (this.currentIndex + 1) % this.images.length;
    this.goToImage(nextIndex);
  }

  prev() {
    const prevIndex =
      (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.goToImage(prevIndex);
  }

  startAutoplay() {
    this.stopAutoplay();
    this.autoplayInterval = setInterval(() => {
      this.next();
    }, AUTOPLAY_INTERVAL);
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  // Helper method to handle navigation with autoplay management
  handleNavigation(action) {
    this.stopAutoplay();
    action();
    // Delay restarting autoplay to avoid conflicts
    setTimeout(() => this.startAutoplay(), AUTOPLAY_RESTART_DELAY);
  }

  initEvents() {
    // Navigation buttons
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");

    prevBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.handleNavigation(() => this.prev());
    });

    nextBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.handleNavigation(() => this.next());
    });

    // Dot navigation
    const dotsContainer = document.getElementById("carousel-dots");
    dotsContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("dot")) {
        e.preventDefault();
        e.stopPropagation();
        const index = parseInt(e.target.dataset.index);
        this.handleNavigation(() => this.goToImage(index));
      }
    });

    // Pause autoplay on hover
    const carousel = document.querySelector(".carousel-container");
    carousel.addEventListener("mouseenter", () => this.stopAutoplay());
    carousel.addEventListener("mouseleave", () => this.startAutoplay());
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new ImageCarousel();
});
