// src/Pages/ProductDetailPage.jsx
import { useEffect, useState } from "react";
import { FaArrowLeft, FaBox, FaEdit, FaHistory, FaTrash } from "react-icons/fa";
import { 
  updateProduct, 
  deleteProduct, 
  fetchAllCategories, 
  fetchAllSuppliers
} from "../utils/productApi";

function ProductDetailPage({ productId = "PRD00000001", onBack }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddStockModalOpen, setIsAddStockModalOpen] = useState(false);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [stockToAdd, setStockToAdd] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editProduct, setEditProduct] = useState({
    id: "",
    nama: "",
    deskripsi: "",
    harga: "",
    stock: "",
    category_id: "",
    supplier_id: ""
  });
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fungsi untuk memuat data produk
  const loadProductData = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("Token tidak ditemukan di localStorage.");
      setError("Token tidak ditemukan. Silakan login kembali.");
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`https://stechno.up.railway.app/api/product/PRD00000001`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Gagal mengambil data produk dengan ID: PRD00000001`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Data produk berhasil diambil:", data);
        setProduct(data);
        
        // Siapkan data untuk form edit
        setEditProduct({
          id: data.id,
          nama: data.nama || "",
          deskripsi: data.deskripsi || "",
          harga: data.harga ? data.harga.toString() : "",
          stock: data.stock ? data.stock.toString() : "",
          category_id: data.category_id || "",
          supplier_id: data.supplier_id || ""
        });
        
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err.message);
        setError("Gagal memuat data: " + err.message);
        setLoading(false);
      });
  };

  // Fungsi untuk mengambil daftar kategori
  const fetchCategories = async () => {
    try {
      console.log("Memulai fetch kategori...");
      
      // Ambil semua kategori menggunakan fetchAllCategories
      const categories = await fetchAllCategories();
      console.log("Kategori setelah diproses:", categories);
      setCategories(categories);
    } catch (err) {
      console.error("Error fetching categories:", err);
      // Fallback ke kategori hardcoded jika terjadi error
      const fallbackCategories = [
        { id: "TH01", nama: "Minuman" },
        { id: "TH02", nama: "Makanan" },
        { id: "TH03", nama: "Snack" }
      ];
      setCategories(fallbackCategories);
    }
  };

  // Fungsi untuk mengambil daftar supplier
  const fetchSuppliers = async () => {
    try {
      console.log("Memulai fetch supplier...");
      
      // Ambil semua supplier menggunakan fetchAllSuppliers
      const suppliers = await fetchAllSuppliers();
      console.log("Supplier setelah diproses:", suppliers);
      setSuppliers(suppliers);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
      setSuppliers([]);
    }
  };

  useEffect(() => {
    loadProductData();
    fetchCategories();
    fetchSuppliers();
  }, []);

  // Fungsi untuk menambah stok
  const handleAddStock = async (e) => {
    e.preventDefault();
    
    if (!product || stockToAdd <= 0) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Hitung stok baru
      const newStock = parseInt(product.stock) + parseInt(stockToAdd);
      
      // Persiapkan data untuk update
      const updatedProductData = {
        ...product,
        stock: newStock
      };
      
      // Panggil API untuk update produk
      const result = await updateProduct(product.id, updatedProductData);
      
      // Update state produk dengan data yang baru
      setProduct(result);
      
      // Tutup modal
      setIsAddStockModalOpen(false);
      setStockToAdd(1);
      
      // Tampilkan pesan sukses
      alert(`Berhasil menambah ${stockToAdd} stok untuk ${product.nama}`);
    } catch (error) {
      console.error("Error updating stock:", error);
      setError(`Gagal menambah stok: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fungsi untuk menangani perubahan input form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditProduct({
      ...editProduct,
      [name]: value
    });
  };

  // Fungsi untuk menyimpan perubahan produk
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    
    // Validasi input
    if (!editProduct.nama || !editProduct.harga || !editProduct.stock) {
      setError("Semua field bertanda * harus diisi");
      return;
    }

    setIsSubmitting(true);

    try {
      // Persiapkan data untuk update
      const updatedProductData = {
        nama: editProduct.nama,
        deskripsi: editProduct.deskripsi || "",
        harga: parseInt(editProduct.harga),
        stock: parseInt(editProduct.stock),
        category_id: editProduct.category_id,
        supplier_id: editProduct.supplier_id
      };
      
      // Panggil API untuk update produk
      const result = await updateProduct(product.id, updatedProductData);
      
      // Update state produk dengan data yang baru
      setProduct(result);
      
      // Tutup modal
      setIsEditProductModalOpen(false);
      
      // Tampilkan pesan sukses
      alert(`Produk ${result.nama} berhasil diperbarui`);
    } catch (error) {
      console.error("Error updating product:", error);
      setError(`Gagal memperbarui produk: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fungsi untuk menghapus produk
  const handleDeleteProduct = async () => {
    setDeleteLoading(true);
    
    try {
      await deleteProduct(product.id);
      alert(`Produk ${product.nama} berhasil dihapus`);
      // Kembali ke halaman produk setelah berhasil menghapus
      onBack();
    } catch (error) {
      console.error("Error deleting product:", error);
      setError(`Gagal menghapus produk: ${error.message}`);
      setIsDeleteConfirmOpen(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;
  if (error) return <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-4 rounded">{error}</div>;
  if (!product) return <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 m-4 rounded">Produk tidak ditemukan</div>;

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header with back button */}
      <div className="flex items-center mb-4">
        <button 
          onClick={onBack} 
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <FaArrowLeft className="mr-2" /> Kembali ke daftar produk
        </button>
      </div>

      {/* Product detail card */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        {/* Product header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-5">
          <h2 className="text-2xl font-bold">{product.nama}</h2>
          <p className="text-blue-100 text-sm mt-1">ID: {product.id}</p>
        </div>

        {/* Product details */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column */}
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                  <FaBox className="mr-2 text-blue-600" /> Informasi Produk
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-2 hover:bg-gray-100 rounded transition-colors">
                      <p className="text-gray-500 text-sm">Kategori</p>
                      <p className="font-medium">{product.category_nama}</p>
                    </div>
                    <div className="p-2 hover:bg-gray-100 rounded transition-colors">
                      <p className="text-gray-500 text-sm">Stok</p>
                      <p className={`font-medium ${
                        product.stock <= 5 ? "text-red-500 font-bold" : 
                        product.stock <= 20 ? "text-yellow-600 font-bold" : "text-green-600"
                      }`}>
                        {product.stock} unit
                      </p>
                    </div>
                    <div className="p-2 hover:bg-gray-100 rounded transition-colors">
                      <p className="text-gray-500 text-sm">Harga</p>
                      <p className="font-medium">Rp {parseInt(product.harga).toLocaleString()}</p>
                    </div>
                    <div className="p-2 hover:bg-gray-100 rounded transition-colors">
                      <p className="text-gray-500 text-sm">Supplier</p>
                      <p className="font-medium">{product.supplier_nama}</p>
                    </div>
                  </div>
                </div>
              </div>

              {product.deskripsi && (
                <div>
                  <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                    <FaEdit className="mr-2 text-blue-600" /> Deskripsi
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <p className="text-gray-700">{product.deskripsi}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right column */}
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                  <FaBox className="mr-2 text-blue-600" /> Manajemen Stok
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="mb-4">
                    <p className="text-gray-500 text-sm mb-2">Stok Saat Ini</p>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-5">
                        <div 
                          className={`h-5 rounded-full ${
                            product.stock <= 5 ? "bg-red-500" : 
                            product.stock <= 20 ? "bg-yellow-500" : "bg-green-500"
                          }`}
                          style={{ width: `${Math.min(100, (product.stock / 100) * 100)}%` }}
                        ></div>
                      </div>
                      <span className="ml-3 font-bold">{product.stock}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-3">
                    <button 
                      className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors flex items-center justify-center"
                      onClick={() => setIsAddStockModalOpen(true)}
                    >
                      <FaBox className="mr-2" /> Tambah Stok
                    </button>
                    <button 
                      className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition-colors flex items-center justify-center"
                      onClick={() => setIsEditProductModalOpen(true)}
                    >
                      <FaEdit className="mr-2" /> Edit Produk
                    </button>
                    <button 
                      className="bg-red-100 text-red-700 py-2 px-4 rounded hover:bg-red-200 transition-colors flex items-center justify-center"
                      onClick={() => setIsDeleteConfirmOpen(true)}
                    >
                      <FaTrash className="mr-2" /> Hapus Produk
                    </button>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                  <FaHistory className="mr-2 text-blue-600" /> Riwayat Stok
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <p className="text-gray-500 text-sm italic">Belum ada riwayat stok</p>
                  <button className="mt-3 text-blue-600 text-sm hover:text-blue-800 transition-colors">
                    Lihat semua riwayat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Tambah Stok */}
      {isAddStockModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Backdrop dengan blur dan gradient */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-600/30 backdrop-blur-sm"
            onClick={() => setIsAddStockModalOpen(false)}
          ></div>
          
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative z-10 shadow-xl border border-blue-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-blue-800">Tambah Stok Produk</h3>
              <button
                onClick={() => setIsAddStockModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleAddStock}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Produk
                </label>
                <input
                  type="text"
                  value={product.nama}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  disabled
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stok Saat Ini
                </label>
                <input
                  type="text"
                  value={product.stock}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  disabled
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jumlah Stok yang Ditambahkan
                </label>
                <input
                  type="number"
                  value={stockToAdd}
                  onChange={(e) => setStockToAdd(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  min="1"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stok Setelah Penambahan
                </label>
                <input
                  type="text"
                  value={parseInt(product.stock) + parseInt(stockToAdd || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  disabled
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddStockModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md hover:from-blue-700 hover:to-blue-800 transition-colors shadow-md"
                  disabled={isSubmitting || stockToAdd <= 0}
                >
                  {isSubmitting ? "Menyimpan..." : "Tambah Stok"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Produk */}
      {isEditProductModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Backdrop dengan blur dan gradient */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-600/30 backdrop-blur-sm"
            onClick={() => setIsEditProductModalOpen(false)}
          ></div>
          
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto relative z-10 shadow-xl border border-blue-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-blue-800">Edit Produk</h3>
              <button
                onClick={() => setIsEditProductModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleUpdateProduct}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Produk <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nama"
                  value={editProduct.nama}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  name="deskripsi"
                  value={editProduct.deskripsi}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  rows="3"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Harga <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="harga"
                    value={editProduct.harga}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stok <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={editProduct.stock}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <select
                  name="category_id"
                  value={editProduct.category_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                >
                  <option value="">Pilih Kategori</option>
                  {categories && categories.length > 0 ? (
                    categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.nama}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="TH01">Minuman</option>
                      <option value="TH02">Makanan</option>
                      <option value="TH03">Snack</option>
                    </>
                  )}
                </select>
                {/* Debug info */}
                {categories.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    Tidak ada kategori yang tersedia. Menggunakan kategori default.
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supplier <span className="text-red-500">*</span>
                </label>
                <select
                  name="supplier_id"
                  value={editProduct.supplier_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                >
                  <option value="">Pilih Supplier</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditProductModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md hover:from-blue-700 hover:to-blue-800 transition-colors shadow-md"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal konfirmasi hapus produk */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Backdrop dengan blur dan gradient */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-red-500/30 to-orange-600/30 backdrop-blur-sm"
            onClick={() => !deleteLoading && setIsDeleteConfirmOpen(false)}
          ></div>
          
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative z-10 shadow-xl border border-red-100">
            <div className="text-center mb-4">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <FaTrash className="text-red-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Konfirmasi Hapus Produk</h3>
              <p className="text-gray-600 mt-2">
                Apakah Anda yakin ingin menghapus produk <span className="font-semibold">{product.nama}</span>? 
                Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="flex justify-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={deleteLoading}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteProduct}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors shadow-md"
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Menghapus...
                  </span>
                ) : (
                  "Ya, Hapus Produk"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetailPage;
