import { useState, useCallback } from "react";
import "./Accordion.css";

export default function Accordion({ items, allowMultiple = false }) {
  const [openItems, setOpenItems] = useState(new Set());

  const toggleItem = useCallback(
    (index) => {
      setOpenItems((prev) => {
        const newOpenItems = new Set(prev);

        if (prev.has(index)) {
          newOpenItems.delete(index);
        } else {
          if (!allowMultiple) {
            newOpenItems.clear();
          }
          newOpenItems.add(index);
        }

        return newOpenItems;
      });
    },
    [allowMultiple]
  );

  return (
    <div className="accordion-container">
      {items.map((item, index) => (
        <div key={index} className="accordion-item">
          <button
            className="accordion-header"
            onClick={() => toggleItem(index)}
            aria-expanded={openItems.has(index)}
          >
            <span>{item.title}</span>
            <span
              className={`accordion-icon ${openItems.has(index) ? "open" : ""}`}
              aria-hidden="true"
            >
              ▼
            </span>
          </button>
          {openItems.has(index) && (
            <div className="accordion-content" role="region">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
