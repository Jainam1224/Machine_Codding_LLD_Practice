import { useState, useCallback, useMemo } from "react";

// Custom hook for managing form submissions
export const useFormSubmission = (initialData = []) => {
  const [submissions, setSubmissions] = useState(initialData);

  // Memoized submission count to prevent unnecessary re-renders
  const submissionCount = useMemo(() => submissions.length, [submissions]);

  // Add new submission with proper error handling
  const addSubmission = useCallback((formData) => {
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
  }, []);

  return {
    submissions,
    submissionCount,
    addSubmission,
  };
};
