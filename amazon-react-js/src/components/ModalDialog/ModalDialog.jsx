import { useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import "./ModalDialog.css";

export default function ModalDialog({
  open = false,
  children,
  title,
  onClose,
  ...props
}) {
  if (!open) return null;

  return (
    <ModalDialogImpl
      children={children}
      title={title}
      onClose={onClose}
      {...props}
    />
  );
}

function ModalDialogImpl({ children, title, onClose }) {
  const modalRef = useRef(null);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    },
    [onClose]
  );

  const handleClickOutside = useCallback(
    (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose?.();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!onClose) return;

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleKeyDown, handleClickOutside, onClose]);

  return createPortal(
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div ref={modalRef} className="modal">
        <h1 id="modal-title" className="modal-title">
          {title}
        </h1>
        <div className="modal-content">{children}</div>
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          Close
        </button>
      </div>
    </div>,
    document.body
  );
}
