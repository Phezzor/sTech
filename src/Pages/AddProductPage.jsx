import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSave, FaTimes, FaArrowLeft } from "react-icons/fa";
import { useToast } from "../Component/Toast";
import { useAnimatedMessage } from "../Component/AnimatedMessage";
import { ButtonLoading } from "../Component/Loading";

const AddProductPage = ({ userData }) => {
  const navigate = useNavigate();
  const { showSuccess, showError, showInfo } = useToast();
  const {
    showSuccess: showAnimatedSuccess,
    showError: showAnimatedError,
    showInfo: showAnimatedInfo,
    MessageContainer
  } = useAnimatedMessage();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

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
