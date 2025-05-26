import React from "react";
import { useNavigate } from "react-router-dom";
import AddProduct from "../Component/AddProduct";

const AddProductPage = () => {
  const navigate = useNavigate();

  // Fungsi dipanggil setelah tambah produk berhasil
  const handleSuccess = (newProduct) => {
    alert("Produk berhasil ditambahkan: " + newProduct.nama);
    navigate("/produk"); // Redirect ke halaman list produk
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tambah Produk Baru</h1>
        <p className="text-gray-600">Isi form berikut untuk menambahkan produk baru ke inventaris</p>
      </div>
      <AddProduct onSuccess={handleSuccess} />
    </div>
  );
};

export default AddProductPage;
