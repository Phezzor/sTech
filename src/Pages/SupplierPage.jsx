import React, { useState, useEffect } from "react";
import { FaPlus, FaFilter, FaFileExport, FaEdit, FaTrash } from "react-icons/fa";

const SupplierPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("https://stechno.up.railway.app/api/supplier", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setSuppliers(data);
      } else {
        setError("Gagal mengambil data supplier");
      }
    } catch (err) {
      console.error("Error fetching suppliers:", err);
      setError("Terjadi kesalahan saat mengambil data supplier");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Supplier</h2>
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
            <FaPlus /> Tambah Supplier
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}
      
      {loading ? (
        <div className="text-center py-4">Loading supplier...</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm">
                  <th className="py-3 px-4 text-left border-b">Nama Supplier</th>
                  <th className="py-3 px-4 text-left border-b">Alamat</th>
                  <th className="py-3 px-4 text-left border-b">Telepon</th>
                  <th className="py-3 px-4 text-left border-b">Email</th>
                  <th className="py-3 px-4 text-left border-b">Status</th>
                  <th className="py-3 px-4 text-left border-b">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.length > 0 ? (
                  suppliers.map((supplier) => (
                    <tr key={supplier.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center text-xs">
                          {supplier.nama?.charAt(0) || "?"}
                        </div>
                        <span>{supplier.nama}</span>
                      </td>
                      <td className="py-3 px-4">{supplier.alamat || "-"}</td>
                      <td className="py-3 px-4">{supplier.telepon || "-"}</td>
                      <td className="py-3 px-4">{supplier.email || "-"}</td>
                      <td className="py-3 px-4">
                        <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          Aktif
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-blue-500 hover:text-blue-700 mr-2">
                          <FaEdit />
                        </button>
                        <button className="text-red-500 hover:text-red-700">
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-500">
                      Tidak ada data supplier
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {suppliers.length > 0 && (
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

export default SupplierPage;