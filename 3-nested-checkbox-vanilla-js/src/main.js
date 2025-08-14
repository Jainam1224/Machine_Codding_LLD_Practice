import "./style.css";

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

class NestedCheckbox {
  constructor() {
    this.checkboxState = JSON.parse(JSON.stringify(data));
    this.init();
  }

  init() {
    this.render();
    this.attachEventListeners();
  }

  computeStatus(node) {
    if (!node.children || !node.children.length > 0) {
      return;
    }

    let checkedCount = 0;
    let uncheckedCount = 0;
    let indeterminateCount = 0;

    node.children.forEach((child) => {
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
  }

  traverseTree(targetId, node, isDescendent, ancestorStatus) {
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
      node.children.forEach((child) => {
        this.traverseTree(
          targetId,
          child,
          node.id === targetId || isDescendent,
          node.status
        );
      });
    }

    // for parent checkboxes
    this.computeStatus(node);
  }

  handleChange(targetId) {
    const cloneCheckboxState = JSON.parse(JSON.stringify(this.checkboxState));

    cloneCheckboxState.forEach((rootNode) => {
      this.traverseTree(targetId, rootNode);
    });

    this.checkboxState = cloneCheckboxState;
    this.render();
    this.attachEventListeners();
  }

  createCheckboxElement(item, level = 0) {
    const container = document.createElement("div");
    container.style.marginLeft = `${level * 15}px`;
    container.style.marginBottom = "5px";

    const checkboxContainer = document.createElement("div");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = item.id;
    checkbox.checked = item.status === STATUS.CHECKED;

    // Set indeterminate state
    if (item.status === STATUS.INDETERMINATE) {
      checkbox.indeterminate = true;
    }

    const label = document.createElement("label");
    label.htmlFor = item.id;
    label.textContent = item.label;

    checkboxContainer.appendChild(checkbox);
    checkboxContainer.appendChild(label);
    container.appendChild(checkboxContainer);

    // Add event listener
    checkbox.addEventListener("change", () => {
      this.handleChange(item.id);
    });

    // Add children if they exist
    if (item.children && item.children.length > 0) {
      item.children.forEach((child) => {
        const childElement = this.createCheckboxElement(child, level + 1);
        container.appendChild(childElement);
      });
    }

    return container;
  }

  render() {
    const app = document.querySelector("#app");
    app.innerHTML = "<h1>Nested CheckBoxes</h1>";

    const container = document.createElement("div");
    container.id = "checkbox-container";

    this.checkboxState.forEach((item) => {
      const element = this.createCheckboxElement(item);
      container.appendChild(element);
    });

    app.appendChild(container);
  }

  attachEventListeners() {
    // Event listeners are already attached in createCheckboxElement
    // This method is kept for consistency with the React version structure
  }
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  new NestedCheckbox();
});
