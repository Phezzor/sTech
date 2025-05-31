import React, { useState, useEffect } from "react";

const EditProduct = ({ productId, onSuccess }) => {
  const [form, setForm] = useState({
    produk_kode: "",
    nama: "",
    deskripsi: "",
    harga: "",
    stock: "",
    category_id: "",
    supplier_id: "",
  });

  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    // Fetch product data, categories and suppliers
    fetchProductData();
    fetchCategories();
    fetchSuppliers();
  }, [productId]);

  const fetchProductData = async () => {
    try {
      setFetchLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`https://stechno.up.railway.app/api/product/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setForm({
          produk_kode: data.produk_kode || "",
          nama: data.nama || "",
          deskripsi: data.deskripsi || "",
          harga: data.harga || "",
          stock: data.stock || "",
          category_id: data.category_id || "",
          supplier_id: data.supplier_id || "",
        });
      } else {
        setError("Gagal mengambil data produk");
      }
    } catch (err) {
      console.error("Error fetching product data:", err);
      setError("Terjadi kesalahan saat mengambil data produk");
    } finally {
      setFetchLoading(false);
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
        setCategories(data);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
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
        setSuppliers(data);
      }
    } catch (err) {
      console.error("Error fetching suppliers:", err);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://stechno.up.railway.app/api/product/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        onSuccess && onSuccess(data.product);
      } else {
        setError(data.message || "Gagal memperbarui produk");
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return <div className="text-center p-6">Memuat data produk...</div>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white p-6 rounded shadow space-y-4"
    >
      {error && <p className="text-red-600">{error}</p>}

      <div className="space-y-2">
        <label className="block text-sm text-gray-600">Kode Produk</label>
        <input
          type="text"
          name="produk_kode"
          value={form.produk_kode}
          onChange={handleChange}
          className="w-full p-2 border rounded bg-gray-100"
          disabled
        />
      </div>

      <div className="space-y-2">
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

      <div className="space-y-2">
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

      <div className="space-y-2">
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

      <div className="space-y-2">
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
      
      <div className="space-y-2">
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
      </div>
      
      <div className="space-y-2">
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

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
        >
          Batal
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
};

export default EditProduct;