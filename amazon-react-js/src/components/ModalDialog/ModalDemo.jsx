import { useState } from "react";
import ModalDialog from "./ModalDialog";

export default function ModalDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="modal-demo-container">
      <h2>Modal Dialog</h2>

      <div className="demo-section">
        <button className="demo-button" onClick={() => setOpen(true)}>
          Show Modal
        </button>
      </div>

      <ModalDialog
        open={open}
        title="Modal Dialog"
        onClose={() => setOpen(false)}
      >
        <p>This is a modal dialog component built with React.</p>
        <p>It demonstrates portal rendering, event handling, and cleanup.</p>
      </ModalDialog>
    </div>
  );
}
