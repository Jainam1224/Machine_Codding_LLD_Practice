import { useState, useRef, useEffect } from "react";
import "./Autocomplete.css";

export default function Autocomplete({
  options,
  onSelect,
  placeholder = "Type to search...",
  maxSuggestions = 5,
}) {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = options
        .filter((option) =>
          option.toLowerCase().includes(inputValue.toLowerCase())
        )
        .slice(0, maxSuggestions);
      setFilteredOptions(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredOptions([]);
      setShowSuggestions(false);
    }
    setSelectedIndex(-1);
  }, [inputValue, options, maxSuggestions]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredOptions.length) {
          selectOption(filteredOptions[selectedIndex]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        inputRef.current?.blur();
        break;
    }
  };

  const selectOption = (option) => {
    setInputValue(option);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    if (onSelect) {
      onSelect(option);
    }
  };

  const handleSuggestionClick = (option) => {
    selectOption(option);
  };

  const handleBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <div className="autocomplete-container">
      <div className="autocomplete-wrapper">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="autocomplete-input"
        />

        {showSuggestions && filteredOptions.length > 0 && (
          <ul className="suggestions-list">
            {filteredOptions.map((option, index) => (
              <li
                key={option}
                className={`suggestion-item ${
                  index === selectedIndex ? "selected" : ""
                }`}
                onClick={() => handleSuggestionClick(option)}
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
