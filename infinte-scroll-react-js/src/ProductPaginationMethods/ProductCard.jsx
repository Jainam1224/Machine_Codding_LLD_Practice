import React from "react";

function ProductCard({ product }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "4px",
        padding: "12px",
        backgroundColor: "white",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ marginBottom: "8px" }}>
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: "100%",
            height: "150px",
            objectFit: "cover",
            borderRadius: "4px",
          }}
        />
        <div
          style={{
            backgroundColor: "#f0f0f0",
            color: "#333",
            padding: "2px 6px",
            borderRadius: "4px",
            fontSize: "11px",
            display: "inline-block",
            marginTop: "4px",
          }}
        >
          {product.category}
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <h3
          style={{
            margin: "0 0 6px 0",
            fontSize: "14px",
            fontWeight: "500",
            color: "#333",
          }}
        >
          {product.name}
        </h3>

        <p
          style={{
            margin: "0 0 8px 0",
            fontSize: "12px",
            color: "#666",
            lineHeight: "1.3",
          }}
        >
          {product.description}
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "auto",
          }}
        >
          <span style={{ fontSize: "12px", color: "#666" }}>
            ⭐ {product.rating}
          </span>

          <span
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#333",
            }}
          >
            ${product.price}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
