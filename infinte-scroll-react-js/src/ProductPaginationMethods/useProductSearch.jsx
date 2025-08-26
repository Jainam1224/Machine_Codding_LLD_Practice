import { useEffect, useState } from "react";

// Mock product data generator
const generateMockProducts = (page, limit = 20) => {
  const products = [];
  const startId = (page - 1) * limit;

  for (let i = 0; i < limit; i++) {
    const id = startId + i + 1;
    products.push({
      id,
      name: `Product ${id}`,
      price: Math.floor(Math.random() * 1000) + 10,
      category: ["Electronics", "Clothing", "Home", "Sports", "Books"][
        Math.floor(Math.random() * 5)
      ],
      rating: (Math.random() * 5).toFixed(1),
      image: `https://picsum.photos/300/200?random=${id}`,
      description: `This is a sample description for Product ${id}. It's a great product with amazing features.`,
    });
  }

  return products;
};

// Simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function useProductSearch(pageNumber, limit = 20) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(false);

    const abortController = new AbortController();

    const fetchProducts = async () => {
      try {
        // Simulate API call delay
        await delay(800);

        if (abortController.signal.aborted) return;

        // Generate mock products
        const newProducts = generateMockProducts(pageNumber, limit);

        // Simulate having a total of 200 products (10 pages)
        const total = 200;

        if (abortController.signal.aborted) return;

        setProducts((prevProducts) => {
          if (pageNumber === 1) {
            return newProducts;
          }
          return [...prevProducts, ...newProducts];
        });

        setTotalProducts(total);
        setHasMore(pageNumber * limit < total);
        setLoading(false);
      } catch (err) {
        if (abortController.signal.aborted) return;
        setError(true);
        setLoading(false);
      }
    };

    fetchProducts();

    return () => abortController.abort();
  }, [pageNumber, limit]);

  return { loading, error, products, hasMore, totalProducts };
}
