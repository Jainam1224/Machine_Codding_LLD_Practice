// Validation utility functions - separated for reusability and testability
export class FormValidator {
  static validateField(field, value) {
    const errors = [];

    // Required field validation
    if (field.required && this.isEmpty(value)) {
      errors.push(`${field.label} is required`);
      return errors;
    }

    // Skip validation for empty non-required fields
    if (!field.required && this.isEmpty(value)) {
      return errors;
    }

    // Type-specific validation
    switch (field.type) {
      case "email":
        if (!this.isValidEmail(value)) {
          errors.push("Please enter a valid email address");
        }
        break;

      case "number":
        if (!this.isValidNumber(value, field.validation)) {
          errors.push(
            field.validation?.message || "Please enter a valid number"
          );
        }
        break;

      case "text":
      case "textarea":
        if (!this.isValidText(value, field)) {
          if (field.minLength && value.length < field.minLength) {
            errors.push(
              `${field.label} must be at least ${field.minLength} characters`
            );
          }
          if (field.maxLength && value.length > field.maxLength) {
            errors.push(
              `${field.label} must be no more than ${field.maxLength} characters`
            );
          }
        }
        break;
    }

    // Pattern validation
    if (field.validation?.pattern && !field.validation.pattern.test(value)) {
      errors.push(field.validation.message || "Invalid format");
    }

    // Custom validation
    if (field.validation?.custom) {
      const customError = field.validation.custom(value);
      if (customError) {
        errors.push(customError);
      }
    }

    return errors;
  }

  static validateForm(schema, formData) {
    const errors = {};
    let hasErrors = false;

    schema.forEach((field) => {
      const fieldErrors = this.validateField(field, formData[field.name]);
      if (fieldErrors.length > 0) {
        errors[field.name] = fieldErrors[0]; // Show first error
        hasErrors = true;
      }
    });

    return { errors, hasErrors };
  }

  static isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    }
    return value === null || value === undefined || value === "";
  }

  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidNumber(value, validation) {
    const num = Number(value);
    if (isNaN(num)) return false;

    if (validation?.min !== undefined && num < validation.min) return false;
    if (validation?.max !== undefined && num > validation.max) return false;

    return true;
  }

  static isValidText(value, field) {
    if (typeof value !== "string") return false;

    if (field.minLength && value.length < field.minLength) return false;
    if (field.maxLength && value.length > field.maxLength) return false;

    return true;
  }
}

// Performance-optimized validation cache
export class ValidationCache {
  constructor() {
    this.cache = new Map();
    this.maxSize = 100;
  }

  get(key) {
    return this.cache.get(key);
  }

  set(key, value) {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  clear() {
    this.cache.clear();
  }
}
