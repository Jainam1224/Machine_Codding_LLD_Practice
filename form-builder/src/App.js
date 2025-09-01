import React from "react";
import "./App.css";
import DynamicForm from "./components/DynamicForm";
import SubmissionsTable from "./components/SubmissionsTable";
import { useFormSubmission } from "./hooks/useFormSubmission";
import { USER_REGISTRATION_SCHEMA } from "./constants/formSchemas";
import "./components/DynamicForm.css";

function App() {
  const { submissions, submissionCount, addSubmission } = useFormSubmission([
    {
      id: 1,
      timestamp: new Date().toLocaleString(),
      data: {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        age: 28,
        phone: "+1-555-0123",
        gender: "male",
        country: "us",
        interests: ["technology", "sports", "music"],
        bio: "Software developer with passion for technology and sports",
        terms: true,
      },
    },
  ]);

  const handleFormSubmit = async (formData) => {
    try {
      const result = await addSubmission(formData);
      if (result.success) {
        console.log("Form submitted successfully:", result.submission);
      } else {
        console.error("Form submission failed:", result.error);
      }
    } catch (error) {
      console.error("Unexpected error during form submission:", error);
    }
  };

  const submissionsSection = (
    <div className="submissions-section">
      <div className="submissions-header">
        <h3>Form Submissions</h3>
        <div className="submissions-actions">
          <span className="submission-count">
            {submissionCount} submission{submissionCount !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <SubmissionsTable
        submissions={submissions}
        schema={USER_REGISTRATION_SCHEMA}
      />
    </div>
  );

  return (
    <div className="App">
      <header className="App-header">
        <h1>User Registration Form</h1>
      </header>

      <main>
        <div className="form-examples">
          <div className="form-section">
            <div className="form-container">
              <DynamicForm
                schema={USER_REGISTRATION_SCHEMA}
                onSubmit={handleFormSubmit}
              />
            </div>
          </div>
        </div>

        {submissionsSection}
      </main>
    </div>
  );
}

export default App;
