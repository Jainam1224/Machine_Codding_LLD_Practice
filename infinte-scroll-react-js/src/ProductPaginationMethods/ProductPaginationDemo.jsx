import { useState } from "react";
import ScrollEventProductPagination from "./ScrollEventProductPagination";
import ButtonTriggerProductPagination from "./ButtonTriggerProductPagination";
import ThrottledScrollProductPagination from "./ThrottledScrollProductPagination";
import IntersectionObserverProductPagination from "./IntersectionObserverProductPagination";
import VirtualizedProductPagination from "./VirtualizedProductPagination";

function ProductPaginationDemo() {
  const [activeMethod, setActiveMethod] = useState("virtualized");

  const methods = [
    {
      id: "virtualized",
      name: "Virtualized Infinite Scroll",
      component: VirtualizedProductPagination,
      description:
        "Performance optimized - only renders visible products in DOM",
    },
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
    </div>
  );
}

export default ProductPaginationDemo;
