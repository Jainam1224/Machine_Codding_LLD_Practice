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

export default function useProductSearch(
  pageNumber,
  limit = PRODUCTS_PER_PAGE
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);

  // Fetch products using native fetch API
  const fetchProductsWithFetch = useCallback(
    async (abortController) => {
      try {
        // Single abort check at the start
        if (abortController.signal.aborted) return;

        // Fetch real products from API using fetch
        const response = await fetch(
          `${API_BASE_URL}?limit=${limit}&skip=${(pageNumber - 1) * limit}`,
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
          id: `${pageNumber}-${product.id || index}`,
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

        setProducts((prevProducts) => {
          if (pageNumber === 1) {
            return processedProducts;
          }
          return [...prevProducts, ...processedProducts];
        });

        setTotalProducts(data.total || 0);
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
    [pageNumber, limit]
  );

  // Fetch products using Axios (alternative method)
  const fetchProductsWithAxios = useCallback(async () => {
    try {
      // Create axios cancel token for proper cancellation
      const cancelTokenSource = axios.CancelToken.source();

      // Fetch real products from API using axios
      const { data } = await api.get("", {
        params: {
          limit,
          skip: (pageNumber - 1) * limit,
        },
        cancelToken: cancelTokenSource.token,
      });

      const newProducts = data.products || [];

      // Process products to ensure consistent structure
      const processedProducts = newProducts.map((product, index) => ({
        id: `${pageNumber}-${product.id || index}`,
        name: product.title || product.name || `Product ${product.id || index}`,
        price: product.price || 0,
        category: product.category || "Uncategorized",
        rating: product.rating || 0,
        image:
          product.thumbnail ||
          product.image ||
          "https://via.placeholder.com/300x200?text=No+Image",
        description: product.description || "No description available",
      }));

      setProducts((prevProducts) => {
        if (pageNumber === 1) {
          return processedProducts;
        }
        return [...prevProducts, ...processedProducts];
      });

      setTotalProducts(data.total || 0);
      setLoading(false);
    } catch (error) {
      // Handle axios-specific errors
      if (axios.isCancel(error)) {
        console.log("Request cancelled:", error.message);
        return; // Don't set error for cancelled requests
      } else if (error.code === "ECONNABORTED") {
        console.error("Request timeout");
      } else if (error.response) {
        console.error(
          "HTTP Error:",
          error.response.status,
          error.response.data
        );
      } else if (error.request) {
        console.error("Network Error:", error.request);
      } else {
        console.error("Error:", error.message);
      }

      setError(true);
      setLoading(false);
    }
  }, [pageNumber, limit]);

  const fetchProducts = fetchProductsWithFetch;

  // Key differences:
  // - Fetch: Uses AbortController.signal, manual JSON parsing, manual error handling
  // - Axios: Uses cancelToken, automatic JSON parsing, detailed error classification

  const calculatedHasMore = pageNumber * limit < totalProducts;

  useEffect(() => {
    setLoading(true);
    setError(false);

    // Handle both fetch and axios methods
    if (fetchProducts === fetchProductsWithFetch) {
      // Fetch method needs AbortController
      const abortController = new AbortController();
      fetchProducts(abortController);

      return () => {
        abortController.abort();
      };
    } else {
      // Axios method handles its own cancellation
      fetchProducts();

      return () => {
        // Axios cancel tokens are automatically cleaned up
      };
    }
  }, [fetchProducts]);

  return {
    loading,
    error,
    products,
    hasMore: calculatedHasMore,
    totalProducts,
  };
}
