import { useState, useRef, useEffect } from "react";
import "./ChipsInput.css";

const ChipsInput = () => {
  const [chips, setChips] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);

  const allSuggestions = [
    "JavaScript",
    "React",
    "Node.js",
    "Python",
    "Java",
    "TypeScript",
    "Vue.js",
    "Angular",
    "Express",
    "MongoDB",
    "PostgreSQL",
    "Redis",
  ];

  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = allSuggestions.filter(
        (suggestion) =>
          suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
          !chips.some((chip) => chip.toLowerCase() === suggestion.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputValue, chips]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      addChip(inputValue.trim());
    } else if (e.key === "Backspace" && !inputValue && chips.length > 0) {
      e.preventDefault();
      removeChip(chips.length - 1);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const addChip = (value) => {
    if (
      value &&
      !chips.some((chip) => chip.toLowerCase() === value.toLowerCase())
    ) {
      setChips((prev) => [...prev, value]);
      setInputValue("");
      setShowSuggestions(false);
    }
  };

  const removeChip = (index) => {
    setChips((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSuggestionClick = (suggestion) => {
    addChip(suggestion);
  };

  const clearAllChips = () => {
    setChips([]);
    setInputValue("");
    setShowSuggestions(false);
  };

  return (
    <div className="chips-container">
      <h2>Chips Input</h2>

      <div className="chips-input-wrapper">
        <div className="chips-display">
          {chips.map((chip, index) => (
            <div key={index} className="chip">
              <span className="chip-text">{chip}</span>
              <button onClick={() => removeChip(index)} className="chip-remove">
                ×
              </button>
            </div>
          ))}

          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={
              chips.length === 0 ? "Type and press Enter..." : "Add more..."
            }
            className="chips-input"
          />
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="suggestions-dropdown">
            {suggestions.slice(0, 5).map((suggestion, index) => (
              <div
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="suggestion-item"
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>

      {chips.length > 0 && (
        <div className="chips-actions">
          <button onClick={clearAllChips} className="clear-button">
            Clear All
          </button>
          <span className="chips-count">
            {chips.length} chip{chips.length !== 1 ? "s" : ""} selected
          </span>
        </div>
      )}
    </div>
  );
};

export default ChipsInput;
