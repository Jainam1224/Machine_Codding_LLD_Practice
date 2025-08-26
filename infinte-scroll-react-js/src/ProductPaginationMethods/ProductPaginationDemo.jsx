import { useState } from "react";
import ScrollEventProductPagination from "./ScrollEventProductPagination";
import ButtonTriggerProductPagination from "./ButtonTriggerProductPagination";
import ThrottledScrollProductPagination from "./ThrottledScrollProductPagination";
import IntersectionObserverProductPagination from "./IntersectionObserverProductPagination";

function ProductPaginationDemo() {
  const [activeMethod, setActiveMethod] = useState("intersection-observer");

  const methods = [
    {
      id: "intersection-observer",
      name: "Intersection Observer",
      component: IntersectionObserverProductPagination,
      description:
        "Most performant - automatically loads when reaching last product",
    },
    {
      id: "scroll-event",
      name: "Scroll Event",
      component: ScrollEventProductPagination,
      description: "Simple scroll detection - loads when near bottom",
    },
    {
      id: "button-trigger",
      name: "Button Trigger",
      component: ButtonTriggerProductPagination,
      description: "Manual control - user clicks to load more",
    },
    {
      id: "throttled-scroll",
      name: "Throttled Scroll",
      component: ThrottledScrollProductPagination,
      description: "Performance optimized scroll events",
    },
  ];

  const ActiveComponent = methods.find((m) => m.id === activeMethod)?.component;

  return (
    <div style={{ padding: "16px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <h1 style={{ margin: "0 0 8px 0", color: "#333", fontSize: "24px" }}>
          Product Pagination Methods Demo
        </h1>
        <p style={{ margin: "0", color: "#666", fontSize: "16px" }}>
          Explore different infinite scroll implementations for product catalogs
        </p>
      </div>

      <div style={{ marginBottom: "24px", textAlign: "center" }}>
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: "16px",
          }}
        >
          {methods.map((method) => (
            <button
              key={method.id}
              onClick={() => setActiveMethod(method.id)}
              style={{
                padding: "8px 16px",
                backgroundColor:
                  activeMethod === method.id ? "#007bff" : "#f8f9fa",
                color: activeMethod === method.id ? "white" : "#333",
                border: "1px solid #dee2e6",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              {method.name}
            </button>
          ))}
        </div>

        <div
          style={{
            padding: "12px",
            backgroundColor: "#e3f2fd",
            borderRadius: "4px",
            maxWidth: "500px",
            margin: "0 auto",
          }}
        >
          <p style={{ margin: "0", color: "#1976d2", fontSize: "14px" }}>
            <strong>Current Method:</strong>{" "}
            {methods.find((m) => m.id === activeMethod)?.name}
          </p>
          <p
            style={{ margin: "4px 0 0 0", color: "#1976d2", fontSize: "13px" }}
          >
            {methods.find((m) => m.id === activeMethod)?.description}
          </p>
        </div>
      </div>

      <div
        style={{
          border: "1px solid #dee2e6",
          borderRadius: "8px",
          padding: "16px",
          backgroundColor: "#ffffff",
        }}
      >
        {ActiveComponent && <ActiveComponent />}
      </div>

      <div
        style={{
          marginTop: "32px",
          padding: "20px",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
          border: "1px solid #e9ecef",
        }}
      >
        <h3
          style={{
            margin: "0 0 16px 0",
            color: "#333",
            textAlign: "center",
            fontSize: "18px",
          }}
        >
          Method Comparison & Use Cases
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {methods.map((method) => (
            <div
              key={method.id}
              style={{
                padding: "16px",
                backgroundColor: "white",
                borderRadius: "4px",
                border: "1px solid #dee2e6",
              }}
            >
              <h4
                style={{
                  margin: "0 0 8px 0",
                  color: "#007bff",
                  fontSize: "16px",
                }}
              >
                {method.name}
              </h4>
              <p
                style={{
                  margin: "0 0 12px 0",
                  color: "#666",
                  fontSize: "13px",
                }}
              >
                {method.description}
              </p>
              <div style={{ fontSize: "12px", color: "#888" }}>
                <strong>Best for:</strong>
                <ul style={{ margin: "4px 0 0 0", paddingLeft: "16px" }}>
                  {method.id === "intersection-observer" && (
                    <>
                      <li>Production applications</li>
                      <li>High-performance requirements</li>
                      <li>Modern browsers</li>
                    </>
                  )}
                  {method.id === "scroll-event" && (
                    <>
                      <li>Simple implementations</li>
                      <li>Basic requirements</li>
                      <li>Learning purposes</li>
                    </>
                  )}
                  {method.id === "button-trigger" && (
                    <>
                      <li>User control preference</li>
                      <li>Accessibility requirements</li>
                      <li>Predictable loading</li>
                    </>
                  )}
                  {method.id === "throttled-scroll" && (
                    <>
                      <li>Performance optimization</li>
                      <li>Scroll-heavy applications</li>
                      <li>Balanced approach</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductPaginationDemo;
