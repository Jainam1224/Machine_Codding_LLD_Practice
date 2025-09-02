/* eslint-disable no-unused-vars */
import { useEffect, useState, useCallback } from "react";
import axios from "axios";

// API configuration
const API_BASE_URL = "https://dummyjson.com/products";
const PRODUCTS_PER_PAGE = 20;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
});

export default function useProductSearchCursor(
  cursor = null,
  limit = PRODUCTS_PER_PAGE
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // Fetch products using cursor-based pagination
  const fetchProductsWithCursor = useCallback(
    async (abortController) => {
      try {
        // Single abort check at the start
        if (abortController.signal.aborted) return;

        // For cursor-based pagination, we'll simulate it using the API's skip parameter
        // In a real implementation, the API would return a cursor and we'd use that
        const skip = cursor ? parseInt(cursor) : 0;

        const response = await fetch(
          `${API_BASE_URL}?limit=${limit}&skip=${skip}`,
          {
            signal: abortController.signal,
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const newProducts = data.products || [];

        // Process products to ensure consistent structure
        const processedProducts = newProducts.map((product, index) => ({
          id: `${skip}-${product.id || index}`,
          name:
            product.title || product.name || `Product ${product.id || index}`,
          price: product.price || 0,
          category: product.category || "Uncategorized",
          rating: product.rating || 0,
          image:
            product.thumbnail ||
            product.image ||
            "https://via.placeholder.com/300x200?text=No+Image",
          description: product.description || "No description available",
        }));

        // For cursor-based pagination, we replace products on first load
        // and append on subsequent loads
        setProducts((prevProducts) => {
          if (!cursor) {
            // First load - replace all products
            return processedProducts;
          }
          // Subsequent loads - append new products
          return [...prevProducts, ...processedProducts];
        });

        setTotalProducts(data.total || 0);

        // Calculate next cursor (in real implementation, this would come from API)
        const newCursor = skip + limit;
        setNextCursor(newCursor.toString());

        // Check if there are more products
        setHasMore(newCursor < (data.total || 0));

        setLoading(false);
      } catch (error) {
        // Only check abort in catch block if we need to handle abort differently
        if (abortController.signal.aborted) {
          console.log("Request was aborted");
          return;
        }
        console.error("Fetch Error:", error.message);
        setError(true);
        setLoading(false);
      }
    },
    [cursor, limit]
  );

  // Reset function to start fresh pagination
  const resetPagination = useCallback(() => {
    setProducts([]);
    setNextCursor(null);
    setHasMore(true);
    setError(false);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(false);

    const abortController = new AbortController();
    fetchProductsWithCursor(abortController);

    return () => {
      abortController.abort();
    };
  }, [fetchProductsWithCursor]);

  return {
    loading,
    error,
    products,
    hasMore,
    totalProducts,
    nextCursor,
    resetPagination,
  };
}
