import { FaBox, FaShoppingCart, FaChartLine } from "react-icons/fa";

function Dashboard({ dataProduk, totalTransaksi }) {
  // Statistik dasar
  const totalProduk = dataProduk.length;
  const totalStok = dataProduk.reduce((total, produk) => total + produk.stok, 0);
  
  // Data dummy untuk grafik (bisa disesuaikan)
  const penjualanMingguan = [
    { hari: "Senin", jumlah: 12 },
    { hari: "Selasa", jumlah: 19 },
    { hari: "Rabu", jumlah: 8 },
    { hari: "Kamis", jumlah: 15 },
    { hari: "Jumat", jumlah: 22 },
    { hari: "Sabtu", jumlah: 30 },
    { hari: "Minggu", jumlah: 25 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Dashboard</h2>
      
      {/* Kartu statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Produk</p>
              <p className="text-2xl font-semibold text-gray-800">{totalProduk}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <FaBox size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Stok</p>
              <p className="text-2xl font-semibold text-gray-800">{totalStok}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <FaBox size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Transaksi</p>
              <p className="text-2xl font-semibold text-gray-800">{totalTransaksi}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
              <FaShoppingCart size={20} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Grafik penjualan mingguan */}
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Penjualan Mingguan</h3>
        <div className="h-64 flex items-end justify-between px-2">
          {penjualanMingguan.map((data, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className="w-8 bg-sky-500 rounded-t"
                style={{ height: `${data.jumlah * 2}px` }}
              ></div>
              <p className="text-xs mt-1">{data.hari}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Tabel produk */}
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Daftar Produk</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Produk
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stok
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dataProduk.map((produk, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 whitespace-nowrap">{produk.nama}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{produk.kategori}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      produk.stok > 5 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {produk.stok}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;