import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaFilter, FaFileExport, FaEye, FaEdit, FaTrash, FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useToast } from "../Component/Toast";
import { useAnimatedMessage } from "../Component/AnimatedMessage";
import { TableSkeleton, LoadingOverlay, ButtonLoading } from "../Component/Loading";

const TransactionPage = ({ userData }) => {
  const navigate = useNavigate();
  const { showSuccess, showError, showInfo } = useToast();
  const {
    showSuccess: showAnimatedSuccess,
    showError: showAnimatedError,
    showInfo: showAnimatedInfo,
    MessageContainer
  } = useAnimatedMessage();

  // Check if user has admin role
  const isAdmin = userData?.role === 'admin' || userData?.role === 'administrator';

  // State management
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const itemsPerPage = 10;

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("tanggal");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    fetchTransactions();
  }, [currentPage, searchTerm, statusFilter, sortBy, sortOrder]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      console.log("Fetching transactions with token:", token);

      // Try different API endpoints
      const endpoints = [
        "https://stechno.up.railway.app/api/transaksi",
        "https://stechno.up.railway.app/api/transactions",
        "https://stechno.up.railway.app/api/transaction"
      ];

      let response;
      let endpoint;

      for (const url of endpoints) {
        try {
          console.log("Trying endpoint:", url);
          response = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (response.ok) {
            endpoint = url;
            break;
          }
        } catch (e) {
          console.log("Endpoint failed:", url, e.message);
          continue;
        }
      }

      if (response && response.ok) {
        const data = await response.json();
        console.log("Transaction data received:", data);

        // Handle different API response formats
        if (data.data && Array.isArray(data.data)) {
          setTransactions(data.data);
          setTotalPages(data.totalPages || Math.ceil(data.total / itemsPerPage));
          setTotalTransactions(data.total || data.data.length);
        } else if (Array.isArray(data)) {
          setTransactions(data);
          setTotalPages(Math.ceil(data.length / itemsPerPage));
          setTotalTransactions(data.length);
        } else {
          setTransactions([]);
        }
        setError(null);
        console.log("Transactions loaded successfully from:", endpoint);
      } else {
        throw new Error(`Failed to fetch transactions from all endpoints. Last status: ${response?.status}`);
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Failed to load transactions. Please try again.");
      showError("Failed to load transactions: " + err.message);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    try {
      showInfo("Exporting transactions...");
      const csvContent = "data:text/csv;charset=utf-8,"
        + "Transaction ID,Date,Customer,Total,Status\n"
        + transactions.map(transaction =>
            `${transaction.id},${formatDate(transaction.tanggal)},${transaction.pelanggan || 'N/A'},${transaction.total || 0},${transaction.status || 'pending'}`
          ).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "transactions.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showSuccess(`Successfully exported ${transactions.length} transactions!`);
    } catch (error) {
      showError("Failed to export transactions. Please try again.");
    }
  };

  const handleDeleteTransaction = async (transactionId, transactionInfo) => {
    if (!isAdmin) {
      showAnimatedError("Access denied. Only administrators can delete transactions.");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete transaction ${transactionId}? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeleteLoading(transactionId);
      showAnimatedInfo("Deleting transaction...");

      const token = localStorage.getItem("token");
      const response = await fetch(`https://stechno.up.railway.app/api/transaksi/${transactionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        showAnimatedSuccess(`🗑️ Transaction ${transactionId} deleted successfully!`);
        fetchTransactions(); // Refresh the list
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete transaction");
      }
    } catch (error) {
      console.error("Delete error:", error);
      showAnimatedError(`❌ ${error.message || "Failed to delete transaction. Please try again."}`);
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

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filtering
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-6">
      <MessageContainer />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-blue-200">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Transaction Management
              </h1>
              <p className="text-blue-600 mt-2">
                Manage your transaction history ({totalTransactions} transactions)
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
                  onClick={() => navigate("/transaksi/add")}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <FaPlus /> Add Transaction
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-blue-200">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
              <select
                value={statusFilter}
                onChange={handleStatusFilter}
                className="w-full pl-10 pr-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="">All Types</option>
                <option value="IN">Stock In</option>
                <option value="OUT">Stock Out</option>
              </select>
            </div>

            <select
              value={sortBy}
              onChange={(e) => handleSort(e.target.value)}
              className="px-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="created_at">Sort by Date</option>
              <option value="type">Sort by Type</option>
              <option value="user_id">Sort by User</option>
              <option value="id">Sort by ID</option>
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
                      <th className="py-4 px-6 text-left border-b border-blue-200 font-semibold">Transaction ID</th>
                      <th className="py-4 px-6 text-left border-b border-blue-200 font-semibold">User</th>
                      <th className="py-4 px-6 text-left border-b border-blue-200 font-semibold">Type</th>
                      <th className="py-4 px-6 text-left border-b border-blue-200 font-semibold">Description</th>
                      <th className="py-4 px-6 text-left border-b border-blue-200 font-semibold">Date</th>
                      <th className="py-4 px-6 text-left border-b border-blue-200 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.length > 0 ? (
                      transactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b border-blue-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition-all duration-200">
                          <td className="py-4 px-6">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-mono font-medium">
                              {transaction.id}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="font-medium text-blue-800">{transaction.user_id || 'Unknown User'}</span>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                              transaction.type === 'IN'
                                ? 'bg-green-100 text-green-800'
                                : transaction.type === 'OUT'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {transaction.type === 'IN' ? 'IN' :
                               transaction.type === 'OUT' ? 'OUT' : transaction.type}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-blue-800 text-sm">
                              {transaction.description ?
                                (transaction.description.length > 50 ?
                                  transaction.description.substring(0, 50) + '...' :
                                  transaction.description
                                ) :
                                'No description'
                              }
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-blue-800">{formatDate(transaction.created_at || new Date())}</span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => navigate(`/transactions/${transaction.id}`)}
                                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                title="View Details"
                              >
                                <FaEye />
                              </button>

                              {isAdmin && (
                                <button
                                  onClick={() => navigate(`/transaksi/edit/${transaction.id}`)}
                                  className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-all duration-200"
                                  title="Edit Transaction"
                                >
                                  <FaEdit />
                                </button>
                              )}

                              {isAdmin && (
                                <ButtonLoading
                                  onClick={() => handleDeleteTransaction(transaction.id, transaction)}
                                  loading={deleteLoading === transaction.id}
                                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                                  title="Delete Transaction"
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
                            <div className="text-4xl mb-4">📋</div>
                            <p className="text-lg font-medium mb-2">No transactions found</p>
                            <p className="text-sm">Start by adding your first transaction</p>
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
                      Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalTransactions)} of {totalTransactions} transactions
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

export default TransactionPage;