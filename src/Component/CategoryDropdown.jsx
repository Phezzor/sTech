import React, { useState, useEffect } from "react";
import { FaTags, FaChevronDown, FaChevronUp, FaPlus } from "react-icons/fa";
import AddCategoryModal from "./AddCategoryModal";

const CategoryDropdown = ({ onCategorySelect, selectedCategory, onCategoryAdded }) => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState(null);
  const [showCategories, setShowCategories] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);

  // Fetch categories from API
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const token = localStorage.getItem("token");
      const response = await fetch("https://stechno.up.railway.app/api/categories", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        setCategoryError("Gagal mengambil data kategori");
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategoryError("Terjadi kesalahan saat mengambil data kategori");
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleCategorySelect = (category) => {
    onCategorySelect(category === selectedCategory ? null : category);
    setShowCategories(false);
  };

  const handleAddCategory = () => {
    setIsAddCategoryModalOpen(true);
  };

  const handleCategoryAdded = (newCategory) => {
    setIsAddCategoryModalOpen(false);
    fetchCategories(); // Refresh categories after adding a new one
    
    // Call parent callback if provided
    if (onCategoryAdded) {
      onCategoryAdded(newCategory);
    }
  };

  const toggleCategoriesDropdown = () => {
    setShowCategories(!showCategories);
  };

  if (loadingCategories) {
    return <div className="text-sm text-gray-500">Loading categories...</div>;
  }

  return (
    <div className="relative">
      {categoryError && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{categoryError}</div>
      )}
      
      <div className="flex items-center justify-between mb-2">
        <div 
          className="flex items-center gap-2 p-2 border rounded-md bg-gray-50 hover:bg-gray-100 cursor-pointer w-full"
          onClick={toggleCategoriesDropdown}
        >
          <FaTags className="text-gray-500" />
          <h3 className="font-medium">Kategori:</h3>
          <span className="text-blue-600 font-medium">
            {selectedCategory ? selectedCategory.nama : "Semua"}
          </span>
          <div className="ml-auto">
            {showCategories ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        </div>
        <button
          onClick={handleAddCategory}
          className="flex items-center justify-center p-2 ml-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          <FaPlus size={16} />
        </button>
      </div>
      
      {showCategories && (
        <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
          <div className="p-2">
            <button
              onClick={() => handleCategorySelect(null)}
              className={`w-full text-left px-3 py-2 rounded-md ${
                !selectedCategory 
                  ? "bg-blue-100 text-blue-700" 
                  : "hover:bg-gray-100"
              }`}
            >
              Semua
            </button>
            
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category)}
                className={`w-full text-left px-3 py-2 rounded-md ${
                  selectedCategory?.id === category.id 
                    ? "bg-blue-100 text-blue-700" 
                    : "hover:bg-gray-100"
                }`}
              >
                {category.nama}
              </button>
            ))}
            
            {categories.length === 0 && (
              <p className="text-sm text-gray-500 italic p-3">Belum ada kategori. Silakan tambahkan kategori baru.</p>
            )}
          </div>
        </div>
      )}
      
      <AddCategoryModal 
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
        onSuccess={handleCategoryAdded}
      />
    </div>
  );
};

export default CategoryDropdown;

