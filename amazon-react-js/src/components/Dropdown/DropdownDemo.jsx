import { useState } from "react";
import Dropdown from "./Dropdown";

const fruits = [
  "Apple",
  "Banana",
  "Cherry",
  "Date",
  "Elderberry",
  "Fig",
  "Grape",
  "Honeydew",
  "Kiwi",
  "Lemon",
  "Mango",
  "Orange",
  "Papaya",
  "Quince",
];

export default function DropdownDemo() {
  const [selectedFruit, setSelectedFruit] = useState(null);

  const handleSelect = (fruit) => {
    setSelectedFruit(fruit);
  };

  return (
    <div>
      <h2>Dropdown</h2>
      <Dropdown
        options={fruits}
        onSelect={handleSelect}
        placeholder="Select a fruit..."
      />
      {selectedFruit && <p>Selected: {selectedFruit}</p>}
    </div>
  );
}
