import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEdit, FaSave, FaTimes, FaBox, FaTag, FaTruck, FaDollarSign, FaCubes } from "react-icons/fa";
import { useAnimatedMessage } from "../Component/AnimatedMessage";
import { ButtonLoading, FullPageLoading } from "../Component/Loading";
import AddCategoryModal from "../Component/AddCategoryModal";

const ProductIdPage = ({ userData }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    showSuccess: showAnimatedSuccess,
    showError: showAnimatedError,
    showInfo: showAnimatedInfo,
    MessageContainer
  } = useAnimatedMessage();

  // Check if user has admin role
  const isAdmin = userData?.role === 'admin' || userData?.role === 'administrator';

  // Check if user has staff role (staff can edit products)
  const isStaff = userData?.role === 'staff';

  // Check if user can edit products (admin or staff)
  const canEdit = isAdmin || isStaff;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);

  // Form state untuk edit
  const [form, setForm] = useState({
    produk_kode: "",
    nama: "",
    deskripsi: "",
    harga: "",
    stock: "",
    category_id: "",
    supplier_id: "",
  });

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("ID produk tidak ditemukan");
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `https://stechno.up.railway.app/api/product/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Gagal mengambil data produk");
        }

        const data = await response.json();
        setProduct(data);

        // Set form data
        setForm({
          produk_kode: data.produk_kode || "",
          nama: data.nama || "",
          deskripsi: data.deskripsi || "",
          harga: data.harga || "",
          stock: data.stock || "",
          category_id: data.category_id || "",
          supplier_id: data.supplier_id || "",
        });
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://stechno.up.railway.app/api/categories", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          console.error("Failed to fetch categories");
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  // Fetch suppliers
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://stechno.up.railway.app/api/suppliers", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setSuppliers(data);
        } else {
          console.error("Failed to fetch suppliers");
        }
      } catch (err) {
        console.error("Error fetching suppliers:", err);
      }
    };

    fetchSuppliers();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://stechno.up.railway.app/api/product/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setProduct(data.product || data);
        setIsEditing(false);
        showAnimatedSuccess(`✅ Product "${form.nama}" updated successfully!`);
      } else {
        setError(data.message || "Gagal memperbarui produk");
        showAnimatedError(`❌ ${data.message || "Failed to update product"}`);
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan");
      showAnimatedError(`❌ Network error occurred`);
      console.error("Error updating product:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/products");
  };

  // Fungsi dipanggil setelah kategori berhasil ditambahkan
  const handleCategoryAdded = (newCategory) => {
    setIsAddCategoryModalOpen(false);
    // Refresh kategori
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://stechno.up.railway.app/api/categories", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
          // Set form ke kategori baru
          setForm(prev => ({
            ...prev,
            category_id: newCategory.id
          }));
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  };

  if (loading) {
    return <FullPageLoading message="Loading product details..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-6">
        <MessageContainer />
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-200">
            <div className="text-center">
              <div className="text-6xl mb-4">❌</div>
              <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Product</h2>
              <p className="text-red-700 mb-6">{error}</p>
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl mx-auto"
              >
                <FaArrowLeft /> Back to Products
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-6">
        <MessageContainer />
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-yellow-200">
            <div className="text-center">
              <div className="text-6xl mb-4">📦</div>
              <h2 className="text-2xl font-bold text-yellow-600 mb-4">Product Not Found</h2>
              <p className="text-yellow-700 mb-6">The product you're looking for doesn't exist or has been removed.</p>
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl mx-auto"
              >
                <FaArrowLeft /> Back to Products
              </button>
            </div>
          </div>
        </div>
      </div>
    );
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
                {isEditing ? "Edit Product" : "Product Details"}
              </h1>
              <p className="text-blue-600 mt-2">
                {isEditing ? "Update product information" : `Viewing details for ${product.nama}`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {!isEditing && canEdit && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <FaEdit /> Edit Product
                </button>
              )}
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-all duration-200"
              >
                <FaArrowLeft /> Back to Products
              </button>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        {isEditing ? (
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
                    value={form.produk_kode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter product code"
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
                    value={form.nama}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter product name"
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
                    value={form.harga}
                    onChange={handleChange}
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
                    value={form.stock}
                    onChange={handleChange}
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
                    value={form.category_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.nama}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsAddCategoryModalOpen(true)}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    + Add New Category
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">
                    Supplier
                  </label>
                  <select
                    name="supplier_id"
                    value={form.supplier_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map(supplier => (
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
                    value={form.deskripsi}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter product description"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-6 border-t border-blue-200">
                <ButtonLoading
                  type="submit"
                  loading={loading}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <FaSave /> Save Changes
                </ButtonLoading>

                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-2 px-6 py-3 border border-blue-300 text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200"
                >
                  <FaTimes /> Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Product Details View */
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-200">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3 mb-3">
                    <FaBox className="text-blue-600 text-xl" />
                    <h3 className="text-lg font-semibold text-blue-800">Product Information</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-blue-600">Product Code</label>
                      <p className="text-lg font-mono text-blue-800 bg-white px-3 py-2 rounded-lg border border-blue-200 mt-1">
                        {product.produk_kode}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-blue-600">Product Name</label>
                      <p className="text-lg font-semibold text-blue-800 bg-white px-3 py-2 rounded-lg border border-blue-200 mt-1">
                        {product.nama}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-blue-600">Description</label>
                      <p className="text-gray-700 bg-white px-3 py-2 rounded-lg border border-blue-200 mt-1 min-h-[60px]">
                        {product.deskripsi || "No description available"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3 mb-3">
                    <FaDollarSign className="text-green-600 text-xl" />
                    <h3 className="text-lg font-semibold text-green-800">Pricing & Stock</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-green-600">Price</label>
                      <p className="text-2xl font-bold text-green-800 bg-white px-3 py-2 rounded-lg border border-green-200 mt-1">
                        Rp {Number(product.harga).toLocaleString('id-ID')}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-green-600">Stock Quantity</label>
                      <div className="flex items-center gap-2 mt-1">
                        <FaCubes className="text-green-600" />
                        <p className={`text-xl font-bold px-3 py-2 rounded-lg border ${
                          product.stock > 10
                            ? 'text-green-800 bg-green-100 border-green-200'
                            : product.stock > 5
                            ? 'text-yellow-800 bg-yellow-100 border-yellow-200'
                            : 'text-red-800 bg-red-100 border-red-200'
                        }`}>
                          {product.stock} units
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-3 mb-3">
                    <FaTag className="text-purple-600 text-xl" />
                    <h3 className="text-lg font-semibold text-purple-800">Category</h3>
                  </div>
                  <div className="bg-white px-4 py-3 rounded-lg border border-purple-200">
                    <p className="text-lg font-medium text-purple-800">
                      {product.category_nama ||
                       categories.find(c => c.id === product.category_id)?.nama ||
                       "No category assigned"}
                    </p>
                  </div>
                </div>

                <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
                  <div className="flex items-center gap-3 mb-3">
                    <FaTruck className="text-orange-600 text-xl" />
                    <h3 className="text-lg font-semibold text-orange-800">Supplier</h3>
                  </div>
                  <div className="bg-white px-4 py-3 rounded-lg border border-orange-200">
                    <p className="text-lg font-medium text-orange-800">
                      {product.supplier_nama ||
                       suppliers.find(s => s.id === product.supplier_id)?.nama ||
                       "No supplier assigned"}
                    </p>
                  </div>
                </div>

                {/* Product ID */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <FaBox className="text-gray-600 text-xl" />
                    <h3 className="text-lg font-semibold text-gray-800">Product ID</h3>
                  </div>
                  <div className="bg-white px-4 py-3 rounded-lg border border-gray-200">
                    <p className="text-lg font-mono text-gray-800">
                      {product.id}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal untuk menambah kategori baru */}
        <AddCategoryModal
          isOpen={isAddCategoryModalOpen}
          onClose={() => setIsAddCategoryModalOpen(false)}
          onSuccess={handleCategoryAdded}
        />
      </div>
    </div>
  );
};

export default ProductIdPage;
