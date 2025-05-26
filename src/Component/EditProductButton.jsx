import React from "react";
import { useNavigate } from "react-router-dom";

const EditProductButton = ({ productId, className = "" }) => {
  const navigate = useNavigate();

  const handleEdit = (e) => {
    if (e) e.stopPropagation(); // Prevent triggering parent click events
    navigate(`/edit-produk/${productId}`);
  };

  return (
    <button
      onClick={handleEdit}
      className={`bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 ${className}`}
    >
      Edit Produk
    </button>
  );
};

export default EditProductButton;