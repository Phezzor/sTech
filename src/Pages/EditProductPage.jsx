import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import EditProduct from "../Component/EditProduct";

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fungsi dipanggil setelah edit produk berhasil
  const handleSuccess = (updatedProduct) => {
    alert("Produk berhasil diperbarui: " + updatedProduct.nama);
    navigate(`/produk/${id}`); // Redirect ke halaman detail produk
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Edit Produk</h1>
        <p className="text-gray-600">Perbarui informasi produk di bawah ini</p>
      </div>
      <EditProduct productId={id} onSuccess={handleSuccess} />
    </div>
  );
};

export default EditProductPage;