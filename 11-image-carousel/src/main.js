import "./style.css";

const API_URL = "https://picsum.photos/v2/list";
const IMAGES_COUNT = 10;
const AUTOPLAY_INTERVAL = 3000; // 3 seconds

let isLoading = false;

class ImageCarousel {
  constructor() {
    this.images = [];
    this.currentIndex = 0;
    this.autoplayInterval = null;
    this.isTransitioning = false;

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

  fetchImages() {
    return new Promise(async (resolve, reject) => {
      try {
        isLoading = true;
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

        resolve(this.images);
      } catch (error) {
        isLoading = false;
        reject(new Error(`Failed to fetch images: ${error.message}`));
      }
    });
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

    // Render all images for smooth transitions
    carouselItems.innerHTML = this.images
      .map((image, index) => {
        return `
          <div class="carousel-item" data-index="${index}">
            <img src="${image.src}" alt="${image.alt}" />
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

    // Update transform for smooth transition
    this.updateTransform();
    this.updateActiveDot();

    // Reset transition flag after animation
    setTimeout(() => {
      this.isTransitioning = false;
    }, 300);
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
    // Clear any existing interval first
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

  initEvents() {
    // Navigation buttons
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");

    prevBtn.addEventListener("click", () => {
      this.stopAutoplay();
      this.prev();
      this.startAutoplay();
    });

    nextBtn.addEventListener("click", () => {
      this.stopAutoplay();
      this.next();
      this.startAutoplay();
    });

    // Dot navigation
    const dotsContainer = document.getElementById("carousel-dots");
    dotsContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("dot")) {
        const index = parseInt(e.target.dataset.index);
        this.stopAutoplay();
        this.goToImage(index);
        this.startAutoplay();
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
