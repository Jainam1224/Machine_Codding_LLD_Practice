import { useState } from "react";
import MultiSelect from "./MultiSelect";

const skills = [
  "JavaScript",
  "React",
  "Node.js",
  "Python",
  "Java",
  "C++",
  "TypeScript",
  "HTML",
  "CSS",
  "SQL",
  "MongoDB",
  "PostgreSQL",
  "AWS",
  "Docker",
  "Git",
  "Redux",
  "Vue.js",
  "Angular",
  "Express.js",
  "Django",
];

const countries = [
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "France",
  "Japan",
  "Australia",
  "India",
  "Brazil",
  "Mexico",
  "Spain",
  "Italy",
  "Netherlands",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "Switzerland",
  "Austria",
];

export default function MultiSelectDemo() {
  const [selectedSkills, setSelectedSkills] = useState([]);

  const handleSkillsChange = (skills) => {
    setSelectedSkills(skills);
    console.log("Selected skills:", skills);
  };

  return (
    <div>
      <h2>Multi Select</h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <MultiSelect
          options={skills}
          value={selectedSkills}
          onChange={handleSkillsChange}
          placeholder="Select your skills..."
          maxDisplayed={3}
          searchable={true}
        />
        <p>Selected: {selectedSkills.length} skills</p>
      </div>
    </div>
  );
}
