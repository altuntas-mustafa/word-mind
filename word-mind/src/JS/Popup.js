import React from "react";

const Popup = ({ isVisible, onClose, type, message }) => {
  const bgColorClass = type === "success" ? "bg-green-600" : "bg-red-600";
  const hoverColorClass = type === "success" ? "hover:bg-green-700" : "hover:bg-red-700";
  const focusColorClass = type === "success" ? "focus:ring-green-400" : "focus:ring-red-400";

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-10 bg-black bg-opacity-50">
      <div className="bg-black text-white p-8 rounded-lg shadow-md">
        <p className={`text-white text-2xl font-semibold mb-4`}>{message}</p>
        <button
          className={`px-6 py-3 text-white rounded-lg text-lg ${bgColorClass} ${hoverColorClass} ${focusColorClass} focus:outline-none`}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Popup;
