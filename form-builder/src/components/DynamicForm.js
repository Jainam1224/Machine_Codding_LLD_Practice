import React, { useState, useEffect, useCallback, useMemo } from "react";
import { FormValidator } from "../utils/validation";

// Memoized form field components for better performance
const FormField = React.memo(
  ({ field, value, error, onChange, onCheckboxChange }) => {
    const handleInputChange = useCallback(
      (e) => {
        onChange(field.name, e.target.value);
      },
      [field.name, onChange]
    );

    const handleCheckboxChange = useCallback(
      (optionValue, checked) => {
        onCheckboxChange(field.name, optionValue, checked);
      },
      [field.name, onCheckboxChange]
    );

    const renderField = () => {
      const {
        name: fieldName,
        type,
        required,
        placeholder,
        options,
        description,
      } = field;

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
              aria-describedby={
                error
                  ? `${fieldName}-error`
                  : description
                  ? `${fieldName}-description`
                  : undefined
              }
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
              aria-describedby={
                error
                  ? `${fieldName}-error`
                  : description
                  ? `${fieldName}-description`
                  : undefined
              }
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
              aria-describedby={
                error
                  ? `${fieldName}-error`
                  : description
                  ? `${fieldName}-description`
                  : undefined
              }
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
              <div
                className="checkbox-group"
                role="group"
                aria-labelledby={`${fieldName}-label`}
              >
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
            <input
              type="checkbox"
              id={fieldName}
              name={fieldName}
              checked={value || false}
              onChange={(e) => onChange(fieldName, e.target.checked)}
              className="form-checkbox"
              aria-describedby={
                error
                  ? `${fieldName}-error`
                  : description
                  ? `${fieldName}-description`
                  : undefined
              }
            />
          );

        case "radio":
          return (
            <div
              className="radio-group"
              role="radiogroup"
              aria-labelledby={`${fieldName}-label`}
            >
              {options?.map((option, index) => (
                <label
                  key={`${option.value}-${index}`}
                  className="radio-option"
                >
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
              aria-describedby={
                error
                  ? `${fieldName}-error`
                  : description
                  ? `${fieldName}-description`
                  : undefined
              }
            />
          );
      }
    };

    return (
      <div className="form-field">
        <label
          htmlFor={field.name}
          className="form-label"
          id={`${field.name}-label`}
        >
          {field.label}
          {field.required && (
            <span className="required" aria-label="required">
              *
            </span>
          )}
        </label>

        {renderField()}

        {field.description && (
          <small className="field-description" id={`${field.name}-description`}>
            {field.description}
          </small>
        )}

        {error && (
          <div className="field-error" id={`${field.name}-error`} role="alert">
            {error}
          </div>
        )}
      </div>
    );
  }
);

// Main DynamicForm component with performance optimizations
const DynamicForm = React.memo(
  ({ schema, onSubmit, title = "Dynamic Form" }) => {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Memoize initial form data to prevent unnecessary re-initialization
    const initialFormData = useMemo(() => {
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
    }, [schema]);

    // Initialize form data only when schema changes
    useEffect(() => {
      setFormData(initialFormData);
      setErrors({});
    }, [initialFormData]);

    // Memoized input change handler
    const handleInputChange = useCallback(
      (fieldName, value) => {
        setFormData((prev) => ({
          ...prev,
          [fieldName]: value,
        }));

        // Clear error when user starts typing
        if (errors[fieldName]) {
          setErrors((prev) => ({ ...prev, [fieldName]: null }));
        }
      },
      [errors]
    );

    // Memoized checkbox change handler
    const handleCheckboxChange = useCallback(
      (fieldName, optionValue, checked) => {
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
        if (errors[fieldName]) {
          setErrors((prev) => ({ ...prev, [fieldName]: null }));
        }
      },
      [errors]
    );

    // Memoized form submission handler
    const handleSubmit = useCallback(
      async (e) => {
        e.preventDefault();

        if (isSubmitting) return; // Prevent double submission

        setIsSubmitting(true);

        try {
          // Use the FormValidator utility for validation
          const { errors: validationErrors, hasErrors } =
            FormValidator.validateForm(schema, formData);

          if (hasErrors) {
            setErrors(validationErrors);
            return;
          }

          // Form is valid, submit it
          await onSubmit(formData);

          // Reset form on successful submission
          setFormData(initialFormData);
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
      },
      [formData, schema, onSubmit, initialFormData, isSubmitting]
    );

    // Memoize form fields to prevent unnecessary re-renders
    const formFields = useMemo(
      () =>
        schema.map((field) => (
          <FormField
            key={field.name}
            field={field}
            value={formData[field.name]}
            error={errors[field.name]}
            onChange={handleInputChange}
            onCheckboxChange={handleCheckboxChange}
          />
        )),
      [schema, formData, errors, handleInputChange, handleCheckboxChange]
    );

    return (
      <div className="dynamic-form">
        <h2>{title}</h2>

        {errors.submit && (
          <div className="form-error" role="alert">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {formFields}

          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    );
  }
);

export default DynamicForm;
