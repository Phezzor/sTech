import React, { useState, useEffect } from "react";
import { FaBox, FaShoppingCart, FaTruck, FaUsers, FaArrowUp, FaArrowDown, FaChartLine } from "react-icons/fa";

function Dashboard({ userData }) {
  const [totalProduk, setTotalProduk] = useState(0);
  const [totalStok, setTotalStok] = useState(0);
  const [totalTransaksi, setTotalTransaksi] = useState(0);
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentProducts, setRecentProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  // Fetch data produk dan transaksi saat komponen dimuat
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        // Fetch produk
        const produkResponse = await fetch("https://stechno.up.railway.app/api/product", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (produkResponse.ok) {
          const produkData = await produkResponse.json();
          if (Array.isArray(produkData)) {
            setTotalProduk(produkData.length);
            // Hitung total stok
            const stok = produkData.reduce((total, produk) =>
              total + (parseInt(produk.stock) || 0), 0);
            setTotalStok(stok);

            // Set recent products (last 5)
            setRecentProducts(produkData.slice(-5).reverse());

            // Set low stock products (stock < 10)
            setLowStockProducts(produkData.filter(p => parseInt(p.stock) < 10));
          }
        }

        // Fetch suppliers
        const supplierResponse = await fetch("https://stechno.up.railway.app/api/supplier", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (supplierResponse.ok) {
          const supplierData = await supplierResponse.json();
          if (Array.isArray(supplierData)) {
            setTotalSuppliers(supplierData.length);
          }
        }

        // Fetch users
        const userResponse = await fetch("https://stechno.up.railway.app/api/users", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          if (Array.isArray(userData)) {
            setTotalUsers(userData.length);
          }
        }

        // Fetch transactions
        const transactionResponse = await fetch("https://stechno.up.railway.app/api/transaksi", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (transactionResponse.ok) {
          const transactionData = await transactionResponse.json();
          if (Array.isArray(transactionData)) {
            setTotalTransaksi(transactionData.length);
          }
        }

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Terjadi kesalahan saat mengambil data dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Data dummy untuk grafik
  const penjualanMingguan = [
    { hari: "Senin", jumlah: 12 },
    { hari: "Selasa", jumlah: 19 },
    { hari: "Rabu", jumlah: 8 },
    { hari: "Kamis", jumlah: 15 },
    { hari: "Jumat", jumlah: 22 },
    { hari: "Sabtu", jumlah: 30 },
    { hari: "Minggu", jumlah: 25 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-blue-600 font-medium">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-6 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Dashboard Overview
              </h1>
              <p className="text-blue-600 mt-2">Welcome back, {userData?.username || 'User'}!</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-500">Last updated</p>
              <p className="text-lg font-semibold text-blue-800">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Products</p>
                <h3 className="text-3xl font-bold text-blue-800">{totalProduk}</h3>
                <div className="flex items-center mt-2">
                  <FaArrowUp className="text-green-500 text-sm mr-1" />
                  <span className="text-green-500 text-sm font-medium">+12%</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl shadow-lg">
                <FaBox className="text-white text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Stock</p>
                <h3 className="text-3xl font-bold text-blue-800">{totalStok}</h3>
                <div className="flex items-center mt-2">
                  <FaArrowDown className="text-red-500 text-sm mr-1" />
                  <span className="text-red-500 text-sm font-medium">-3%</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-xl shadow-lg">
                <FaChartLine className="text-white text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Transactions</p>
                <h3 className="text-3xl font-bold text-blue-800">{totalTransaksi}</h3>
                <div className="flex items-center mt-2">
                  <FaArrowUp className="text-green-500 text-sm mr-1" />
                  <span className="text-green-500 text-sm font-medium">+8%</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-xl shadow-lg">
                <FaShoppingCart className="text-white text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Suppliers</p>
                <h3 className="text-3xl font-bold text-blue-800">{totalSuppliers}</h3>
                <div className="flex items-center mt-2">
                  <FaArrowUp className="text-green-500 text-sm mr-1" />
                  <span className="text-green-500 text-sm font-medium">+5%</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-xl shadow-lg">
                <FaTruck className="text-white text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Users</p>
                <h3 className="text-3xl font-bold text-blue-800">{totalUsers}</h3>
                <div className="flex items-center mt-2">
                  <FaArrowUp className="text-green-500 text-sm mr-1" />
                  <span className="text-green-500 text-sm font-medium">+2%</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-4 rounded-xl shadow-lg">
                <FaUsers className="text-white text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Sales Chart */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-200">
            <h3 className="text-xl font-semibold text-blue-800 mb-6">Weekly Sales</h3>
            <div className="h-64 flex items-end space-x-3">
              {penjualanMingguan.map((data, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="relative w-full">
                    <div
                      className="bg-gradient-to-t from-blue-500 to-blue-600 w-full rounded-t-xl shadow-lg transition-all duration-300 hover:shadow-xl"
                      style={{ height: `${(data.jumlah / 30) * 200}px` }}
                    ></div>
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-800 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity">
                      {data.jumlah}
                    </div>
                  </div>
                  <p className="text-sm mt-3 font-medium text-blue-600">{data.hari}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-200">
            <h3 className="text-xl font-semibold text-blue-800 mb-6">Low Stock Alert</h3>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {lowStockProducts.length > 0 ? (
                lowStockProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-200">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mr-3">
                        <span className="text-white text-sm font-bold">{product.nama?.charAt(0) || "?"}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{product.nama}</p>
                        <p className="text-sm text-blue-500">#{product.produk_kode}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-red-600">{product.stock} left</p>
                      <p className="text-xs text-gray-500">Reorder needed</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-blue-600">
                  <div className="text-4xl mb-2">✅</div>
                  <p>All products are well stocked!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Products */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-200">
          <h3 className="text-xl font-semibold text-blue-800 mb-6">Recent Products</h3>
          <div className="space-y-4">
            {recentProducts.length > 0 ? (
              recentProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-200 border border-blue-200">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                      <span className="text-white font-bold">{product.nama?.charAt(0) || "?"}</span>
                    </div>
                    <div>
                      <p className="font-medium text-blue-800">{product.nama}</p>
                      <p className="text-sm text-blue-600">{product.category_nama || "Uncategorized"}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">Rp {parseFloat(product.harga || 0).toLocaleString('id-ID')}</p>
                    <p className="text-sm text-blue-500">{product.stock} in stock</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-blue-600">
                <div className="text-4xl mb-2">📦</div>
                <p>No recent products found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
