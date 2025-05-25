
// src/Pages/ProductPage.jsx
import { useState, useEffect } from "react";
import { FaPlus, FaSearch, FaFilter, FaBox, FaExclamationTriangle } from "react-icons/fa";
import { 
  fetchMinumanProducts, 
  fetchCategoryTH01, 
  fetchAllCategories, 
  fetchProductsByCategory,
  fetchAllSuppliers,
  fetchProductsBySupplier,
  fetchCategoryById,
  fetchSupplierById
} from "../utils/productApi";
import Product from "../Component/Product";
import APIStatus from "../Component/APIStatus";

function ProductPage({ onSelectProduct }) {
  // State untuk produk
  const [produkList, setProdukList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State untuk kategori
  const [kategoriList, setKategoriList] = useState(["Semua", "Minuman", "Makanan", "Snack"]);
  const [kategori, setKategori] = useState("Semua");
  const [kategoriMap, setKategoriMap] = useState({
    "Minuman": "TH01",
    "Makanan": "TH02",
    "Snack": "TH03"
  });
  const [selectedKategoriId, setSelectedKategoriId] = useState(null);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState(null);
  
  // State untuk supplier
  const [supplierList, setSupplierList] = useState(["Semua Supplier"]);
  const [supplier, setSupplier] = useState("Semua Supplier");
  const [supplierMap, setSupplierMap] = useState({});
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);
  const [supplierLoading, setSupplierLoading] = useState(false);
  const [supplierError, setSupplierError] = useState(null);
  
  // State untuk filter dan tab aktif
  const [filterMode, setFilterMode] = useState("semua");
  const [activeTab, setActiveTab] = useState("kategori");
  const [searchQuery, setSearchQuery] = useState("");
  
  // State untuk produk berdasarkan kategori dan supplier
  const [productsByCategory, setProductsByCategory] = useState({});
  const [productsBySupplier, setProductsBySupplier] = useState({});
  
  // State untuk modal tambah produk
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    nama: "",
    deskripsi: "",
    harga: "",
    stock: "",
    category_id: "",
    supplier_id: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Fungsi untuk memuat data kategori
  const loadCategories = async () => {
    setLoading(true);
    setCategoryLoading(true);
    setCategoryError(null);
    setError(null);

    try {
      console.log("Memuat data kategori...");
      
      // Gunakan fetchAllCategories
      const categories = await fetchAllCategories();
      
      // Ekstrak nama kategori
      let categoryNames = categories.map(cat => cat.nama);
      
      // Buat mapping kategori
      const categoryMap = {};
      categories.forEach(cat => {
        categoryMap[cat.nama] = cat.id;
      });
      
      // Tambahkan "Semua" di awal daftar
      categoryNames = ["Semua", ...categoryNames];
      
      // Update state
      setKategoriList(categoryNames);
      setKategoriMap(categoryMap);
      
      console.log("Berhasil memuat kategori:", categoryNames);
      console.log("Mapping kategori:", categoryMap);
      
      // Reset error jika berhasil
      setError(null);
      setCategoryError(null);
    } catch (err) {
      console.error("Error loading categories:", err);
      const errorMessage = `Gagal memuat kategori: ${err.message}`;
      setCategoryError(errorMessage);
      setError(errorMessage);
      
      // Fallback ke kategori hardcoded
      const fallbackCategories = ["Semua", "Minuman", "Makanan", "Snack"];
      setKategoriList(fallbackCategories);
      
      const fallbackMap = {
        "Minuman": "TH01",
        "Makanan": "TH02",
        "Snack": "TH03"
      };
      setKategoriMap(fallbackMap);
    } finally {
      setLoading(false);
      setCategoryLoading(false);
    }
  };

  // Fungsi untuk memuat data supplier
  const loadSuppliers = async () => {
    setLoading(true);
    setSupplierLoading(true);
    setSupplierError(null);
    setError(null);

    try {
      console.log("Memuat data supplier...");
      
      // Gunakan fungsi fetchAllSuppliers
      const suppliers = await fetchAllSuppliers();
      
      // Ekstrak nama supplier
      let supplierNames = suppliers.map(sup => sup.nama);
      
      // Buat mapping supplier
      const supplierMap = {};
      suppliers.forEach(sup => {
        supplierMap[sup.nama] = sup.id;
      });
      
      // Tambahkan "Semua Supplier" di awal daftar
      supplierNames = ["Semua Supplier", ...supplierNames];
      
      // Update state
      setSupplierList(supplierNames);
      setSupplierMap(supplierMap);
      
      console.log("Berhasil memuat supplier:", supplierNames);
      console.log("Mapping supplier:", supplierMap);
      
      // Reset error jika berhasil
      setError(null);
      setSupplierError(null);
    } catch (err) {
      console.error("Error loading suppliers:", err);
      const errorMessage = `Gagal memuat supplier: ${err.message}`;
      setSupplierError(errorMessage);
      setError(errorMessage);
      
      // Fallback ke supplier hardcoded jika diperlukan
      setSupplierList(["Semua Supplier"]);
      setSupplierMap({});
    } finally {
      setLoading(false);
      setSupplierLoading(false);
    }
  };

  // Fungsi untuk memuat produk berdasarkan kategori TH01 (Minuman)
  const loadCategoryTH01 = async () => {
    setLoading(true);
    setCategoryLoading(true);
    setCategoryError(null);
    setError(null);

    try {
      console.log("Memuat produk untuk kategori TH01 (Minuman)...");
      
      // Gunakan fungsi fetchMinumanProducts
      const products = await fetchMinumanProducts();
      
      // Update state
      setProdukList(products);
      setProductsByCategory({
        ...productsByCategory,
        "TH01": products
      });
      
      console.log(`Berhasil memuat ${products.length} produk untuk kategori TH01 (Minuman)`);
      
      // Reset error jika berhasil
      setError(null);
      setCategoryError(null);
    } catch (err) {
      console.error("Error loading products for category TH01:", err);
      const errorMessage = `Gagal memuat produk untuk kategori Minuman: ${err.message}`;
      setCategoryError(errorMessage);
      setError(errorMessage);
      setProdukList([]);
    } finally {
      setLoading(false);
      setCategoryLoading(false);
    }
  };

  // Inisialisasi: Ambil semua kategori dan supplier saat komponen dimuat
  useEffect(() => {
    console.log("Komponen ProductPage dimuat, mengambil semua kategori dan supplier");
    loadCategories();
    loadSuppliers();
    fetchProducts(); // Muat semua produk secara default
  }, []);

  // Fungsi untuk mengambil semua produk
  const fetchProducts = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token tidak ditemukan. Silakan login kembali.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Memuat semua produk...");
      
      const response = await fetch("https://stechno.up.railway.app/api/product", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`Berhasil memuat ${data.length} produk`);
      
      setProdukList(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(`Gagal memuat produk: ${err.message}`);
      setProdukList([]);
      setLoading(false);
    }
  };

  // Render komponen
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Daftar Produk</h2>
      
      {/* Tombol Refresh dan Tambah */}
      <div className="flex justify-end space-x-2">
        <button
          onClick={fetchProducts}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center"
        >
          <span className="mr-1">Refresh</span>
        </button>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
        >
          <FaPlus className="mr-1" /> Tambah Produk
        </button>
      </div>
      
      {/* Tab Filter */}
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            className={`py-2 px-4 ${activeTab === "kategori" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setActiveTab("kategori")}
          >
            Filter Kategori
          </button>
          <button
            className={`py-2 px-4 ${activeTab === "supplier" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setActiveTab("supplier")}
          >
            Filter Supplier
          </button>
        </div>
      </div>
      
      {/* Filter Kategori */}
      {activeTab === "kategori" && (
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Kategori</h3>
          <div className="flex flex-wrap gap-2">
            {kategoriList.map((kat) => (
              <button
                key={kat}
                className={`px-3 py-1 rounded-full ${
                  kategori === kat
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => {
                  if (kat === "Semua") {
                    setKategori("Semua");
                    setSelectedKategoriId(null);
                    fetchProducts();
                  } else {
                    setKategori(kat);
                    const categoryId = kategoriMap[kat];
                    if (categoryId) {
                      setSelectedKategoriId(categoryId);
                      fetchProductsByCategory(categoryId);
                    }
                  }
                }}
              >
                {kat}
              </button>
            ))}
          </div>
          {categoryError && (
            <div className="mt-2 text-red-500 text-sm">
              <FaExclamationTriangle className="inline mr-1" />
              {categoryError}
            </div>
          )}
        </div>
      )}
      
      {/* Filter Supplier */}
      {activeTab === "supplier" && (
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Supplier</h3>
          <div className="flex flex-wrap gap-2">
            {supplierList.map((sup) => (
              <button
                key={sup}
                className={`px-3 py-1 rounded-full ${
                  supplier === sup
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => {
                  if (sup === "Semua Supplier") {
                    setSupplier("Semua Supplier");
                    setSelectedSupplierId(null);
                    fetchProducts();
                  } else {
                    setSupplier(sup);
                    const supplierId = supplierMap[sup];
                    if (supplierId) {
                      setSelectedSupplierId(supplierId);
                      fetchProductsBySupplier(supplierId);
                    }
                  }
                }}
              >
                {sup}
              </button>
            ))}
          </div>
          {supplierError && (
            <div className="mt-2 text-red-500 text-sm">
              <FaExclamationTriangle className="inline mr-1" />
              {supplierError}
            </div>
          )}
        </div>
      )}
      
      {/* Product List dengan penanganan error yang lebih baik */}
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>

          {/* Tombol untuk mencoba lagi */}
          {activeTab === "kategori" && kategori !== "Semua" && (
            <div className="mt-3">
              <button
                onClick={() => handleKategoriChange(kategori)}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
              >
                Coba Lagi
              </button>
              <button
                onClick={() => handleKategoriChange("Semua")}
                className="ml-2 bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300 transition-colors"
              >
                Kembali ke Semua
              </button>
            </div>
          )}
        </div>
      ) : produkList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {produkList.map((produk) => {
            const {
              id,
              nama,
              stock,
              category_nama,
              harga,
              deskripsi,
              supplier_nama,
            } = produk;

            return (
              <div
                key={id}
                className="cursor-pointer"
                onClick={() => onSelectProduct && onSelectProduct(id)}
              >
                <Product
                  nama={nama}
                  stok={stock}
                  kategori={category_nama}
                  harga={harga}
                  deskripsi={deskripsi}
                  supplier={supplier_nama}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <p className="text-yellow-700">
            {activeTab === "kategori"
              ? `Tidak ada produk yang ditemukan untuk kategori ${kategori}.`
              : `Tidak ada produk yang ditemukan dari supplier ${supplier}.`}
          </p>
        </div>
      )}

      {/* Modal Tambah Produk dengan latar belakang yang lebih menarik */}
      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Backdrop dengan blur dan gradient */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-600/30 backdrop-blur-sm"
            onClick={() => setIsAddModalOpen(false)}
          ></div>

          {/* Modal content */}
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto relative z-10 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-blue-700">Tambah Produk Baru</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Garis pembatas dengan gradient */}
            <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded mb-4"></div>

            <form onSubmit={handleAddProduct}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Produk <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nama"
                  value={newProduct.nama}
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
                  value={newProduct.deskripsi}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Harga (Rp) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="harga"
                    value={newProduct.harga}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stok Awal <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={newProduct.stock}
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
                  value={newProduct.category_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                >
                  <option value="">Pilih Kategori</option>
                  {Object.entries(kategoriMap).map(([nama, id]) => (
                    <option key={id} value={id}>
                      {nama}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supplier <span className="text-red-500">*</span>
                </label>
                <select
                  name="supplier_id"
                  value={newProduct.supplier_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                >
                  <option value="">Pilih Supplier</option>
                  {Object.entries(supplierMap).map(([nama, id]) => (
                    <option key={id} value={id}>
                      {nama}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <div className="mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors border border-gray-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md hover:from-blue-700 hover:to-blue-800 transition-colors shadow-md"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Menyimpan...
                    </span>
                  ) : (
                  "Simpan Produk"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductPage;
