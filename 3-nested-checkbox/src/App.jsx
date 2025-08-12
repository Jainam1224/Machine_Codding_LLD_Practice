import { useEffect, useRef, useState } from "react";
import "./App.css";

const STATUS = {
  CHECKED: "checked",
  UNCHECKED: "unchecked",
  INDETERMINATE: "indeterminate",
};

const data = [
  {
    id: "root1",
    label: "Work Projects",
    status: STATUS.INDETERMINATE,
    children: [
      {
        id: "projectX",
        label: "Project X",
        status: STATUS.INDETERMINATE,
        children: [
          {
            id: "ux",
            label: "UX Design",
            status: STATUS.INDETERMINATE,
            children: [
              {
                id: "wireframes",
                label: "Wireframes.sketch",
                status: STATUS.CHECKED,
              },
              {
                id: "prototype",
                label: "Prototype.fig",
                status: STATUS.UNCHECKED,
              },
            ],
          },
          {
            id: "dev",
            label: "Development",
            status: STATUS.INDETERMINATE,
            children: [
              {
                id: "frontend",
                label: "Frontend",
                status: STATUS.CHECKED,
              },
              {
                id: "backend",
                label: "Backend",
                status: STATUS.UNCHECKED,
              },
            ],
          },
        ],
      },
      {
        id: "projectY",
        label: "Project Y",
        status: STATUS.UNCHECKED,
        children: [
          {
            id: "research",
            label: "Research",
            status: STATUS.UNCHECKED,
          },
        ],
      },
    ],
  },
  {
    id: "root2",
    label: "Personal",
    status: STATUS.UNCHECKED,
    children: [
      {
        id: "finance",
        label: "Finance",
        status: STATUS.UNCHECKED,
        children: [
          {
            id: "tax2023",
            label: "Tax 2023",
            status: STATUS.UNCHECKED,
          },
          {
            id: "investments",
            label: "Investments",
            status: STATUS.UNCHECKED,
          },
        ],
      },
      {
        id: "travel",
        label: "Travel Plans",
        status: STATUS.UNCHECKED,
        children: [
          {
            id: "europe",
            label: "Europe Trip",
            status: STATUS.UNCHECKED,
            children: [
              {
                id: "flights",
                label: "Flight Bookings",
                status: STATUS.UNCHECKED,
              },
              {
                id: "hotels",
                label: "Hotel Reservations",
                status: STATUS.UNCHECKED,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "root3",
    label: "Archived",
    status: STATUS.UNCHECKED,
    children: [],
  },
];

function Checkbox({ label, status, handleChange, id }) {
  const checkboxRef = useRef();

  useEffect(() => {
    if (status === STATUS.INDETERMINATE) {
      checkboxRef.current.indeterminate = true;
    } else {
      checkboxRef.current.indeterminate = false;
    }
  }, [status]);

  return (
    <div>
      <input
        ref={checkboxRef}
        type="checkbox"
        onChange={() => handleChange(id)}
        checked={status === STATUS.CHECKED}
      />
      <label>{label}</label>
    </div>
  );
}

function InderminateCheckbox({ checkboxData, handleChange }) {
  return (
    <div style={{ marginLeft: 15, marginBottom: 5 }}>
      {checkboxData.map((item) => {
        return (
          <div key={item.id}>
            <Checkbox
              id={item.id}
              handleChange={handleChange}
              label={item.label}
              status={item.status}
            />
            {item.children && item.children.length > 0 && (
              <InderminateCheckbox
                checkboxData={item.children}
                handleChange={handleChange}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function App() {
  const [checkboxState, setCheckboxState] = useState(data);

  const computeStatus = (node) => {
    if (!node.children || !node.children.length > 0) {
      return;
    }

    let checkedCount = 0;
    let uncheckedCount = 0;
    let indeterminateCount = 0;

    node.children.map((child) => {
      if (child.status === STATUS.CHECKED) checkedCount++;
      if (child.status === STATUS.UNCHECKED) uncheckedCount++;
      if (child.status === STATUS.INDETERMINATE) indeterminateCount++;
    });

    if (checkedCount === node.children.length) {
      node.status = STATUS.CHECKED;
    } else if (uncheckedCount === node.children.length) {
      node.status = STATUS.UNCHECKED;
    } else if (checkedCount > 0 || indeterminateCount > 0) {
      node.status = STATUS.INDETERMINATE;
    }
  };

  function traverseTree(targetId, node, isDescendent, ancestorStatus) {
    if (targetId === node.id) {
      if (node.status === STATUS.CHECKED) {
        node.status = STATUS.UNCHECKED;
      } else {
        node.status = STATUS.CHECKED;
      }
    }
    if (isDescendent) {
      node.status = ancestorStatus;
    }

    if (node.children && node.children.length > 0) {
      node.children.map((child) => {
        traverseTree(
          targetId,
          child,
          node.id === targetId || isDescendent,
          node.status
        );
      });
    }

    // for parent checkboxes
    computeStatus(node);
  }

  function handleChange(targetId) {
    const cloneCheckboxState = JSON.parse(JSON.stringify(checkboxState));

    cloneCheckboxState.map((rootNode) => {
      traverseTree(targetId, rootNode);
    });

    setCheckboxState(cloneCheckboxState);
  }

  return (
    <div>
      <h1>Nested CheckBoxes</h1>
      <InderminateCheckbox
        handleChange={handleChange}
        checkboxData={checkboxState}
      />
    </div>
  );
}

export default App;
