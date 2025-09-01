// Simple validation utility for form fields
export const validateForm = (schema, formData) => {
  const errors = {};
  let hasErrors = false;

  schema.forEach((field) => {
    const value = formData[field.name];

    // Required field validation
    if (
      field.required &&
      (!value || (Array.isArray(value) && value.length === 0))
    ) {
      errors[field.name] = `${field.label} is required`;
      hasErrors = true;
      return;
    }

    // Skip validation for empty non-required fields
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return;
    }

    // Pattern validation
    if (field.validation?.pattern && !field.validation.pattern.test(value)) {
      errors[field.name] = field.validation.message || "Invalid format";
      hasErrors = true;
    }

    // Length validation for text fields
    if (
      (field.type === "text" || field.type === "textarea") &&
      typeof value === "string"
    ) {
      if (field.minLength && value.length < field.minLength) {
        errors[
          field.name
        ] = `${field.label} must be at least ${field.minLength} characters`;
        hasErrors = true;
      }
      if (field.maxLength && value.length > field.maxLength) {
        errors[
          field.name
        ] = `${field.label} must be no more than ${field.maxLength} characters`;
        hasErrors = true;
      }
    }

    // Number validation
    if (field.type === "number") {
      const num = Number(value);
      if (isNaN(num)) {
        errors[field.name] = "Please enter a valid number";
        hasErrors = true;
      } else {
        if (field.validation?.min !== undefined && num < field.validation.min) {
          errors[field.name] = field.validation.message || "Number too small";
          hasErrors = true;
        }
        if (field.validation?.max !== undefined && num > field.validation.max) {
          errors[field.name] = field.validation.message || "Number too large";
          hasErrors = true;
        }
      }
    }
  });

  return { errors, hasErrors };
};
