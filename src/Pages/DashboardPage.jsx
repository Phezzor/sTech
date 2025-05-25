// pages/DashboardPage.js
import Dashboard from "../Component/Dashboard";

// Dummy data untuk simulasi
const dataProduk = [
  { nama: "Produk A", kategori: "Elektronik", stok: 10 },
  { nama: "Produk B", kategori: "Pakaian", stok: 3 },
  { nama: "Produk C", kategori: "Makanan", stok: 8 },
];

const totalTransaksi = 123;

function DashboardPage() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Dashboard dataProduk={dataProduk} totalTransaksi={totalTransaksi} />
    </div>
  );
}

export default DashboardPage;
