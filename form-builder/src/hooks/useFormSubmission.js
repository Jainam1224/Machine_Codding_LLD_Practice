import { useState } from "react";

export const useFormSubmission = (initialData = []) => {
  const [submissions, setSubmissions] = useState(initialData);

  const submissionCount = submissions.length;

  const addSubmission = (formData) => {
    try {
      const newSubmission = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        data: { ...formData },
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
