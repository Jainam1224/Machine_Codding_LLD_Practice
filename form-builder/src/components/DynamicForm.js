import React, { useState, useEffect } from "react";

const DynamicForm = ({ schema, onSubmit, title = "Dynamic Form" }) => {
  const [formData, setFormData] = useState({});

  // Initialize form data based on schema
  useEffect(() => {
    const initialData = {};
    schema.forEach((field) => {
      if (
        field.type === "checkbox" &&
        field.options &&
        field.options.length > 0
      ) {
        // Initialize multiple checkbox fields as empty arrays
        initialData[field.name] = [];
      } else {
        // Initialize other fields with default values or empty strings
        initialData[field.name] = field.defaultValue || "";
      }
    });
    setFormData(initialData);
  }, [schema]);

  const handleInputChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleCheckboxChange = (fieldName, optionValue, checked) => {
    setFormData((prev) => {
      const currentValues = prev[fieldName] || [];
      if (checked) {
        return {
          ...prev,
          [fieldName]: [...currentValues, optionValue],
        };
      } else {
        return {
          ...prev,
          [fieldName]: currentValues.filter((val) => val !== optionValue),
        };
      }
    });
  };

  const renderField = (field) => {
    const { name, type, required, placeholder, options } = field;

    switch (type) {
      case "text":
      case "email":
      case "number":
        return (
          <input
            type={type}
            id={name}
            name={name}
            value={formData[name] || ""}
            onChange={(e) => handleInputChange(name, e.target.value)}
            placeholder={placeholder}
            required={required}
            className="form-input"
          />
        );

      case "textarea":
        return (
          <textarea
            id={name}
            name={name}
            value={formData[name] || ""}
            onChange={(e) => handleInputChange(name, e.target.value)}
            placeholder={placeholder}
            required={required}
            rows="3"
            className="form-textarea"
          />
        );

      case "select":
        return (
          <select
            id={name}
            name={name}
            value={formData[name] || ""}
            onChange={(e) => handleInputChange(name, e.target.value)}
            required={required}
            className="form-select"
          >
            <option value="">{placeholder || "Select an option"}</option>
            {options?.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "checkbox":
        // If options exist, render multiple checkboxes for selection
        if (options && options.length > 0) {
          return (
            <div className="checkbox-group">
              {options.map((option, index) => (
                <label key={index} className="checkbox-option">
                  <input
                    type="checkbox"
                    name={name}
                    value={option.value}
                    checked={
                      Array.isArray(formData[name]) &&
                      formData[name].includes(option.value)
                    }
                    onChange={(e) =>
                      handleCheckboxChange(name, option.value, e.target.checked)
                    }
                    className="form-checkbox"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          );
        }

        // Single checkbox (like newsletter, terms)
        return (
          <input
            type="checkbox"
            id={name}
            name={name}
            checked={formData[name] || false}
            onChange={(e) => handleInputChange(name, e.target.checked)}
            className="form-checkbox"
          />
        );

      case "radio":
        return (
          <div className="radio-group">
            {options?.map((option, index) => (
              <label key={index} className="radio-option">
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={formData[name] === option.value}
                  onChange={(e) => handleInputChange(name, e.target.value)}
                  className="form-radio"
                />
                {option.label}
              </label>
            ))}
          </div>
        );

      default:
        return (
          <input
            type="text"
            id={name}
            name={name}
            value={formData[name] || ""}
            onChange={(e) => handleInputChange(name, e.target.value)}
            placeholder={placeholder}
            required={required}
            className="form-input"
          />
        );
    }
  };

  return (
    <div className="dynamic-form">
      <h2>{title}</h2>
      <form onSubmit={handleSubmit}>
        {schema.map((field) => (
          <div key={field.name} className="form-field">
            <label htmlFor={field.name} className="form-label">
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            {renderField(field)}
            {field.description && (
              <small className="field-description">{field.description}</small>
            )}
          </div>
        ))}
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default DynamicForm;
