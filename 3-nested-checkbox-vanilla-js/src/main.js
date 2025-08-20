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
    this.checkboxState = JSON.parse(JSON.stringify(data)); // creates the copy of data so "data" remains immutable.
    this.container = document.getElementById("checkbox-container");
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.render();
  }

  setupEventListeners() {
    // Attach a single change listener to the main container.
    this.container.addEventListener("change", (event) => {
      if (event.target.type === "checkbox") {
        this.handleChange(event.target.id);
      }
    });
  }

  computeStatus(node) {
    if (!node.children?.length) {
      return;
    }

    // Optimized: Use reduce for single-pass counting instead of multiple forEach loops
    const statusCounts = node.children.reduce((acc, child) => {
      acc[child.status] = (acc[child.status] || 0) + 1;
      return acc;
    }, {});

    const totalChildren = node.children.length;

    if (statusCounts[STATUS.CHECKED] === totalChildren) {
      node.status = STATUS.CHECKED;
    } else if (statusCounts[STATUS.UNCHECKED] === totalChildren) {
      node.status = STATUS.UNCHECKED;
    } else if (
      statusCounts[STATUS.CHECKED] > 0 ||
      statusCounts[STATUS.INDETERMINATE] > 0
    ) {
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
    checkbox.setAttribute("data-id", item.id);

    if (item.status === STATUS.INDETERMINATE) {
      checkbox.indeterminate = true;
    }

    const label = document.createElement("label");
    label.htmlFor = item.id;
    label.textContent = item.label;

    checkboxContainer.appendChild(checkbox);
    checkboxContainer.appendChild(label);
    container.appendChild(checkboxContainer);

    // Add event listener (INDIVIDUAL CLICK HANDLER - WE CAN USE EVENT DELEGATION)
    // checkbox.addEventListener("change", () => {
    //   this.handleChange(item.id);
    // });

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
    // Clear the container before re-rendering the entire tree.
    this.container.innerHTML = "";

    this.checkboxState.forEach((item) => {
      const element = this.createCheckboxElement(item);
      this.container.appendChild(element);
    });
  }
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  new NestedCheckbox();
});
