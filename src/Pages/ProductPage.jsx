import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaChevronLeft, FaChevronRight, FaEye } from "react-icons/fa";
import { useToast } from "../Component/Toast";
import { useAnimatedMessage } from "../Component/AnimatedMessage";
import { ButtonLoading, FullPageLoading } from "../Component/Loading";

function ProductPage({ userData }) {
  const navigate = useNavigate();
  const { showSuccess, showError, showInfo } = useToast();
  const {
    showSuccess: showAnimatedSuccess,
    showError: showAnimatedError,
    showInfo: showAnimatedInfo,
    MessageContainer
  } = useAnimatedMessage();

  // Check if user has admin role
  const isAdmin = userData?.role === 'admin' || userData?.role === 'administrator';

  // State management
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const itemsPerPage = 10;

  // Filter and search state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("nama");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [currentPage, searchTerm, selectedCategory, sortBy, sortOrder]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Build query parameters
      const params = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        sort: sortBy,
        order: sortOrder
      });

      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('category_id', selectedCategory);

      const response = await fetch(`https://stechno.up.railway.app/api/product?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();

        // Handle different API response formats
        if (data.data && Array.isArray(data.data)) {
          setProducts(data.data);
          setTotalPages(data.totalPages || Math.ceil(data.total / itemsPerPage));
          setTotalProducts(data.total || data.data.length);
        } else if (Array.isArray(data)) {
          setProducts(data);
          setTotalPages(Math.ceil(data.length / itemsPerPage));
          setTotalProducts(data.length);
        } else {
          setProducts([]);
        }
      } else {
        throw new Error("Failed to fetch products");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      showError("Failed to load products. Please try again.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

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
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleDelete = async (productId, productName) => {
    if (!isAdmin) {
      showAnimatedError("Access denied. Only administrators can delete products.");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeleteLoading(productId);
      showAnimatedInfo("Deleting product...");

      const token = localStorage.getItem("token");
      const response = await fetch(`https://stechno.up.railway.app/api/product/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        showAnimatedSuccess(`🗑️ Product "${productName}" deleted successfully!`);
        fetchProducts(); // Refresh the list
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      showAnimatedError(`❌ ${error.message || "Failed to delete product. Please try again."}`);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching

    // Debounce search to avoid too many API calls
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      console.log("Searching for:", value);
    }, 300);

    setSearchTimeout(timeout);
  };



  const handleCategoryFilter = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(price);
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.nama : 'No Category';
  };

  if (loading && currentPage === 1) {
    return <FullPageLoading message="Loading products..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-6">
      <MessageContainer />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-blue-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Product Management
              </h1>
              <p className="text-blue-600 mt-2">
                Manage your product inventory ({totalProducts} products)
              </p>
            </div>

            {isAdmin && (
              <button
                onClick={() => navigate("/products/add")}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FaPlus /> Add Product
              </button>
            )}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-blue-200">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
              <select
                value={selectedCategory}
                onChange={handleCategoryFilter}
                className="w-full pl-10 pr-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.nama}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={sortBy}
              onChange={(e) => handleSort(e.target.value)}
              className="px-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="nama">Sort by Name</option>
              <option value="harga">Sort by Price</option>
              <option value="stock">Sort by Stock</option>
              <option value="created_at">Sort by Date</option>
            </select>

            <button
              onClick={() => handleSort(sortBy)}
              className="px-4 py-3 border border-blue-300 rounded-xl hover:bg-blue-50 transition-all duration-200"
            >
              {sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-blue-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Product</th>
                  <th className="px-6 py-4 text-left font-semibold">Code</th>
                  <th className="px-6 py-4 text-left font-semibold">Category</th>
                  <th className="px-6 py-4 text-left font-semibold">Supplier</th>
                  <th className="px-6 py-4 text-left font-semibold">Price</th>
                  <th className="px-6 py-4 text-left font-semibold">Stock</th>
                  <th className="px-6 py-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-blue-600">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-blue-600">
                      No products found. {isAdmin && "Click 'Add Product' to get started."}
                    </td>
                  </tr>
                ) : (
                  products.map((product, index) => (
                    <tr key={product.id} className={index % 2 === 0 ? "bg-blue-50" : "bg-white"}>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-blue-800">{product.nama}</div>
                          {product.deskripsi && (
                            <div className="text-sm text-blue-600 truncate max-w-xs">
                              {product.deskripsi}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-blue-700 font-mono">{product.produk_kode}</td>
                      <td className="px-6 py-4 text-blue-600">
                        {product.category_nama || getCategoryName(product.category_id)}
                      </td>
                      <td className="px-6 py-4 text-blue-600">
                        {product.supplier_nama || 'No Supplier'}
                      </td>
                      <td className="px-6 py-4 text-blue-800 font-semibold">{formatPrice(product.harga)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          product.stock > 10
                            ? 'bg-green-100 text-green-800'
                            : product.stock > 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => navigate(`/products/${product.id}`)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200"
                            title="View Details"
                          >
                            <FaEye />
                          </button>

                          {isAdmin && (
                            <>
                              <button
                                onClick={() => navigate(`/products/edit/${product.id}`)}
                                className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-all duration-200"
                                title="Edit Product"
                              >
                                <FaEdit />
                              </button>

                              <ButtonLoading
                                onClick={() => handleDelete(product.id, product.nama)}
                                loading={deleteLoading === product.id}
                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200"
                                title="Delete Product"
                              >
                                <FaTrash />
                              </ButtonLoading>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-blue-50 px-6 py-4 border-t border-blue-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-blue-600">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalProducts)} of {totalProducts} products
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <FaChevronLeft /> Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'text-blue-600 border border-blue-300 hover:bg-blue-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Next <FaChevronRight />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
