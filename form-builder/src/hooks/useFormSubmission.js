import { useState } from "react";

// Custom hook for managing form submissions
export const useFormSubmission = (initialData = []) => {
  const [submissions, setSubmissions] = useState(initialData);

  // Simple computation - no need for useMemo
  const submissionCount = submissions.length;

  // Simple function with no dependencies - no need for useCallback
  const addSubmission = (formData) => {
    try {
      const newSubmission = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        data: { ...formData }, // Create a copy to prevent mutation
      };

      setSubmissions((prev) => [...prev, newSubmission]);
      return { success: true, submission: newSubmission };
    } catch (error) {
      console.error("Error adding submission:", error);
      return { success: false, error: error.message };
    }
  };

  return {
    submissions,
    submissionCount,
    addSubmission,
  };
};
