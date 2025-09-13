import { useState, useCallback, useMemo } from "react";
import "./ShoppingCart.css";

const sampleProducts = [
  { id: 1, name: "Laptop", price: 999.99 },
  { id: 2, name: "Phone", price: 699.99 },
  { id: 3, name: "Headphones", price: 199.99 },
];

export default function ShoppingCart() {
  const [cart, setCart] = useState([]);

  const addToCart = useCallback((product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  }, []);

  const updateQuantity = useCallback(
    (productId, newQuantity) => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    },
    [removeFromCart]
  );

  const totalPrice = useMemo(
    () => cart.reduce((total, item) => total + item.price * item.quantity, 0),
    [cart]
  );

  const totalItems = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart]
  );

  return (
    <div className="shopping-cart-container">
      <h2>Shopping Cart</h2>

      <div className="products-section">
        <h3>Products</h3>
        {sampleProducts.map((product) => (
          <div key={product.id} className="product-item">
            <span>
              {product.name} - ${product.price.toFixed(2)}
            </span>
            <button
              onClick={() => addToCart(product)}
              aria-label={`Add ${product.name} to cart`}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <div className="cart-section">
        <h3>
          Cart ({totalItems} item{totalItems !== 1 ? "s" : ""})
        </h3>
        {cart.length === 0 ? (
          <p role="status">Your cart is empty</p>
        ) : (
          <div>
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <span>
                  {item.name} x{item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  aria-label={`Decrease quantity of ${item.name}`}
                >
                  -
                </button>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  aria-label={`Increase quantity of ${item.name}`}
                >
                  +
                </button>
                <button
                  onClick={() => removeFromCart(item.id)}
                  aria-label={`Remove ${item.name} from cart`}
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="total" role="status" aria-live="polite">
              Total: ${totalPrice.toFixed(2)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
