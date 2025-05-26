import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaEllipsisV } from 'react-icons/fa';
import AddCategoryModal from '../Component/AddCategoryModal';

const CategoriesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("https://stechno.up.railway.app/api/categories", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        setError("Gagal mengambil data kategori");
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Terjadi kesalahan saat mengambil data kategori");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/kategori/${categoryId}`);
  };

  const handleAddCategory = () => {
    setIsAddModalOpen(true);
  };

  const handleCategoryAdded = (newCategory) => {
    // Refresh kategori setelah menambahkan kategori baru
    fetchCategories();
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Kategori Produk</h2>
        <button 
          onClick={handleAddCategory}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <FaPlus /> Tambah Kategori
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div 
              key={category.id}
              className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="p-4 flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{category.nama}</h3>
                  <p className="text-sm text-gray-500">ID: {category.id}</p>
                  <div className="mt-2 flex items-center">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {category.product_count || 0} produk
                    </span>
                  </div>
                </div>
                <div className="dropdown relative">
                  <button 
                    className="p-2 hover:bg-gray-100 rounded-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaEllipsisV className="text-gray-500" />
                  </button>
                  <div className="dropdown-menu absolute right-0 hidden bg-white shadow-lg rounded-md p-2 z-10">
                    <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 w-full text-left rounded">
                      <FaEdit className="text-blue-500" /> Edit
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 w-full text-left rounded">
                      <FaTrash className="text-red-500" /> Hapus
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-3 border-t">
                <button 
                  className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/kategori/${category.id}`);
                  }}
                >
                  Lihat Produk
                </button>
              </div>
            </div>
          ))}

          {categories.length === 0 && (
            <div className="col-span-full p-8 text-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">Tidak ada kategori yang tersedia</p>
              <button
                onClick={handleAddCategory}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Tambah Kategori Baru
              </button>
            </div>
          )}
        </div>
      )}

      <AddCategoryModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleCategoryAdded}
      />
    </div>
  );
};

export default CategoriesPage;