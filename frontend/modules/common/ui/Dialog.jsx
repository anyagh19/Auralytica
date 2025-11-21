import React from "react";

function Dialog({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] animate-fadeIn"
        onClick={onClose}
      ></div>

      {/* Dialog Content */}
      <div
        className="
          relative z-50 bg-white rounded-xl shadow-xl 
          w-full max-w-lg 
          max-h-[85vh] 
          p-6 
          animate-scaleIn
          overflow-hidden
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
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
}

export default Dialog;
