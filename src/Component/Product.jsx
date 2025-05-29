import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEllipsisH, FaFilter, FaFileExport, FaPlus } from "react-icons/fa";
import CategoryDropdown from "./CategoryDropdown";

function Product({ products: initialProducts, loading: initialLoading, error: initialError }) {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [products, setProducts] = useState(initialProducts || []);
  const [loading, setLoading] = useState(initialLoading || true);
  const [error, setError] = useState(initialError || null);

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

  // Filter products when category changes
  useEffect(() => {
    if (selectedCategory) {
      setFilteredProducts(products.filter(product => 
        product.category_id === selectedCategory.id
      ));
    } else {
      setFilteredProducts(products);
    }
  }, [selectedCategory, products]);

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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Product</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <span className="text-gray-500 mr-2">Showing</span>
            <select className="border rounded-md px-2 py-1 bg-gray-50">
              <option>10</option>
              <option>20</option>
              <option>50</option>
            </select>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 border rounded-md bg-gray-50 hover:bg-gray-100">
            <FaFilter /> Filter
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 border rounded-md bg-gray-50 hover:bg-gray-100">
            <FaFileExport /> Export
          </button>
          
          <button 
            onClick={navigateToAddProduct}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer"
          >
            <FaPlus /> Add New Product
          </button>
        </div>
      </div>
      
      {/* Kategori dropdown sebagai komponen terpisah */}
      <div className="mb-6">
        <CategoryDropdown 
          onCategorySelect={handleCategorySelect}
          selectedCategory={selectedCategory}
          onCategoryAdded={handleCategoryAdded}
        />
      </div>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}
      
      {loading ? (
        <div className="text-center py-4">Loading products...</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm">
                  <th className="py-3 px-4 text-left border-b">Product Name</th>
                  <th className="py-3 px-4 text-left border-b">Product ID</th>
                  <th className="py-3 px-4 text-left border-b">Price</th>
                  <th className="py-3 px-4 text-left border-b">Stock</th>
                  <th className="py-3 px-4 text-left border-b">Type</th>
                  <th className="py-3 px-4 text-left border-b">Status</th>
                  <th className="py-3 px-4 text-left border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center text-xs">
                        {product.nama?.charAt(0) || "?"}
                      </div>
                      <span>{product.nama}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-500">#{product.produk_kode}</td>
                    <td className="py-3 px-4">Rp {formatPrice(product.harga)}</td>
                    <td className="py-3 px-4">{product.stock} pcs</td>
                    <td className="py-3 px-4">{product.category_nama}</td>
                    <td className="py-3 px-4">
                      <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">Pending</span>
                    </td>
                    <td className="py-3 px-4">
                      <button 
                        onClick={() => handleSelectProduct(product.id)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <FaEllipsisH />
                      </button>
                    </td>
                  </tr>
                ))}
                
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-gray-500">
                      {selectedCategory 
                        ? `Tidak ada produk dalam kategori "${selectedCategory.nama}"` 
                        : "Tidak ada produk yang tersedia"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <button className="px-3 py-1 border rounded text-gray-500 hover:bg-gray-50">Previous</button>
            <div className="flex gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded border">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded border">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-blue-500 text-white">3</button>
              <button className="w-8 h-8 flex items-center justify-center rounded border">4</button>
              <span className="w-8 h-8 flex items-center justify-center">...</span>
              <button className="w-8 h-8 flex items-center justify-center rounded border">10</button>
              <button className="w-8 h-8 flex items-center justify-center rounded border">11</button>
            </div>
            <button className="px-3 py-1 border rounded text-gray-500 hover:bg-gray-50">Next</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Product;
