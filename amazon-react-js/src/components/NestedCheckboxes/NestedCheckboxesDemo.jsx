import { useState } from "react";
import NestedCheckboxes from "./NestedCheckboxes";

const sampleData = [
  {
    id: "fruits",
    label: "Fruits",
    children: [
      { id: "apple", label: "Apple" },
      { id: "banana", label: "Banana" },
      {
        id: "citrus",
        label: "Citrus",
        children: [
          { id: "orange", label: "Orange" },
          { id: "lemon", label: "Lemon" },
          { id: "lime", label: "Lime" },
        ],
      },
    ],
  },
  {
    id: "vegetables",
    label: "Vegetables",
    children: [
      {
        id: "leafy",
        label: "Leafy Greens",
        children: [
          { id: "spinach", label: "Spinach" },
          { id: "lettuce", label: "Lettuce" },
        ],
      },
      {
        id: "root",
        label: "Root Vegetables",
        children: [
          { id: "carrot", label: "Carrot" },
          { id: "potato", label: "Potato" },
        ],
      },
    ],
  },
  {
    id: "grains",
    label: "Grains",
    children: [
      { id: "rice", label: "Rice" },
      { id: "wheat", label: "Wheat" },
      { id: "oats", label: "Oats" },
    ],
  },
];

export default function NestedCheckboxesDemo() {
  const [selectedItems, setSelectedItems] = useState([]);

  const handleSelectionChange = (selection) => {
    setSelectedItems(selection);
    console.log("Selected items:", selection);
  };

  return (
    <div>
      <h2>Nested Checkboxes</h2>
      <p>
        Select parent items to automatically select all children. Indeterminate
        state shows partial selection.
      </p>

      <NestedCheckboxes
        data={sampleData}
        onSelectionChange={handleSelectionChange}
      />
    </div>
  );
}
