import { useState } from "react";
import AxiosWithIntersectionObserver from "./AxiosWithIntersectionObserver";
import FetchWithIntersectionObserver from "./FetchWithIntersectionObserver";
import ScrollEventBookSearch from "./ScrollEventBookSearch";
import ButtonTriggerBookSearch from "./ButtonTriggerBookSearch";
import ThrottledScrollBookSearch from "./ThrottledScrollBookSearch";
import styles from "./SearchInfiniteScrollDemo.module.css";

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
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Search Infinite Scroll Methods</h1>
        <p className={styles.subtitle}>
          Different implementations for book search
        </p>
      </div>

      <div className={styles.methodSelector}>
        <div className={styles.methodButtons}>
          {methods.map((method) => (
            <button
              key={method.id}
              onClick={() => setActiveMethod(method.id)}
              className={`${styles.methodButton} ${
                activeMethod === method.id ? styles.active : ""
              }`}
            >
              {method.name}
            </button>
          ))}
        </div>

        <div className={styles.methodDescription}>
          {methods.find((m) => m.id === activeMethod)?.description}
        </div>
      </div>

      <div className={styles.demoContainer}>
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
}

export default SearchInfiniteScrollDemo;
