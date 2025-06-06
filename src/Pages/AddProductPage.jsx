import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSave, FaTimes, FaArrowLeft, FaPlus } from "react-icons/fa";
import { useToast } from "../Component/Toast";
import { useAnimatedMessage } from "../Component/AnimatedMessage";
import { ButtonLoading } from "../Component/Loading";
import { useActivity } from "../context/ActivityContext";
import { ActivityTypes } from "../utils/activityLogger";

const AddProductPage = ({ userData }) => {
  const navigate = useNavigate();
  const { showSuccess, showError, showInfo } = useToast();
  const { logActivity } = useActivity();
  const {
    showSuccess: showAnimatedSuccess,
    showError: showAnimatedError,
    showInfo: showAnimatedInfo,
    MessageContainer
  } = useAnimatedMessage();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  // Simple add category state
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Check if user has admin role
  const isAdmin = userData?.role === 'admin' || userData?.role === 'administrator';

  const [formData, setFormData] = useState({
    produk_kode: "",
    nama: "",
    deskripsi: "",
    harga: "",
    stock: "",
    category_id: "",
    supplier_id: ""
  });

  useEffect(() => {
    // Redirect if not admin
    if (!isAdmin) {
      showError("Access denied. Only administrators can add products.");
      navigate("/products");
      return;
    }

    fetchCategories();
    fetchSuppliers();
  }, [isAdmin, navigate]);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://stechno.up.railway.app/api/categories", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://stechno.up.railway.app/api/suppliers", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setSuppliers(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Simple add category function
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      showAnimatedError("Please enter a category name");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // Generate category ID based on existing categories
      let categoryId;
      if (categories.length === 0) {
        categoryId = "CAT001";
      } else {
        // Find the highest existing category number
        const existingNumbers = categories
          .map(cat => cat.id)
          .filter(id => id && id.startsWith('CAT'))
          .map(id => parseInt(id.replace('CAT', '')))
          .filter(num => !isNaN(num));

        const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
        categoryId = `CAT${String(nextNumber).padStart(3, '0')}`;
      }

      const requestBody = {
        id: categoryId,
        nama: newCategoryName.trim()
      };

      console.log("Creating category with data:", requestBody);

      const response = await fetch("https://stechno.up.railway.app/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      console.log("Category creation response status:", response.status);

      if (response.ok) {
        const newCategory = await response.json();
        console.log("New category created:", newCategory);
        showAnimatedSuccess(`✨ Category "${newCategoryName}" created successfully!`);

        // Create category object with proper structure
        const categoryToAdd = {
          id: newCategory.id || categoryId,
          nama: newCategory.nama || newCategoryName.trim()
        };

        // Log activity
        logActivity(ActivityTypes.CATEGORY_ADDED, {
          name: categoryToAdd.nama,
          id: categoryToAdd.id
        }, userData?.id);

        // Add to categories list and select it
        setCategories(prev => [...prev, categoryToAdd]);
        setFormData(prev => ({
          ...prev,
          category_id: categoryToAdd.id
        }));

        // Reset form
        setNewCategoryName("");
        setShowAddCategory(false);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Category creation failed:", errorData);
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to create category`);
      }
    } catch (error) {
      console.error("Error creating category:", error);
      showAnimatedError(`Failed to create category: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form submitted with data:", formData);

    if (!formData.produk_kode || !formData.nama || !formData.harga || !formData.stock) {
      showAnimatedError("Please fill in all required fields (Product Code, Name, Price, Stock)");
      return;
    }

    setLoading(true);
    showAnimatedInfo("Adding product...");

    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token);

      const requestBody = {
        produk_kode: formData.produk_kode,
        nama: formData.nama,
        deskripsi: formData.deskripsi,
        harga: parseFloat(formData.harga),
        stock: parseInt(formData.stock),
        category_id: formData.category_id || null,
        supplier_id: formData.supplier_id || null
      };

      console.log("Request body:", requestBody);

      const response = await fetch("https://stechno.up.railway.app/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        const newProduct = await response.json();
        console.log("Product added successfully:", newProduct);
        showAnimatedSuccess(`🎉 Product "${formData.nama}" added successfully!`);

        // Log activity
        logActivity(ActivityTypes.PRODUCT_ADDED, {
          name: formData.nama,
          id: newProduct.id || 'unknown',
          code: formData.produk_kode,
          price: formData.harga,
          stock: formData.stock
        }, userData?.id);

        // Navigate after a short delay to show the success message
        setTimeout(() => {
          navigate("/products");
        }, 1500);
      } else {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to add product`);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      showAnimatedError(`❌ ${error.message || "Failed to add product. Please try again."}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-6">
      <MessageContainer />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Add New Product
              </h1>
              <p className="text-blue-600 mt-2">Fill in the form below to add a new product to inventory</p>
            </div>
            <button
              onClick={() => navigate("/products")}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-all duration-200"
            >
              <FaArrowLeft /> Back to Products
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Product Code *
                </label>
                <input
                  type="text"
                  name="produk_kode"
                  value={formData.produk_kode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product code (e.g., PDH-001)"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product name (e.g., Baju PDH HIMATIF)"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Price (IDR) *
                </label>
                <input
                  type="number"
                  name="harga"
                  value={formData.harga}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter price"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter stock quantity"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Category
                </label>
                <div className="space-y-3">
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.nama}
                      </option>
                    ))}
                  </select>

                  {/* Simple Add Category Button */}
                  <button
                    type="button"
                    onClick={() => setShowAddCategory(!showAddCategory)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    <FaPlus className="text-xs" />
                    {showAddCategory ? "Cancel" : "Add New Category"}
                  </button>

                  {/* Simple Add Category Form */}
                  {showAddCategory && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="Enter category name..."
                          className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                        />
                        <button
                          type="button"
                          onClick={handleAddCategory}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Supplier
                </label>
                <select
                  name="supplier_id"
                  value={formData.supplier_id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a supplier</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Description
                </label>
                <textarea
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product description (e.g., Baju PDH HIMATIF - 2025)"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-6 border-t border-blue-200">
              <ButtonLoading
                type="submit"
                loading={loading}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FaSave /> Add Product
              </ButtonLoading>

              <button
                type="button"
                onClick={() => navigate("/products")}
                className="flex items-center gap-2 px-6 py-3 border border-blue-300 text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200"
              >
                <FaTimes /> Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;
