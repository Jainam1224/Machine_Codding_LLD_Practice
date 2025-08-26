import { useState } from "react";
import AxiosWithIntersectionObserver from "./AxiosWithIntersectionObserver";
import FetchWithIntersectionObserver from "./FetchWithIntersectionObserver";
import ScrollEventBookSearch from "./ScrollEventBookSearch";
import ButtonTriggerBookSearch from "./ButtonTriggerBookSearch";
import ThrottledScrollBookSearch from "./ThrottledScrollBookSearch";

function SearchInfiniteScrollDemo() {
  const [activeMethod, setActiveMethod] = useState("axios-intersection");

  const methods = [
    {
      id: "axios-intersection",
      name: "Axios + Intersection Observer",
      component: AxiosWithIntersectionObserver,
      description:
        "Uses Axios with Intersection Observer for optimal performance",
    },
    {
      id: "fetch-intersection",
      name: "Fetch API + Intersection Observer",
      component: FetchWithIntersectionObserver,
      description:
        "Uses Fetch API with Intersection Observer (no external dependencies)",
    },
    {
      id: "throttled-scroll",
      name: "Throttled Scroll Method",
      component: ThrottledScrollBookSearch,
      description: "Scroll events with throttling for better performance",
    },
    {
      id: "scroll-event",
      name: "Scroll Event Method",
      component: ScrollEventBookSearch,
      description: "Simple scroll event detection for basic implementations",
    },
    {
      id: "button-trigger",
      name: "Button Trigger Method",
      component: ButtonTriggerBookSearch,
      description: "Manual control with load more button",
    },
  ];

  const ActiveComponent = methods.find((m) => m.id === activeMethod)?.component;

  return (
    <div style={{ padding: "16px", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h1 style={{ margin: "0 0 8px 0", fontSize: "20px" }}>
          Search Infinite Scroll Methods
        </h1>
        <p style={{ margin: "0", color: "#666", fontSize: "14px" }}>
          Different implementations for book search
        </p>
      </div>

      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <div
          style={{
            display: "flex",
            gap: "8px",
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: "12px",
          }}
        >
          {methods.map((method) => (
            <button
              key={method.id}
              onClick={() => setActiveMethod(method.id)}
              style={{
                padding: "6px 12px",
                backgroundColor:
                  activeMethod === method.id ? "#007bff" : "#f8f9fa",
                color: activeMethod === method.id ? "white" : "#333",
                border: "1px solid #dee2e6",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              {method.name}
            </button>
          ))}
        </div>

        <div style={{ fontSize: "12px", color: "#666" }}>
          {methods.find((m) => m.id === activeMethod)?.description}
        </div>
      </div>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "4px",
          padding: "16px",
        }}
      >
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
}

export default SearchInfiniteScrollDemo;
