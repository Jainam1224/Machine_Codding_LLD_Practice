import { useState, useRef, useEffect } from "react";
import "./MultiSelect.css";

export default function MultiSelect({
  options,
  value = [],
  onChange,
  placeholder = "Select options...",
  maxDisplayed = 3,
  searchable = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedValues, setSelectedValues] = useState(new Set(value));
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = searchable
    ? options.filter((option) =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm("");
    }
  };

  const handleSelect = (option) => {
    const newSelectedValues = new Set(selectedValues);

    if (newSelectedValues.has(option)) {
      newSelectedValues.delete(option);
    } else {
      newSelectedValues.add(option);
    }

    setSelectedValues(newSelectedValues);

    if (onChange) {
      onChange(Array.from(newSelectedValues));
    }
  };

  const handleRemove = (option, e) => {
    e.stopPropagation();
    const newSelectedValues = new Set(selectedValues);
    newSelectedValues.delete(option);
    setSelectedValues(newSelectedValues);

    if (onChange) {
      onChange(Array.from(newSelectedValues));
    }
  };

  const handleSelectAll = () => {
    const allOptions = new Set(options);
    setSelectedValues(allOptions);

    if (onChange) {
      onChange(Array.from(allOptions));
    }
  };

  const handleClearAll = () => {
    setSelectedValues(new Set());

    if (onChange) {
      onChange([]);
    }
  };

  const getDisplayText = () => {
    if (selectedValues.size === 0) {
      return placeholder;
    }

    if (selectedValues.size <= maxDisplayed) {
      return Array.from(selectedValues).join(", ");
    }

    return `${Array.from(selectedValues).slice(0, maxDisplayed).join(", ")} +${
      selectedValues.size - maxDisplayed
    } more`;
  };

  return (
    <div className="multi-select-container">
      <div className="multi-select-wrapper" ref={dropdownRef}>
        <div className="multi-select-input" onClick={handleToggle}>
          <div className="selected-values">
            {Array.from(selectedValues)
              .slice(0, maxDisplayed)
              .map((value) => (
                <span key={value} className="selected-tag">
                  {value}
                  <button
                    className="remove-tag"
                    onClick={(e) => handleRemove(value, e)}
                  >
                    ×
                  </button>
                </span>
              ))}
            {selectedValues.size > maxDisplayed && (
              <span className="more-count">
                +{selectedValues.size - maxDisplayed} more
              </span>
            )}
            {selectedValues.size === 0 && (
              <span className="placeholder-text">{placeholder}</span>
            )}
          </div>
          <span className={`dropdown-arrow ${isOpen ? "open" : ""}`}>▼</span>
        </div>

        {isOpen && (
          <div className="multi-select-dropdown">
            {searchable && (
              <div className="search-input-container">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search options..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            <div className="dropdown-actions">
              <button
                className="action-button select-all"
                onClick={handleSelectAll}
              >
                Select All
              </button>
              <button
                className="action-button clear-all"
                onClick={handleClearAll}
              >
                Clear All
              </button>
            </div>

            <div className="options-list">
              {filteredOptions.map((option) => (
                <div
                  key={option}
                  className={`option-item ${
                    selectedValues.has(option) ? "selected" : ""
                  }`}
                  onClick={() => handleSelect(option)}
                >
                  <input
                    type="checkbox"
                    checked={selectedValues.has(option)}
                    onChange={() => {}} // Controlled by parent click
                    className="option-checkbox"
                  />
                  <span className="option-text">{option}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
