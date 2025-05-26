import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Product from '../Component/Product';
import { FaArrowLeft } from 'react-icons/fa';

const ProductCategoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategoryProducts();
    fetchCategoryDetails();
  }, [id]);

  const fetchCategoryProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://stechno.up.railway.app/api/product/category/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        setError("Gagal mengambil data produk kategori");
      }
      setLoading(false);
    } catch (error) {
      console.error('Gagal mengambil data:', error);
      setError("Terjadi kesalahan saat mengambil data");
      setLoading(false);
    }
  };

  const fetchCategoryDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://stechno.up.railway.app/api/category/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setCategory(data);
      }
    } catch (error) {
      console.error('Gagal mengambil detail kategori:', error);
    }
  };

  const handleSelectProduct = (productId) => {
    navigate(`/produk/${productId}`);
  };

  const handleTambahStok = (productId) => {
    console.log(`Tambah stok untuk produk ID: ${productId}`);
    // Implementasi penambahan stok bisa ditambahkan di sini
  };

  const handleBack = () => {
    navigate('/');
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
    </div>
  );

  if (error) return (
    <div className="p-4 bg-red-100 text-red-700 rounded-lg">
      <p>{error}</p>
      <button 
        onClick={handleBack}
        className="mt-2 px-4 py-2 bg-white text-red-700 rounded border border-red-300 hover:bg-red-50"
      >
        Kembali
      </button>
    </div>
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={handleBack}
          className="p-2 bg-sky-100 text-sky-600 rounded-full hover:bg-sky-200"
        >
          <FaArrowLeft />
        </button>
        <h1 className="text-2xl font-bold">
          {category ? category.nama : `Kategori: ${id}`}
        </h1>
        <span className="bg-sky-100 text-sky-800 px-3 py-1 rounded-full text-sm">
          {products.length} produk
        </span>
      </div>

      {products.length === 0 ? (
        <div className="p-8 text-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">Tidak ada produk dalam kategori ini</p>
          <button
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600"
          >
            Kembali ke Daftar Produk
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <Product
              key={product.id_product}
              id={product.id_product}
              nama={product.product_name}
              stok={product.stock}
              kategori={product.category_id}
              harga={product.price}
              deskripsi={product.description}
              supplier={product.supplier_id}
              onSelectProduct={handleSelectProduct}
              onTambahStok={handleTambahStok}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCategoryPage;
