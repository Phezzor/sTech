import React, { useState, useEffect } from "react";

const AddProduct = ({ onSuccess }) => {
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

  useEffect(() => {
    // Fetch categories and suppliers for dropdowns
    fetchCategories();
    fetchSuppliers();
  }, []);

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
      const res = await fetch("https://stechno.up.railway.app/api/product", {
        method: "POST",
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
        setError(data.message || "Gagal menambahkan produk");
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white p-6 rounded shadow space-y-4"
    >
      <h2 className="text-2xl font-semibold mb-4">Tambah Produk Baru</h2>

      {error && <p className="text-red-600">{error}</p>}

      <input
        type="text"
        name="produk_id"
        placeholder="Kode Produk"
        value={form.id}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="text"
        name="nama"
        placeholder="Nama Produk"
        value={form.nama}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <textarea
        name="deskripsi"
        placeholder="Deskripsi Produk"
        value={form.deskripsi}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        rows={3}
        required
      />
      <input
        type="number"
        name="harga"
        placeholder="Harga (contoh: 5000)"
        value={form.harga}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="number"
        name="stock"
        placeholder="Stok"
        value={form.stock}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      
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
          {loading ? "Menyimpan..." : "Tambah Produk"}
        </button>
      </div>
    </form>
  );
};

export default AddProduct;
