import React, { useEffect, useRef, useCallback } from "react";
import ReactDOM from "react-dom";

function Dialog({ isOpen, onClose, title, children }) {
  const modalRef = useRef(null);

  // Handle escape key
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    },
    [isOpen, onClose]
  );

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  // Focus trap: ensure focus stays inside modal when open
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  // If modal is closed, render nothing
  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog Content */}
      <div
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "dialog-title" : undefined}
        className="
          relative z-50 bg-white rounded-xl shadow-xl 
          w-full max-w-lg 
          max-h-[85vh] 
          p-6 
          animate-scaleIn
          overflow-hidden
          focus:outline-none
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <h2 id="dialog-title" className="text-xl font-semibold text-gray-900 mb-4">
            {title}
          </h2>
        )}

        {/* Scrollable Body */}
        <div className="overflow-y-auto max-h-[60vh] pr-2 mb-4">
          {children}
        </div>

        {/* Footer */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="
              px-4 py-2 rounded-md 
              bg-gray-200 hover:bg-gray-300 
              text-gray-800 transition
            "
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  // Use portal to render modal outside of parent DOM hierarchy
  return ReactDOM.createPortal(modalContent, document.body);
}

export default Dialog;