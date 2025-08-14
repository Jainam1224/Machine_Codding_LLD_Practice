import "./style.css";

class NotesApp {
  constructor() {
    this.notes = [];
    this.nextId = 1;
    this.draggedNote = null;
    this.dragOffset = { x: 0, y: 0 };
    this.isDragging = false;
    this.startPosition = { x: 0, y: 0 };
    this.init();
  }

  init() {
    this.loadNotes();
    this.render();
    this.setupEventListeners();
  }

  loadNotes() {
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    if (savedNotes.length > 0) {
      this.notes = savedNotes;
      this.nextId = Math.max(...savedNotes.map((note) => note.id)) + 1;
    } else {
      // Create default notes if none exist
      this.notes = [
        {
          id: 1,
          text: "Link in bio for my Frontend Interview Prep Course",
          position: this.determineNewPosition(),
        },
        {
          id: 2,
          text: "Like this Video and Subscribe to Roadside Coder",
          position: this.determineNewPosition(),
        },
      ];
    }
  }

  saveNotes() {
    localStorage.setItem("notes", JSON.stringify(this.notes));
  }

  determineNewPosition() {
    const headerHeight = 70;
    const maxX = window.innerWidth - 220;
    const maxY = window.innerHeight - headerHeight - 140;

    return {
      x: Math.floor(Math.random() * maxX),
      y: headerHeight + Math.floor(Math.random() * maxY),
    };
  }

  render() {
    const app = document.querySelector("#app");
    app.innerHTML = `
      <div class="notes-container">
        <div class="input-section">
          <input 
            type="text" 
            id="noteInput" 
            placeholder="Enter note text..."
            class="note-input"
          />
          <button id="addNoteBtn" class="add-note-btn">
            Add Note
          </button>
        </div>
        
        <div id="notesArea" class="notes-area">
          <!-- Notes will be dynamically added here -->
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    document.getElementById("addNoteBtn").addEventListener("click", () => {
      this.createNote();
    });

    document.getElementById("noteInput").addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.createNote();
      }
    });

    // Global mouse event listeners for smooth dragging
    document.addEventListener("mousemove", (e) => {
      if (this.isDragging && this.draggedNote) {
        this.handleDragMove(e);
      }
    });

    document.addEventListener("mouseup", () => {
      if (this.isDragging) {
        this.handleDrop();
      }
    });
  }

  createNote() {
    const input = document.getElementById("noteInput");
    const text = input.value.trim();

    if (!text) return;

    const note = {
      id: this.nextId++,
      text: text,
      position: this.determineNewPosition(),
    };

    this.notes.push(note);
    this.saveNotes();
    this.renderNotes();
    this.animateNoteCreation(note.id);

    // Clear input
    input.value = "";
    input.focus();
  }

  renderNotes() {
    const notesArea = document.getElementById("notesArea");
    notesArea.innerHTML = this.notes
      .map(
        (note) => `
        <div 
          class="note" 
          id="note-${note.id}"
          style="
            left: ${note.position.x}px; 
            top: ${note.position.y}px;
          "
        >
          📌 ${note.text}
        </div>
      `
      )
      .join("");

    // Add mouse event listeners to each note
    this.notes.forEach((note) => {
      const noteElement = document.getElementById(`note-${note.id}`);
      this.setupNoteMouseListeners(noteElement, note.id);
    });
  }

  setupNoteMouseListeners(noteElement, noteId) {
    noteElement.addEventListener("mousedown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.startDrag(e, noteId);
    });
  }

  startDrag(e, noteId) {
    this.draggedNote = noteId;
    this.isDragging = true;

    const noteElement = document.getElementById(`note-${noteId}`);
    noteElement.classList.add("dragging");

    // Store start position for overlap checking
    const note = this.notes.find((n) => n.id === noteId);
    this.startPosition = { ...note.position };

    // Calculate offset from mouse to note position
    const rect = noteElement.getBoundingClientRect();
    this.dragOffset.x = e.clientX - rect.left;
    this.dragOffset.y = e.clientY - rect.top;

    // Prevent text selection during drag
    document.body.style.userSelect = "none";
    document.body.style.cursor = "grabbing";
  }

  handleDragMove(e) {
    if (!this.draggedNote) return;

    const note = this.notes.find((n) => n.id === this.draggedNote);
    if (note) {
      // Calculate new position based on mouse position and offset
      let newX = e.clientX - this.dragOffset.x;
      let newY = e.clientY - this.dragOffset.y;

      // Ensure note stays within bounds
      const maxX = window.innerWidth - 200;
      const maxY = window.innerHeight - 100;

      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));

      // Update note position
      note.position.x = newX;
      note.position.y = newY;

      // Update DOM element position
      this.updateNotePosition(note.id, newX, newY);
    }
  }

  handleDrop() {
    if (!this.draggedNote) return;

    const noteElement = document.getElementById(`note-${this.draggedNote}`);
    if (noteElement) {
      // Check for overlap
      if (this.checkForOverlap(this.draggedNote)) {
        // Revert to start position if overlap detected
        const note = this.notes.find((n) => n.id === this.draggedNote);
        note.position = { ...this.startPosition };
        this.updateNotePosition(note.id, note.position.x, note.position.y);
      } else {
        // Save the new position
        this.saveNotes();
      }

      noteElement.classList.remove("dragging");
      this.animateNoteDrop(this.draggedNote);
    }

    this.draggedNote = null;
    this.isDragging = false;
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
  }

  checkForOverlap(id) {
    const currentNoteElement = document.getElementById(`note-${id}`);
    const currentRect = currentNoteElement.getBoundingClientRect();

    return this.notes.some((note) => {
      if (note.id === id) return false;

      const otherNoteElement = document.getElementById(`note-${note.id}`);
      const otherRect = otherNoteElement.getBoundingClientRect();

      const overlap = !(
        currentRect.right < otherRect.left ||
        currentRect.left > otherRect.right ||
        currentRect.bottom < otherRect.top ||
        currentRect.top > otherRect.bottom
      );

      return overlap;
    });
  }

  updateNotePosition(noteId, x, y) {
    const noteElement = document.getElementById(`note-${noteId}`);
    if (noteElement) {
      noteElement.style.left = `${x}px`;
      noteElement.style.top = `${y}px`;
    }
  }

  animateNoteCreation(noteId) {
    const noteElement = document.getElementById(`note-${noteId}`);
    noteElement.style.transform = "scale(0)";
    noteElement.style.opacity = "0";

    setTimeout(() => {
      noteElement.style.transition = "all 0.3s ease";
      noteElement.style.transform = "scale(1)";
      noteElement.style.opacity = "1";
    }, 10);
  }

  animateNoteDrop(noteId) {
    const noteElement = document.getElementById(`note-${noteId}`);
    noteElement.style.transition = "all 0.2s ease";
    noteElement.style.transform = "scale(1.05)";

    setTimeout(() => {
      noteElement.style.transform = "scale(1)";
    }, 200);
  }
}

// Initialize the app
const notesApp = new NotesApp();
