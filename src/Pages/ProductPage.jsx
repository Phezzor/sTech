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
  }, [currentPage, selectedCategory, sortBy, sortOrder]);

  // Separate useEffect for search with debouncing
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      fetchProducts();
    }, 500); // 500ms delay for search

    setSearchTimeout(timeout);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [searchTerm]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Fetch all products first (API doesn't support search/filter parameters)
      const response = await fetch("https://stechno.up.railway.app/api/product", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        let allProducts = [];

        // Handle different API response formats
        if (data.data && Array.isArray(data.data)) {
          allProducts = data.data;
        } else if (Array.isArray(data)) {
          allProducts = data;
        } else {
          allProducts = [];
        }

        // Apply client-side filtering and searching
        let filteredProducts = allProducts;

        // Debug: Log all products and their category info
        console.log("All products:", allProducts);
        console.log("Selected category:", selectedCategory);
        console.log("Categories list:", categories);

        // Apply search filter
        if (searchTerm) {
          filteredProducts = filteredProducts.filter(product =>
            product.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.produk_kode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.deskripsi?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        // Apply category filter with multiple comparison methods
        if (selectedCategory) {
          console.log("Filtering by category:", selectedCategory);

          filteredProducts = filteredProducts.filter(product => {
            // Debug each product's category info
            console.log(`Product: ${product.nama}, category_id: ${product.category_id} (type: ${typeof product.category_id}), category_name: ${product.category_nama}`);

            // Try multiple comparison methods
            const categoryMatches =
              product.category_id == selectedCategory ||  // Loose comparison
              product.category_id === selectedCategory ||  // String comparison
              product.category_id === parseInt(selectedCategory) ||  // Integer comparison
              product.category_id === selectedCategory.toString() ||  // String conversion
              (product.category_nama && categories.find(cat => cat.id == selectedCategory && cat.nama === product.category_nama));

            console.log(`Category match result for ${product.nama}:`, categoryMatches);
            return categoryMatches;
          });

          console.log("Filtered products after category filter:", filteredProducts);
        }

        // Apply sorting
        filteredProducts.sort((a, b) => {
          let aValue = a[sortBy] || '';
          let bValue = b[sortBy] || '';

          // Handle different data types
          if (sortBy === 'harga' || sortBy === 'stock') {
            aValue = parseFloat(aValue) || 0;
            bValue = parseFloat(bValue) || 0;
          } else {
            aValue = aValue.toString().toLowerCase();
            bValue = bValue.toString().toLowerCase();
          }

          if (sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        });

        // Apply pagination
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

        setProducts(paginatedProducts);
        setTotalPages(Math.ceil(filteredProducts.length / itemsPerPage));
        setTotalProducts(filteredProducts.length);
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

      // Try multiple endpoints for categories
      const endpoints = [
        "https://stechno.up.railway.app/api/categories",
        "https://stechno.up.railway.app/api/category"
      ];

      let categoriesData = [];

      for (const endpoint of endpoints) {
        try {
          console.log(`Trying categories endpoint: ${endpoint}`);
          const response = await fetch(endpoint, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (response.ok) {
            const data = await response.json();
            categoriesData = Array.isArray(data) ? data : (data.data ? data.data : []);
            console.log(`Categories loaded from ${endpoint}:`, categoriesData);
            break;
          } else {
            console.log(`Categories endpoint ${endpoint} failed: ${response.status}`);
          }
        } catch (endpointError) {
          console.log(`Categories endpoint ${endpoint} error:`, endpointError.message);
          continue;
        }
      }

      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
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
  };



  const handleCategoryFilter = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setCurrentPage(1);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(price);
  };

  const getCategoryName = (categoryId) => {
    // Try multiple comparison methods for finding category
    const category = categories.find(cat =>
      cat.id == categoryId ||
      cat.id === categoryId ||
      cat.id === parseInt(categoryId) ||
      cat.id === categoryId?.toString()
    );
    return category ? category.nama : 'No Category';
  };



  if (loading && currentPage === 1) {
    return <FullPageLoading message="Loading products..." />;
  }

  return (
    <div className="min-h-full bg-transparent">
      <MessageContainer />
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 border border-blue-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Product Management
              </h1>
              <p className="text-blue-600 mt-2">
                Manage your product inventory ({totalProducts} products)
              </p>
            </div>

            {isAdmin && (
              <button
                onClick={() => navigate("/products/add")}
                className="flex items-center gap-2 px-4 md:px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm md:text-base"
              >
                <FaPlus /> Add Product
              </button>
            )}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 border border-blue-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <div className="relative">
              <label htmlFor="search-products" className="sr-only">Search products</label>
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
              <input
                id="search-products"
                name="search"
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearch}
                autoComplete="off"
                className="w-full pl-10 pr-4 py-2.5 md:py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
              />
            </div>

            <div className="relative">
              <label htmlFor="filter-category" className="sr-only">Filter by category</label>
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
              <select
                id="filter-category"
                name="category"
                value={selectedCategory}
                onChange={handleCategoryFilter}
                autoComplete="off"
                className="w-full pl-10 pr-4 py-2.5 md:py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-sm md:text-base"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.nama}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="sort-by" className="sr-only">Sort by</label>
              <select
                id="sort-by"
                name="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                autoComplete="off"
                className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
              >
                <option value="nama">Sort by Name</option>
                <option value="harga">Sort by Price</option>
                <option value="stock">Sort by Stock</option>
                <option value="created_at">Sort by Date</option>
              </select>
            </div>

            <button
              onClick={toggleSortOrder}
              className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-blue-300 rounded-xl hover:bg-blue-50 transition-all duration-200 text-sm md:text-base"
            >
              {sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-blue-200 overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <tr>
                  <th className="px-4 lg:px-6 py-4 text-left font-semibold">Product</th>
                  <th className="px-4 lg:px-6 py-4 text-left font-semibold">Code</th>
                  <th className="px-4 lg:px-6 py-4 text-left font-semibold">Category</th>
                  <th className="px-4 lg:px-6 py-4 text-left font-semibold">Supplier</th>
                  <th className="px-4 lg:px-6 py-4 text-left font-semibold">Price</th>
                  <th className="px-4 lg:px-6 py-4 text-left font-semibold">Stock</th>
                  <th className="px-4 lg:px-6 py-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-4 lg:px-6 py-12 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-blue-600">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 lg:px-6 py-12 text-center text-blue-600">
                      {searchTerm || selectedCategory ? (
                        <div>
                          <div className="text-4xl mb-4">🔍</div>
                          <p className="text-lg font-medium mb-2">Produk tidak ditemukan</p>
                          <p className="text-sm">
                            {searchTerm && `Tidak ada produk yang cocok dengan "${searchTerm}"`}
                            {searchTerm && selectedCategory && " dan "}
                            {selectedCategory && `kategori yang dipilih`}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <div className="text-4xl mb-4">📦</div>
                          <p className="text-lg font-medium mb-2">Belum ada produk</p>
                          <p className="text-sm">{isAdmin && "Klik 'Add Product' untuk memulai."}</p>
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  products.map((product, index) => (
                    <tr key={product.id} className={index % 2 === 0 ? "bg-blue-50" : "bg-white"}>
                      <td className="px-4 lg:px-6 py-4">
                        <div>
                          <div className="font-semibold text-blue-800">{product.nama}</div>
                          {product.deskripsi && (
                            <div className="text-sm text-blue-600 truncate max-w-xs">
                              {product.deskripsi}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-blue-700 font-mono text-sm">{product.produk_kode}</td>
                      <td className="px-4 lg:px-6 py-4 text-blue-600 text-sm">
                        {product.category_nama || getCategoryName(product.category_id)}
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-blue-600 text-sm">
                        {product.supplier_nama || 'No Supplier'}
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-blue-800 font-semibold text-sm">{formatPrice(product.harga)}</td>
                      <td className="px-4 lg:px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.stock > 10
                            ? 'bg-green-100 text-green-800'
                            : product.stock > 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
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

          {/* Mobile Card View */}
          <div className="md:hidden">
            {loading ? (
              <div className="p-6 text-center">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-blue-600">Loading...</span>
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="p-6 text-center text-blue-600">
                {searchTerm || selectedCategory ? (
                  <div>
                    <div className="text-4xl mb-4">🔍</div>
                    <p className="text-lg font-medium mb-2">Produk tidak ditemukan</p>
                    <p className="text-sm">
                      {searchTerm && `Tidak ada produk yang cocok dengan "${searchTerm}"`}
                      {searchTerm && selectedCategory && " dan "}
                      {selectedCategory && `kategori yang dipilih`}
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="text-4xl mb-4">📦</div>
                    <p className="text-lg font-medium mb-2">Belum ada produk</p>
                    <p className="text-sm">{isAdmin && "Klik 'Add Product' untuk memulai."}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {products.map((product, index) => (
                  <div key={product.id} className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-blue-800 truncate">{product.nama}</h3>
                        <p className="text-sm text-blue-600 font-mono">{product.produk_kode}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                        product.stock > 10
                          ? 'bg-green-100 text-green-800'
                          : product.stock > 0
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock} stock
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-600">Category:</span>
                        <span className="text-blue-800">{product.category_nama || getCategoryName(product.category_id)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-600">Supplier:</span>
                        <span className="text-blue-800">{product.supplier_nama || 'No Supplier'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-600">Price:</span>
                        <span className="text-blue-800 font-semibold">{formatPrice(product.harga)}</span>
                      </div>
                    </div>

                    {product.deskripsi && (
                      <p className="text-sm text-blue-600 mt-2 line-clamp-2">{product.deskripsi}</p>
                    )}

                    <div className="flex justify-end gap-2 mt-4">
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
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-blue-50 px-4 md:px-6 py-4 border-t border-blue-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-xs md:text-sm text-blue-600 text-center sm:text-left">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalProducts)} of {totalProducts} products
                </div>

                <div className="flex items-center justify-center gap-1 md:gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-2 md:px-3 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-xs md:text-sm"
                  >
                    <FaChevronLeft className="text-xs" /> <span className="hidden sm:inline">Previous</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(window.innerWidth < 640 ? 3 : 5, totalPages) }, (_, i) => {
                      let pageNum;
                      const maxPages = window.innerWidth < 640 ? 3 : 5;
                      if (totalPages <= maxPages) {
                        pageNum = i + 1;
                      } else if (currentPage <= Math.floor(maxPages/2) + 1) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - Math.floor(maxPages/2)) {
                        pageNum = totalPages - maxPages + 1 + i;
                      } else {
                        pageNum = currentPage - Math.floor(maxPages/2) + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-2 md:px-3 py-2 rounded-lg transition-all duration-200 text-xs md:text-sm ${
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
                    className="flex items-center gap-1 px-2 md:px-3 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-xs md:text-sm"
                  >
                    <span className="hidden sm:inline">Next</span> <FaChevronRight className="text-xs" />
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
