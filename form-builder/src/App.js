import React, { useState } from "react";
import "./App.css";
import DynamicForm from "./components/DynamicForm";
import "./components/DynamicForm.css";

function App() {
  const [submittedDataList, setSubmittedDataList] = useState([
    {
      id: 1,
      timestamp: new Date().toLocaleString(),
      formTitle: "Sample Entry",
      data: {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        age: 28,
        phone: "+1-555-0123",
        gender: "male",
        country: "us",
        interests: ["technology", "sports", "music"],
        bio: "Software developer with passion for technology and sports. Love playing guitar in free time.",
        newsletter: true,
        terms: true,
      },
    },
  ]);

  // Comprehensive user form schema with all input types
  const comprehensiveUserSchema = [
    {
      name: "firstName",
      type: "text",
      label: "First Name",
      required: true,
      placeholder: "Enter your first name",
      description: "Your first name",
    },
    {
      name: "lastName",
      type: "text",
      label: "Last Name",
      required: true,
      placeholder: "Enter your last name",
      description: "Your last name",
    },
    {
      name: "email",
      type: "email",
      label: "Email Address",
      required: true,
      placeholder: "Enter your email address",
      description: "Your email address",
    },
    {
      name: "age",
      type: "number",
      label: "Age",
      required: false,
      placeholder: "Enter your age",
      description: "Your age in years",
    },
    {
      name: "phone",
      type: "text",
      label: "Phone Number",
      required: false,
      placeholder: "Enter your phone number",
      description: "Your contact number",
    },
    {
      name: "gender",
      type: "radio",
      label: "Gender",
      required: true,
      options: [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
      ],
    },
    {
      name: "country",
      type: "select",
      label: "Country",
      required: true,
      options: [
        { value: "us", label: "United States" },
        { value: "uk", label: "United Kingdom" },
        { value: "ca", label: "Canada" },
        { value: "au", label: "Australia" },
        { value: "in", label: "India" },
        { value: "other", label: "Other" },
      ],
    },
    {
      name: "interests",
      type: "checkbox",
      label: "Interests",
      required: false,
      options: [
        { value: "technology", label: "Technology" },
        { value: "sports", label: "Sports" },
        { value: "music", label: "Music" },
        { value: "reading", label: "Reading" },
        { value: "travel", label: "Travel" },
        { value: "cooking", label: "Cooking" },
      ],
    },
    {
      name: "bio",
      type: "textarea",
      label: "Bio",
      required: false,
      placeholder: "Tell us about yourself",
      description: "A short description about yourself",
    },
    {
      name: "newsletter",
      type: "checkbox",
      label: "Subscribe to Newsletter",
      required: false,
    },
    {
      name: "terms",
      type: "checkbox",
      label: "I agree to the Terms and Conditions",
      required: true,
    },
  ];

  const handleFormSubmit = (data) => {
    const newSubmission = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      formTitle: "User Registration",
      data: data,
    };

    setSubmittedDataList((prev) => [...prev, newSubmission]);
  };

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
                schema={comprehensiveUserSchema}
                onSubmit={handleFormSubmit}
                title="User Registration"
              />
            </div>
          </div>
        </div>

        {/* All Submissions Table */}
        <div className="submissions-section">
          {submittedDataList.length === 0 ? (
            <div className="no-submissions">
              <p>No form submissions yet. Submit the form to see data here!</p>
            </div>
          ) : (
            <div className="submissions-table-container">
              <table className="submissions-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Time</th>
                    {comprehensiveUserSchema.map((field) => (
                      <th key={field.name}>{field.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {submittedDataList.map((submission) => (
                    <tr key={submission.id} className="submission-row">
                      <td className="submission-id">#{submission.id}</td>
                      <td className="submission-time">
                        {submission.timestamp}
                      </td>
                      {comprehensiveUserSchema.map((field) => {
                        const value = submission.data[field.name];
                        let displayValue = value;

                        // Format the value for display
                        if (typeof value === "boolean") {
                          displayValue = value ? "Yes" : "No";
                        } else if (
                          value === "" ||
                          value === null ||
                          value === undefined
                        ) {
                          displayValue = "-";
                        } else if (Array.isArray(value)) {
                          // Handle checkbox arrays (interests)
                          displayValue =
                            value.length > 0 ? value.join(", ") : "-";
                        }

                        return (
                          <td
                            key={field.name}
                            className="submission-field-value"
                          >
                            {displayValue}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
