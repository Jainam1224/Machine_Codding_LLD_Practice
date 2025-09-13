import { useState, useMemo } from "react";
import "./SearchFilters.css";

const sampleData = [
  { id: 1, name: "iPhone 15", category: "Electronics", price: 999 },
  { id: 2, name: "Samsung Galaxy", category: "Electronics", price: 899 },
  { id: 3, name: "MacBook Pro", category: "Electronics", price: 1999 },
  { id: 4, name: "Nike Air Max", category: "Shoes", price: 120 },
  { id: 5, name: "Adidas Ultraboost", category: "Shoes", price: 180 },
  { id: 6, name: "Levi's Jeans", category: "Clothing", price: 80 },
];

export default function SearchFilters() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const categories = [
    "all",
    ...new Set(sampleData.map((item) => item.category)),
  ];

  const filteredAndSortedData = useMemo(() => {
    let filtered = sampleData.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, sortBy]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSortBy("name");
  };

  return (
    <div className="search-filters-container">
      <h2>Search & Filters</h2>

      <div className="search-section">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products..."
          className="search-input"
        />
        <button onClick={clearFilters} className="clear-filters-btn">
          Clear All
        </button>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label>Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Sort By:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="name">Name A-Z</option>
            <option value="price-low">Price Low-High</option>
            <option value="price-high">Price High-Low</option>
          </select>
        </div>
      </div>

      <div className="results-section">
        <div className="results-header">
          <h3>Results ({filteredAndSortedData.length} items)</h3>
        </div>

        <div className="results-grid">
          {filteredAndSortedData.length === 0 ? (
            <p className="no-results">No products match your filters.</p>
          ) : (
            filteredAndSortedData.map((item) => (
              <div key={item.id} className="product-card">
                <h4>{item.name}</h4>
                <p>{item.category}</p>
                <p>${item.price}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
