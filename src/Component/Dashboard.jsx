import React, { useState, useEffect } from "react";
import { FaBox, FaShoppingCart } from "react-icons/fa";

function Dashboard({ userData }) {
  const [totalProduk, setTotalProduk] = useState(0);
  const [totalStok, setTotalStok] = useState(0);
  const [totalTransaksi, setTotalTransaksi] = useState(45);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          }
        }
        
        // Untuk sementara gunakan nilai dummy untuk transaksi
        setTotalTransaksi(45);
        
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
    return <div className="p-6 text-center">Memuat data dashboard...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Dashboard</h2>
      
      {/* Kartu statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Produk</p>
              <h3 className="text-2xl font-bold">{totalProduk}</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FaBox className="text-blue-500 text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Stok</p>
              <h3 className="text-2xl font-bold">{totalStok}</h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FaBox className="text-green-500 text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Transaksi</p>
              <h3 className="text-2xl font-bold">{totalTransaksi}</h3>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FaShoppingCart className="text-purple-500 text-xl" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Grafik penjualan mingguan */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Penjualan Mingguan</h3>
        <div className="h-64 flex items-end space-x-2">
          {penjualanMingguan.map((data, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div 
                className="bg-blue-500 w-full rounded-t-md" 
                style={{ height: `${(data.jumlah / 30) * 100}%` }}
              ></div>
              <p className="text-xs mt-2">{data.hari}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Produk terlaris */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Produk Terlaris</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center mr-3">
                <span className="text-xs">P1</span>
              </div>
              <div>
                <p className="font-medium">Produk A</p>
                <p className="text-sm text-gray-500">Kategori X</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">120 terjual</p>
              <p className="text-sm text-gray-500">Rp 1.200.000</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between pb-2 border-b">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center mr-3">
                <span className="text-xs">P2</span>
              </div>
              <div>
                <p className="font-medium">Produk B</p>
                <p className="text-sm text-gray-500">Kategori Y</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">98 terjual</p>
              <p className="text-sm text-gray-500">Rp 980.000</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between pb-2 border-b">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center mr-3">
                <span className="text-xs">P3</span>
              </div>
              <div>
                <p className="font-medium">Produk C</p>
                <p className="text-sm text-gray-500">Kategori Z</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">75 terjual</p>
              <p className="text-sm text-gray-500">Rp 750.000</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
