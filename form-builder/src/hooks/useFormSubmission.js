import { useState, useCallback, useMemo } from "react";

// Custom hook for managing form submissions
export const useFormSubmission = (initialData = []) => {
  const [submissions, setSubmissions] = useState(initialData);

  // Memoized submission count to prevent unnecessary re-renders
  const submissionCount = useMemo(() => submissions.length, [submissions]);

  // Memoized latest submission for quick access
  const latestSubmission = useMemo(
    () => (submissions.length > 0 ? submissions[submissions.length - 1] : null),
    [submissions]
  );

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

  // Remove submission by ID
  const removeSubmission = useCallback((id) => {
    setSubmissions((prev) => prev.filter((sub) => sub.id !== id));
  }, []);

  // Get submission by ID
  const getSubmissionById = useCallback(
    (id) => {
      return submissions.find((sub) => sub.id === id);
    },
    [submissions]
  );

  // Update submission by ID
  const updateSubmission = useCallback((id, updates) => {
    setSubmissions((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, ...updates } : sub))
    );
  }, []);

  // Filter submissions by criteria
  const filterSubmissions = useCallback(
    (criteria) => {
      return submissions.filter((submission) => {
        return Object.entries(criteria).every(([key, value]) => {
          if (typeof value === "function") {
            return value(submission.data[key]);
          }
          return submission.data[key] === value;
        });
      });
    },
    [submissions]
  );

  return {
    submissions,
    submissionCount,
    latestSubmission,
    addSubmission,
    removeSubmission,
    getSubmissionById,
    updateSubmission,
    filterSubmissions,
  };
};
