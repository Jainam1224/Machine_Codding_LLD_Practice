import { useState } from "react";
import ScrollEventProductPagination from "./ScrollEventProductPagination";
import ButtonTriggerProductPagination from "./ButtonTriggerProductPagination";
import ThrottledScrollProductPagination from "./ThrottledScrollProductPagination";
import IntersectionObserverProductPagination from "./IntersectionObserverProductPagination";
import VirtualizedProductPagination from "./VirtualizedProductPagination";
import styles from "./ProductPaginationDemo.module.css";

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
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Product Pagination Methods Demo</h1>
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
      </div>

      <div className={styles.demoContainer}>
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
}

export default ProductPaginationDemo;
