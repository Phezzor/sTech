import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AddCategoryModal from "../Component/AddCategoryModal";

const ProductIdPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
        const response = await fetch("https://stechno.up.railway.app/api/supplier", {
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
        alert("Produk berhasil diperbarui");
      } else {
        setError(data.message || "Gagal memperbarui produk");
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan");
      console.error("Error updating product:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/produk");
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
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 p-4 rounded-md">
        <p className="text-red-700">{error}</p>
        <button
          onClick={handleBack}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Kembali
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-yellow-100 p-4 rounded-md">
        <p className="text-yellow-700">Produk tidak ditemukan</p>
        <button
          onClick={handleBack}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isEditing ? "Edit Produk" : "Detail Produk"}
        </h1>
        <div className="space-x-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Edit
            </button>
          ) : null}
          <button
            onClick={handleBack}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Kembali
          </button>
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600">Nama Produk</label>
            <input
              type="text"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Deskripsi</label>
            <textarea
              name="deskripsi"
              value={form.deskripsi}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Harga</label>
            <input
              type="number"
              name="harga"
              value={form.harga}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Stok</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Kategori</label>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">-- Pilih Kategori --</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.nama}
                </option>
              ))}
            </select>
            
            {/* Tombol untuk menambah kategori baru */}
            <div className="mt-1">
              <button
                type="button"
                onClick={() => setIsAddCategoryModalOpen(true)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                + Tambah Kategori Baru
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600">Supplier</label>
            <select
              name="supplier_id"
              value={form.supplier_id}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">-- Pilih Supplier --</option>
              {suppliers.map(supplier => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.nama}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Kode Produk</h3>
            <p className="text-lg">{product.produk_kode}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Nama Produk</h3>
            <p className="text-lg">{product.nama}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Deskripsi</h3>
            <p className="text-lg">{product.deskripsi}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Harga</h3>
            <p className="text-lg">Rp {Number(product.harga).toLocaleString()}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Stok</h3>
            <p className="text-lg">{product.stock}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Kategori</h3>
            <p className="text-lg">
              {categories.find(c => c.id === product.category_id)?.nama || "Tidak ada kategori"}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Supplier</h3>
            <p className="text-lg">
              {suppliers.find(s => s.id === product.supplier_id)?.nama || "Tidak ada supplier"}
            </p>
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
  );
};

export default ProductIdPage;
