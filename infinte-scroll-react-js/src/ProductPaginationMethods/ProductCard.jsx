import React, { useState } from "react";
import styles from "./ProductCard.module.css";

function ProductCard({ product }) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            className={styles.productImage}
            onError={handleImageError}
          />
        ) : (
          <div className={styles.imagePlaceholder}>Image not available</div>
        )}
        <div className={styles.category}>{product.category}</div>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{product.name}</h3>

        <p className={styles.description}>{product.description}</p>

        <div className={styles.footer}>
          <span className={styles.rating}>⭐ {product.rating}</span>

          <span className={styles.price}>${product.price}</span>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
