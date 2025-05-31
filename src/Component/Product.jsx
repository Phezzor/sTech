import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEllipsisH, FaFilter, FaFileExport, FaPlus, FaSearch, FaTimes, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import CategoryDropdown from "./CategoryDropdown";
import { useToast } from "./Toast";
import { TableSkeleton, LoadingOverlay } from "./Loading";

function Product({ products: initialProducts, loading: initialLoading, error: initialError }) {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [products, setProducts] = useState(initialProducts || []);
  const [loading, setLoading] = useState(initialLoading || true);
  const [error, setError] = useState(initialError || null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchById, setSearchById] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showSuccess, showError, showInfo } = useToast();

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("https://stechno.up.railway.app/api/product", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        setError("Gagal mengambil data produk.");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Terjadi kesalahan saat mengambil data produk.");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products when category, search term, or search by ID changes
  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(product =>
        product.category_id === selectedCategory.id
      );
    }

    // Filter by search term (name)
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.nama?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by ID search
    if (searchById) {
      filtered = filtered.filter(product =>
        product.produk_kode?.toLowerCase().includes(searchById.toLowerCase()) ||
        product.id?.toString().includes(searchById)
      );
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [selectedCategory, products, searchTerm, searchById]);

  const handleSelectProduct = (productId) => {
    navigate(`/produk/${productId}`);
  };

  const navigateToAddProduct = () => {
    navigate('/tambah-produk');
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    // Refresh products when category changes
    fetchProducts();
  };

  const handleCategoryAdded = () => {
    // Refresh products after adding a new category
    fetchProducts();
  };

  // Format harga dengan benar
  const formatPrice = (price) => {
    try {
      return parseFloat(price).toLocaleString('id-ID', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    } catch (error) {
      return "0.00";
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleExport = () => {
    try {
      showInfo("Exporting products...");
      // Export functionality
      const csvContent = "data:text/csv;charset=utf-8,"
        + "Product Name,Product Code,Price,Stock,Category\n"
        + filteredProducts.map(product =>
            `${product.nama},${product.produk_kode},${product.harga},${product.stock},${product.category_nama || ''}`
          ).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "products.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showSuccess(`Successfully exported ${filteredProducts.length} products!`);
    } catch (error) {
      showError("Failed to export products. Please try again.");
    }
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setIsDeleting(true);
      showInfo("Deleting product...");

      const token = localStorage.getItem("token");
      const response = await fetch(`https://stechno.up.railway.app/api/product/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Remove product from local state
        setProducts(prev => prev.filter(p => p.id !== productId));
        showSuccess(`Product "${productName}" deleted successfully!`);
      } else {
        throw new Error("Failed to delete product");
      }
    } catch (error) {
      console.error("Delete error:", error);
      showError("Failed to delete product. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-6">
      <LoadingOverlay isVisible={isDeleting} message="Deleting product..." />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-blue-200">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Products Management
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center">
                <span className="text-gray-600 mr-2 font-medium">Show</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="border border-blue-300 rounded-xl px-3 py-2 bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-xl transition-all duration-200 ${
                  showFilters
                    ? "bg-blue-500 text-white border-blue-500 shadow-lg"
                    : "bg-white hover:bg-blue-50 border-blue-300 text-blue-600"
                }`}
              >
                <FaFilter /> Filter
              </button>

              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 border border-blue-300 rounded-xl bg-white hover:bg-blue-50 text-blue-600 transition-all duration-200"
              >
                <FaFileExport /> Export
              </button>

              <button
                onClick={navigateToAddProduct}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FaPlus /> Add Product
              </button>
            </div>
          </div>

          {/* Search and Filter Section */}
          {showFilters && (
            <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search by Name */}
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-2">Search by Name</label>
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 bg-white transition-all duration-200"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-600"
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                </div>

                {/* Search by ID */}
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-2">Search by ID/Code</label>
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                    <input
                      type="text"
                      placeholder="Search by ID or code..."
                      value={searchById}
                      onChange={(e) => setSearchById(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 bg-white transition-all duration-200"
                    />
                    {searchById && (
                      <button
                        onClick={() => setSearchById("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-600"
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                </div>

                {/* Clear All Filters */}
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSearchById("");
                      setSelectedCategory(null);
                    }}
                    className="w-full px-4 py-2 bg-blue-200 text-blue-800 rounded-xl hover:bg-blue-300 transition-all duration-200 font-medium"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Category Dropdown */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">Filter by Category</h3>
          <CategoryDropdown
            onCategorySelect={handleCategorySelect}
            selectedCategory={selectedCategory}
            onCategoryAdded={handleCategoryAdded}
          />
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-200">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">{error}</div>
          )}

          {loading ? (
            <TableSkeleton rows={5} columns={7} />
          ) : (
            <>
              {/* Results Summary */}
              <div className="mb-6">
                <p className="text-blue-700 font-medium">
                  Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length} products
                  {selectedCategory && ` in category "${selectedCategory.nama}"`}
                  {searchTerm && ` matching "${searchTerm}"`}
                  {searchById && ` with ID containing "${searchById}"`}
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-blue-200 rounded-xl">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 text-sm">
                      <th className="py-4 px-6 text-left border-b border-blue-200 font-semibold">Product Name</th>
                      <th className="py-4 px-6 text-left border-b border-blue-200 font-semibold">Product Code</th>
                      <th className="py-4 px-6 text-left border-b border-blue-200 font-semibold">Price</th>
                      <th className="py-4 px-6 text-left border-b border-blue-200 font-semibold">Stock</th>
                      <th className="py-4 px-6 text-left border-b border-blue-200 font-semibold">Category</th>
                      <th className="py-4 px-6 text-left border-b border-blue-200 font-semibold">Status</th>
                      <th className="py-4 px-6 text-left border-b border-blue-200 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((product) => (
                      <tr key={product.id} className="border-b border-blue-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition-all duration-200">
                        <td className="py-4 px-6 flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg">
                            {product.nama?.charAt(0) || "?"}
                          </div>
                          <div>
                            <span className="font-medium text-gray-800">{product.nama}</span>
                            <p className="text-sm text-blue-600">{product.deskripsi?.substring(0, 50)}...</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-mono font-medium">
                            {product.produk_kode}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-semibold text-green-600">Rp {formatPrice(product.harga)}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                            product.stock > 10
                              ? "bg-green-100 text-green-800"
                              : product.stock > 0
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {product.stock} pcs
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">
                            {product.category_nama || "Uncategorized"}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                            product.stock > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {product.stock > 0 ? "In Stock" : "Out of Stock"}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleSelectProduct(product.id)}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                              title="View Details"
                            >
                              <FaEye />
                            </button>
                            <button
                              onClick={() => navigate(`/edit-produk/${product.id}`)}
                              className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-all duration-200"
                              title="Edit Product"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id, product.nama)}
                              disabled={isDeleting}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete Product"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {currentItems.length === 0 && (
                      <tr>
                        <td colSpan="7" className="py-12 text-center">
                          <div className="text-blue-600">
                            <div className="text-4xl mb-4">📦</div>
                            <p className="text-lg font-medium mb-2">No products found</p>
                            <p className="text-sm">
                              {selectedCategory
                                ? `No products in category "${selectedCategory.nama}"`
                                : searchTerm || searchById
                                ? "Try adjusting your search criteria"
                                : "No products available"}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredProducts.length > 0 && (
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-blue-200">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-blue-300 rounded-xl text-blue-600 hover:bg-blue-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <div className="flex gap-2">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 ${
                            currentPage === pageNum
                              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                              : "border border-blue-300 hover:bg-blue-50 text-blue-600"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    {totalPages > 5 && (
                      <>
                        <span className="w-10 h-10 flex items-center justify-center text-blue-400">...</span>
                        <button
                          onClick={() => setCurrentPage(totalPages)}
                          className="w-10 h-10 flex items-center justify-center rounded-xl border border-blue-300 hover:bg-blue-50 text-blue-600 transition-all duration-200"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-blue-300 rounded-xl text-blue-600 hover:bg-blue-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Product;
