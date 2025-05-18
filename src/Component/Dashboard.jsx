import { FaBoxes, FaShoppingCart, FaMoneyBillWave } from "react-icons/fa";

function Dashboard({ dataProduk, totalTransaksi }) {
  // Hitung jumlah barang (total stok)
  const jumlahBarang = dataProduk.reduce((sum, item) => sum + item.stok, 0);

  // Harga dummy per produk
  const hargaPerProduk = {
    "Es Teh": 5000,
    "Kopi Hitam": 8000,
    "Es Krim Coklat": 12000,
  };

  const totalHarga = dataProduk.reduce((sum, item) => {
    const harga = hargaPerProduk[item.nama] || 0;
    return sum + item.stok * harga;
  }, 0);

  const cardClasses = "flex items-center gap-5 p-5 bg-white rounded-xl shadow-md";

  // Warna icon tiap card biar beda-beda
  const iconStyle = {
    jumlahBarang: "text-indigo-500",
    totalTransaksi: "text-green-500",
    totalHarga: "text-yellow-500",
  };

  return (
    <div className="p-6 bg-gray-50 min-h-[70vh]">
      <h1 className="text-3xl font-semibold mb-8 text-gray-800">Dashboard</h1>
      <div className="flex flex-col md:flex-row md:justify-between gap-6">
        {/* Jumlah Barang */}
        <div className={cardClasses}>
          <FaBoxes size={48} className={iconStyle.jumlahBarang} />
          <div>
            <h2 className="text-lg font-medium text-gray-700">Jumlah Barang</h2>
            <p className="text-3xl font-bold text-gray-900">{jumlahBarang}</p>
            <p className="text-sm text-gray-500">Total stok produk yang tersedia</p>
          </div>
        </div>

        {/* Jumlah Transaksi */}
        <div className={cardClasses}>
          <FaShoppingCart size={48} className={iconStyle.totalTransaksi} />
          <div>
            <h2 className="text-lg font-medium text-gray-700">Jumlah Transaksi</h2>
            <p className="text-3xl font-bold text-gray-900">{totalTransaksi}</p>
            <p className="text-sm text-gray-500">Total transaksi yang sudah dilakukan</p>
          </div>
        </div>

        {/* Total Harga Barang */}
        <div className={cardClasses}>
          <FaMoneyBillWave size={48} className={iconStyle.totalHarga} />
          <div>
            <h2 className="text-lg font-medium text-gray-700">Total Harga Barang</h2>
            <p className="text-3xl font-bold text-gray-900">
              Rp {totalHarga.toLocaleString("id-ID")}
            </p>
            <p className="text-sm text-gray-500">Estimasi nilai semua stok produk</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
