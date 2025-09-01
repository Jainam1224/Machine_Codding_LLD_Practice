// Data formatting utilities - separated for reusability and testability
export class FormDataFormatter {
  static formatValueForDisplay(value, fieldType) {
    if (value === null || value === undefined || value === "") {
      return "-";
    }

    switch (fieldType) {
      case "boolean":
        return value ? "Yes" : "No";

      case "array":
        return Array.isArray(value) && value.length > 0
          ? value.join(", ")
          : "-";

      case "string":
      default:
        return String(value);
    }
  }

  static getFieldType(value) {
    if (Array.isArray(value)) return "array";
    if (typeof value === "boolean") return "boolean";
    if (typeof value === "number") return "number";
    if (value instanceof Date) return "date";
    return "string";
  }

  static createTableHeaders(schema) {
    return schema.map((field) => ({
      key: field.name,
      label: field.label,
      type: field.type,
    }));
  }

  static createTableRows(submissions, schema) {
    return submissions.map((submission) => {
      const row = {
        id: submission.id,
        timestamp: submission.timestamp,
        data: {},
      };

      schema.forEach((field) => {
        const value = submission.data[field.name];
        row.data[field.name] = this.formatValueForDisplay(
          value,
          this.getFieldType(value)
        );
      });

      return row;
    });
  }
}
