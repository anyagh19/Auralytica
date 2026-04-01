import React from "react";
import { AlertTriangle } from "lucide-react";

function DeleteProductForm({ onSubmit, onCancel }) {
  const handleDelete = () => {
    onSubmit(); // call parent delete function
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Warning Icon & Message */}
      <div className="flex flex-col items-center text-center">
        <div className="bg-red-50 p-3 rounded-full mb-3">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-lg font-semibold text-gray-800">
          Are you sure you want to delete this product?
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          This action cannot be undone. The product will be permanently removed.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 w-full">
        <button
          onClick={handleDelete}
          className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-medium"
        >
          Yes, Delete
        </button>
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition font-medium"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default DeleteProductForm;