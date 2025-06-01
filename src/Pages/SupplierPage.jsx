import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaFilter, FaFileExport, FaPlus, FaEye, FaEdit, FaTrash, FaPhone, FaEnvelope, FaMapMarkerAlt, FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useToast } from "../Component/Toast";
import { TableSkeleton, LoadingOverlay, ButtonLoading } from "../Component/Loading";

const SupplierPage = ({ userData }) => {
  const navigate = useNavigate();
  const { showSuccess, showError, showInfo } = useToast();

  // Check if user has admin role
  const isAdmin = userData?.role === 'admin' || userData?.role === 'administrator';

  // State management
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const itemsPerPage = 10;

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("nama");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetchSuppliers();
  }, [currentPage, searchTerm, sortBy, sortOrder]);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      console.log("Fetching suppliers with token:", token);

      // Simple fetch without complex query params for now
      const response = await fetch("https://stechno.up.railway.app/api/suppliers", {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("Suppliers response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Suppliers data received:", data);

        // Handle different API response formats
        let suppliersData = [];
        if (data.data && Array.isArray(data.data)) {
          suppliersData = data.data;
          setTotalPages(data.totalPages || Math.ceil(data.total / itemsPerPage));
          setTotalSuppliers(data.total || data.data.length);
        } else if (Array.isArray(data)) {
          suppliersData = data;
          setTotalPages(Math.ceil(data.length / itemsPerPage));
          setTotalSuppliers(data.length);
        } else {
          suppliersData = [];
        }

        // Apply client-side filtering if search term exists
        if (searchTerm) {
          suppliersData = suppliersData.filter(supplier =>
            supplier.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            supplier.contact_info?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            supplier.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            supplier.id?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        // Apply client-side sorting
        suppliersData.sort((a, b) => {
          const aValue = a[sortBy] || '';
          const bValue = b[sortBy] || '';

          if (sortOrder === 'asc') {
            return aValue.toString().localeCompare(bValue.toString());
          } else {
            return bValue.toString().localeCompare(aValue.toString());
          }
        });

        setSuppliers(suppliersData);
        setError(null);
        console.log("Suppliers loaded successfully:", suppliersData.length);
      } else {
        throw new Error(`Failed to fetch suppliers. Status: ${response.status}`);
      }
    } catch (err) {
      console.error("Error fetching suppliers:", err);
      setError("Failed to load suppliers. Please try again.");
      showError("Failed to load suppliers: " + err.message);
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    try {
      showInfo("Exporting suppliers...");
      const csvContent = "data:text/csv;charset=utf-8,"
        + "Supplier ID,Name,Contact,Email,Address\n"
        + suppliers.map(supplier =>
            `${supplier.id},${supplier.nama},${supplier.contact_info || ''},${supplier.alamat || ''}`
          ).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "suppliers.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showSuccess(`Successfully exported ${suppliers.length} suppliers!`);
    } catch (error) {
      showError("Failed to export suppliers. Please try again.");
    }
  };

  const handleDeleteSupplier = async (supplierId, supplierName) => {
    if (!isAdmin) {
      showError("Access denied. Only administrators can delete suppliers.");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${supplierName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeleteLoading(supplierId);
      showInfo("Deleting supplier...");

      const token = localStorage.getItem("token");
      const response = await fetch(`https://stechno.up.railway.app/api/suppliers/${supplierId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        showSuccess(`Supplier "${supplierName}" deleted successfully!`);
        fetchSuppliers(); // Refresh the list
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete supplier");
      }
    } catch (error) {
      console.error("Delete error:", error);
      showError(error.message || "Failed to delete supplier. Please try again.");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-blue-200">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Supplier Management
              </h1>
              <p className="text-blue-600 mt-2">
                Manage your supplier relationships ({totalSuppliers} suppliers)
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 border border-blue-300 rounded-xl bg-white hover:bg-blue-50 text-blue-600 transition-all duration-200"
              >
                <FaFileExport /> Export
              </button>

              {isAdmin && (
                <button
                  onClick={() => navigate("/suppliers/add")}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <FaPlus /> Add Supplier
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-blue-200">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
              <input
                type="text"
                placeholder="Search suppliers..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => handleSort(e.target.value)}
              className="px-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="nama">Sort by Name</option>
              <option value="contact_info">Sort by Email</option>
              <option value="address">Sort by Address</option>
              <option value="created_at">Sort by Date</option>
            </select>

            <button
              onClick={() => handleSort(sortBy)}
              className="px-4 py-3 border border-blue-300 rounded-xl hover:bg-blue-50 transition-all duration-200"
            >
              {sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-200">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">{error}</div>
          )}

          {loading ? (
            <TableSkeleton rows={5} columns={6} />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-blue-200 rounded-xl">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 text-sm">
                      <th className="py-4 px-6 text-left border-b border-blue-200 font-semibold">Supplier</th>
                      <th className="py-4 px-6 text-left border-b border-blue-200 font-semibold">Email</th>
                      <th className="py-4 px-6 text-left border-b border-blue-200 font-semibold">Address</th>
                      <th className="py-4 px-6 text-left border-b border-blue-200 font-semibold">Created Date</th>
                      <th className="py-4 px-6 text-left border-b border-blue-200 font-semibold">Status</th>
                      <th className="py-4 px-6 text-left border-b border-blue-200 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suppliers.length > 0 ? (
                      suppliers.map((supplier) => (
                        <tr key={supplier.id} className="border-b border-blue-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition-all duration-200">
                          <td className="py-4 px-6 flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg">
                              {supplier.nama?.charAt(0) || "S"}
                            </div>
                            <div>
                              <span className="font-medium text-gray-800">{supplier.nama}</span>
                              <p className="text-sm text-blue-600">ID: #{supplier.id}</p>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            {supplier.contact_info ? (
                              <div className="flex items-center gap-2">
                                <FaEnvelope className="text-blue-500 text-sm" />
                                <span className="text-blue-800">{supplier.contact_info}</span>
                              </div>
                            ) : (
                              <span className="text-gray-400">No contact</span>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            {supplier.address ? (
                              <div className="flex items-center gap-2">
                                <FaMapMarkerAlt className="text-blue-500 text-sm" />
                                <span className="text-blue-800 text-sm">{supplier.address.length > 30 ? supplier.address.substring(0, 30) + '...' : supplier.address}</span>
                              </div>
                            ) : (
                              <span className="text-gray-400">No address</span>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            {supplier.created_at ? (
                              <span className="text-blue-800 text-sm">
                                {new Date(supplier.created_at).toLocaleDateString('id-ID')}
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            <span className="px-3 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-800">
                              Active
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <button
                                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                title="View Details"
                              >
                                <FaEye />
                              </button>
                              <button
                                className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-all duration-200"
                                title="Edit Supplier"
                              >
                                <FaEdit />
                              </button>
                              {isAdmin && (
                                <ButtonLoading
                                  onClick={() => handleDeleteSupplier(supplier.id, supplier.nama)}
                                  loading={deleteLoading === supplier.id}
                                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                                  title="Delete Supplier"
                                >
                                  <FaTrash />
                                </ButtonLoading>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="py-12 text-center">
                          <div className="text-blue-600">
                            <div className="text-4xl mb-4">🏢</div>
                            <p className="text-lg font-medium mb-2">No suppliers found</p>
                            <p className="text-sm">Start by adding your first supplier</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-blue-50 px-6 py-4 border-t border-blue-200 mt-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-blue-600">
                      Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalSuppliers)} of {totalSuppliers} suppliers
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1 px-3 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        <FaChevronLeft /> Previous
                      </button>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                                currentPage === pageNum
                                  ? 'bg-blue-600 text-white'
                                  : 'text-blue-600 border border-blue-300 hover:bg-blue-100'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-1 px-3 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        Next <FaChevronRight />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierPage;