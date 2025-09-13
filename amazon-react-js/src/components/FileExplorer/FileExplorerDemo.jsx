import { useState } from "react";
import FileExplorer from "./FileExplorer";

const sampleFiles = [
  {
    name: "Documents",
    type: "folder",
    path: "/Documents",
    children: [
      {
        name: "Work",
        type: "folder",
        path: "/Documents/Work",
        children: [
          {
            name: "project1.js",
            type: "file",
            path: "/Documents/Work/project1.js",
            size: "2.5 KB",
            modified: "2024-01-15",
          },
          {
            name: "report.pdf",
            type: "file",
            path: "/Documents/Work/report.pdf",
            size: "1.2 MB",
            modified: "2024-01-14",
          },
        ],
      },
      {
        name: "Personal",
        type: "folder",
        path: "/Documents/Personal",
        children: [
          {
            name: "resume.docx",
            type: "file",
            path: "/Documents/Personal/resume.docx",
            size: "45 KB",
            modified: "2024-01-10",
          },
        ],
      },
    ],
  },
  {
    name: "Pictures",
    type: "folder",
    path: "/Pictures",
    children: [
      {
        name: "vacation.jpg",
        type: "file",
        path: "/Pictures/vacation.jpg",
        size: "3.2 MB",
        modified: "2024-01-12",
      },
      {
        name: "family.png",
        type: "file",
        path: "/Pictures/family.png",
        size: "1.8 MB",
        modified: "2024-01-08",
      },
    ],
  },
  {
    name: "src",
    type: "folder",
    path: "/src",
    children: [
      {
        name: "components",
        type: "folder",
        path: "/src/components",
        children: [
          {
            name: "Button.jsx",
            type: "file",
            path: "/src/components/Button.jsx",
            size: "1.1 KB",
            modified: "2024-01-16",
          },
          {
            name: "Modal.jsx",
            type: "file",
            path: "/src/components/Modal.jsx",
            size: "2.3 KB",
            modified: "2024-01-15",
          },
        ],
      },
      {
        name: "utils",
        type: "folder",
        path: "/src/utils",
        children: [
          {
            name: "helpers.js",
            type: "file",
            path: "/src/utils/helpers.js",
            size: "800 B",
            modified: "2024-01-14",
          },
        ],
      },
      {
        name: "App.jsx",
        type: "file",
        path: "/src/App.jsx",
        size: "1.5 KB",
        modified: "2024-01-16",
      },
    ],
  },
];

export default function FileExplorerDemo() {
  const [files, setFiles] = useState(sampleFiles);

  const handleFilesChange = (newFiles) => {
    setFiles(newFiles);
  };

  return (
    <div className="file-explorer-demo-container">
      <h2>File Explorer</h2>

      <div className="demo-section">
        <FileExplorer files={files} onFilesChange={handleFilesChange} />
      </div>
    </div>
  );
}
