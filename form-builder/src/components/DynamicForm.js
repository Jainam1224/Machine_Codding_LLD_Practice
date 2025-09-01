import React, { useState, useEffect } from "react";
import { validateForm } from "../utils/validation";

const FormField = ({ field, value, error, onChange, onCheckboxChange }) => {
  // Simple event handlers - no need for useCallback due to changing dependencies
  const handleInputChange = (e) => {
    onChange(field.name, e.target.value);
  };

  const handleCheckboxChange = (optionValue, checked) => {
    onCheckboxChange(field.name, optionValue, checked);
  };

  const renderField = () => {
    const { name: fieldName, type, required, placeholder, options } = field;

    switch (type) {
      case "text":
      case "email":
      case "number":
        return (
          <input
            type={type}
            id={fieldName}
            name={fieldName}
            value={value || ""}
            onChange={handleInputChange}
            placeholder={placeholder}
            required={required}
            className={`form-input ${error ? "error" : ""}`}
          />
        );

      case "textarea":
        return (
          <textarea
            id={fieldName}
            name={fieldName}
            value={value || ""}
            onChange={handleInputChange}
            placeholder={placeholder}
            required={required}
            rows="3"
            className={`form-textarea ${error ? "error" : ""}`}
          />
        );

      case "select":
        return (
          <select
            id={fieldName}
            name={fieldName}
            value={value || ""}
            onChange={handleInputChange}
            required={required}
            className={`form-select ${error ? "error" : ""}`}
          >
            <option value="">{placeholder || "Select an option"}</option>
            {options?.map((option, index) => (
              <option key={`${option.value}-${index}`} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "checkbox":
        if (options && options.length > 0) {
          return (
            <div className="checkbox-group">
              {options.map((option, index) => (
                <label
                  key={`${option.value}-${index}`}
                  className="checkbox-option"
                >
                  <input
                    type="checkbox"
                    name={fieldName}
                    value={option.value}
                    checked={
                      Array.isArray(value) && value.includes(option.value)
                    }
                    onChange={(e) =>
                      handleCheckboxChange(option.value, e.target.checked)
                    }
                    className="form-checkbox"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          );
        }

        return (
          <label className="checkbox-option">
            <input
              type="checkbox"
              id={fieldName}
              name={fieldName}
              checked={value || false}
              onChange={(e) => onChange(fieldName, e.target.checked)}
              className="form-checkbox"
            />
            {field.label}
            {field.required && <span className="required">*</span>}
          </label>
        );

      case "radio":
        return (
          <div className="radio-group">
            {options?.map((option, index) => (
              <label key={`${option.value}-${index}`} className="radio-option">
                <input
                  type="radio"
                  name={fieldName}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onChange(fieldName, e.target.value)}
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
            id={fieldName}
            name={fieldName}
            value={value || ""}
            onChange={handleInputChange}
            placeholder={placeholder}
            required={required}
            className={`form-input ${error ? "error" : ""}`}
          />
        );
    }
  };

  return (
    <div className="form-field">
      {(field.type !== "checkbox" || field.options) && (
        <label htmlFor={field.name} className="form-label">
          {field.label}
          {field.required && <span className="required">*</span>}
        </label>
      )}

      {renderField()}

      {error && <div className="field-error">{error}</div>}
    </div>
  );
};

const DynamicForm = ({ schema, onSubmit }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getInitialFormData = () => {
    const data = {};
    schema.forEach((field) => {
      if (
        field.type === "checkbox" &&
        field.options &&
        field.options.length > 0
      ) {
        data[field.name] = [];
      } else {
        data[field.name] = field.defaultValue || "";
      }
    });
    return data;
  };

  useEffect(() => {
    setFormData(getInitialFormData());
    setErrors({});
  }, [schema]);

  const handleInputChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    // Clear error when user starts typing
    setErrors((prev) => {
      if (prev[fieldName]) {
        return { ...prev, [fieldName]: null };
      }
      return prev;
    });
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

    // Clear error when user makes selection
    setErrors((prev) => {
      if (prev[fieldName]) {
        return { ...prev, [fieldName]: null };
      }
      return prev;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return; // Prevent double submission

    setIsSubmitting(true);

    try {
      // Use simplified validation utility
      const { errors: validationErrors, hasErrors } = validateForm(
        schema,
        formData
      );

      if (hasErrors) {
        setErrors(validationErrors);
        return;
      }

      // Form is valid, submit it
      await onSubmit(formData);

      // Reset form on successful submission
      setFormData(getInitialFormData());
      setErrors({});
    } catch (error) {
      console.error("Form submission error:", error);
      setErrors({
        submit:
          "An error occurred while submitting the form. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formFields = schema.map((field) => (
    <FormField
      key={field.name}
      field={field}
      value={formData[field.name]}
      error={errors[field.name]}
      onChange={handleInputChange}
      onCheckboxChange={handleCheckboxChange}
    />
  ));

  return (
    <div className="dynamic-form">
      {errors.submit && <div className="form-error">{errors.submit}</div>}
      <form onSubmit={handleSubmit} noValidate>
        {formFields}
        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default DynamicForm;
