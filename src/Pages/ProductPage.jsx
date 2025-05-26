import React, { useState, useEffect } from "react";
import Product from "../Component/Product";

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

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
      setError("Terjadi kesalahan saat mengambil data produk.");
    } finally {
      setLoading(false);
    }
  };

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
        console.error("Gagal mengambil data kategori");
      }
    } catch (err) {
      console.error("Terjadi kesalahan saat mengambil data kategori:", err);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleCategoryAdded = (newCategory) => {
    // Refresh kategori setelah menambahkan kategori baru
    fetchCategories();
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <Product 
        products={products} 
        categories={categories}
        loading={loading} 
        loadingCategories={loadingCategories}
        error={error}
        onCategoryAdded={handleCategoryAdded}
      />
    </div>
  );
}

export default ProductPage;
