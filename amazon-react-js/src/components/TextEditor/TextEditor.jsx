import { useState, useRef, useCallback, useMemo } from "react";
import "./TextEditor.css";

export default function TextEditor() {
  const [content, setContent] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const textAreaRef = useRef(null);

  const formatText = useCallback(
    (command) => {
      const textArea = textAreaRef.current;
      if (!textArea) return;

      const start = textArea.selectionStart;
      const end = textArea.selectionEnd;
      const selectedText = content.substring(start, end);

      let newText = "";

      switch (command) {
        case "bold":
          newText = `**${selectedText}**`;
          break;
        case "italic":
          newText = `*${selectedText}*`;
          break;
        case "uppercase":
          newText = selectedText.toUpperCase();
          break;
        case "lowercase":
          newText = selectedText.toLowerCase();
          break;
        default:
          return;
      }

      const newContent =
        content.substring(0, start) + newText + content.substring(end);
      setContent(newContent);
    },
    [content]
  );

  const clearText = useCallback(() => {
    setContent("");
  }, []);

  const handleFontSizeChange = useCallback((e) => {
    const value = parseInt(e.target.value) || 16;
    setFontSize(Math.max(8, Math.min(72, value)));
  }, []);

  const stats = useMemo(() => {
    const trimmedContent = content.trim();
    const words = trimmedContent.split(/\s+/).filter((word) => word.length > 0);

    return {
      wordCount: words.length,
      charCount: content.length,
      lineCount: content.split("\n").length,
    };
  }, [content]);

  return (
    <div className="text-editor-container">
      <h2>Text Editor</h2>

      <div
        className="editor-toolbar"
        role="toolbar"
        aria-label="Text formatting toolbar"
      >
        <button
          onClick={() => formatText("bold")}
          className="toolbar-btn"
          aria-label="Make text bold"
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => formatText("italic")}
          className="toolbar-btn"
          aria-label="Make text italic"
          title="Italic (Ctrl+I)"
        >
          <em>I</em>
        </button>
        <button
          onClick={() => formatText("uppercase")}
          className="toolbar-btn"
          aria-label="Convert to uppercase"
          title="Uppercase"
        >
          Aa
        </button>
        <button
          onClick={() => formatText("lowercase")}
          className="toolbar-btn"
          aria-label="Convert to lowercase"
          title="Lowercase"
        >
          aa
        </button>
        <label htmlFor="font-size">
          Size:
          <input
            id="font-size"
            type="number"
            value={fontSize}
            onChange={handleFontSizeChange}
            min="8"
            max="72"
            className="size-input"
            aria-label="Font size"
          />
        </label>
        <button
          onClick={clearText}
          className="clear-btn"
          aria-label="Clear all text"
        >
          Clear
        </button>
      </div>

      <div className="editor-content">
        <textarea
          ref={textAreaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start typing your text here..."
          className="editor-textarea"
          style={{ fontSize: `${fontSize}px` }}
          aria-label="Text editor"
        />
      </div>

      <div className="editor-stats" role="status" aria-live="polite">
        <div className="stat-item">
          <span className="stat-label">Words</span>
          <span className="stat-value">{stats.wordCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Characters</span>
          <span className="stat-value">{stats.charCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Lines</span>
          <span className="stat-value">{stats.lineCount}</span>
        </div>
      </div>
    </div>
  );
}
