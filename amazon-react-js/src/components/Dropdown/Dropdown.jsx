import { useState, useRef, useEffect } from "react";
import "./Dropdown.css";

export default function Dropdown({
  options,
  onSelect,
  placeholder = "Select an option...",
  value = null,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option) => {
    setSelectedValue(option);
    setIsOpen(false);
    if (onSelect) {
      onSelect(option);
    }
  };

  const displayValue = selectedValue || placeholder;

  return (
    <div className="dropdown-container">
      <div className="dropdown-wrapper" ref={dropdownRef}>
        <button className="dropdown-button" onClick={handleToggle}>
          <span>{displayValue}</span>
          <span className={`dropdown-arrow ${isOpen ? "open" : ""}`}>▼</span>
        </button>

        {isOpen && (
          <ul className="dropdown-menu">
            {options.map((option, index) => (
              <li
                key={index}
                className={`dropdown-item ${
                  selectedValue === option ? "selected" : ""
                }`}
                onClick={() => handleSelect(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
