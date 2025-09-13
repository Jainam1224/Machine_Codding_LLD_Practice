import { useState, useEffect } from "react";
import "./NestedCheckboxes.css";

export default function NestedCheckboxes({
  data,
  onSelectionChange,
  initialSelection = [],
}) {
  const [selectedItems, setSelectedItems] = useState(new Set(initialSelection));

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(Array.from(selectedItems));
    }
  }, [selectedItems, onSelectionChange]);

  const getItemState = (item) => {
    const hasChildren = item.children && item.children.length > 0;

    if (!hasChildren) {
      return selectedItems.has(item.id) ? "checked" : "unchecked";
    }

    const childStates = item.children.map((child) => getItemState(child));
    const checkedChildren = childStates.filter(
      (state) => state === "checked"
    ).length;
    const indeterminateChildren = childStates.filter(
      (state) => state === "indeterminate"
    ).length;

    if (checkedChildren === item.children.length) {
      return "checked";
    } else if (checkedChildren > 0 || indeterminateChildren > 0) {
      return "indeterminate";
    } else {
      return "unchecked";
    }
  };

  const updateSelection = (item, checked) => {
    const newSelection = new Set(selectedItems);

    if (checked) {
      newSelection.add(item.id);
      // Add all children
      if (item.children) {
        item.children.forEach((child) => {
          newSelection.add(child.id);
          if (child.children) {
            child.children.forEach((grandChild) =>
              newSelection.add(grandChild.id)
            );
          }
        });
      }
    } else {
      newSelection.delete(item.id);
      // Remove all children
      if (item.children) {
        item.children.forEach((child) => {
          newSelection.delete(child.id);
          if (child.children) {
            child.children.forEach((grandChild) =>
              newSelection.delete(grandChild.id)
            );
          }
        });
      }
    }

    setSelectedItems(newSelection);
  };

  const renderItem = (item, level = 0) => {
    const state = getItemState(item);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div
        key={item.id}
        className="checkbox-item"
        style={{ paddingLeft: `${level * 20}px` }}
      >
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={state === "checked"}
            ref={(input) => {
              if (input) {
                input.indeterminate = state === "indeterminate";
              }
            }}
            onChange={(e) => updateSelection(item, e.target.checked)}
            className="checkbox-input"
          />
          <span className="checkbox-text">{item.label}</span>
        </label>

        {hasChildren && (
          <div className="children">
            {item.children.map((child) => renderItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="nested-checkboxes-container">
      <div className="checkboxes-list">
        {data.map((item) => renderItem(item))}
      </div>
    </div>
  );
}
