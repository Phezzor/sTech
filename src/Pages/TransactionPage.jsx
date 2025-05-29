import React, { useState, useEffect } from "react";
import { FaPlus, FaFilter, FaFileExport } from "react-icons/fa";

const TransactionPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("https://stechno.up.railway.app/api/transactions", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      } else {
        setError("Gagal mengambil data transaksi");
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Terjadi kesalahan saat mengambil data transaksi");
    } finally {
      setLoading(false);
    }
  };

  // Format tanggal
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // Format harga
  const formatPrice = (price) => {
    try {
      return parseFloat(price).toLocaleString('id-ID', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    } catch (error) {
      return "0.00";
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Transaksi</h2>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border rounded-md bg-gray-50 hover:bg-gray-100">
            <FaFilter /> Filter
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 border rounded-md bg-gray-50 hover:bg-gray-100">
            <FaFileExport /> Export
          </button>
          
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer"
          >
            <FaPlus /> Tambah Transaksi
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}
      
      {loading ? (
        <div className="text-center py-4">Loading transaksi...</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm">
                  <th className="py-3 px-4 text-left border-b">ID Transaksi</th>
                  <th className="py-3 px-4 text-left border-b">Tanggal</th>
                  <th className="py-3 px-4 text-left border-b">Pelanggan</th>
                  <th className="py-3 px-4 text-left border-b">Total</th>
                  <th className="py-3 px-4 text-left border-b">Status</th>
                  <th className="py-3 px-4 text-left border-b">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">#{transaction.id}</td>
                      <td className="py-3 px-4">{formatDate(transaction.tanggal)}</td>
                      <td className="py-3 px-4">{transaction.pelanggan}</td>
                      <td className="py-3 px-4">Rp {formatPrice(transaction.total)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          transaction.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : transaction.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.status === 'completed' ? 'Selesai' : 
                           transaction.status === 'pending' ? 'Pending' : 'Dibatalkan'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-blue-500 hover:text-blue-700 mr-2">
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-500">
                      Tidak ada data transaksi
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {transactions.length > 0 && (
            <div className="flex justify-between items-center mt-4">
              <button className="px-3 py-1 border rounded text-gray-500 hover:bg-gray-50">Previous</button>
              <div className="flex gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded bg-blue-500 text-white">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded border">2</button>
                <button className="w-8 h-8 flex items-center justify-center rounded border">3</button>
              </div>
              <button className="px-3 py-1 border rounded text-gray-500 hover:bg-gray-50">Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TransactionPage;