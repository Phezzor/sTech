import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBox, FaUser, FaCalendar, FaList, FaShoppingCart, FaDollarSign, FaTruck } from "react-icons/fa";
import { useAnimatedMessage } from "../Component/AnimatedMessage";
import { FullPageLoading } from "../Component/Loading";

const TransactionDetailPage = ({ userData }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    showSuccess: showAnimatedSuccess,
    showError: showAnimatedError,
    showInfo: showAnimatedInfo,
    MessageContainer
  } = useAnimatedMessage();

  const [transaction, setTransaction] = useState(null);
  const [transactionDetails, setTransactionDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTransactionData();
  }, [id]);

  const fetchTransactionData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Fetch transaction header
      const transactionResponse = await fetch(`https://stechno.up.railway.app/api/transaksi/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!transactionResponse.ok) {
        throw new Error(`Failed to fetch transaction: ${transactionResponse.status}`);
      }

      const transactionData = await transactionResponse.json();
      setTransaction(transactionData);

      // Fetch transaction details
      const detailsResponse = await fetch(`https://stechno.up.railway.app/api/detail_transaksi?transaction_id=${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (detailsResponse.ok) {
        const detailsData = await detailsResponse.json();
        setTransactionDetails(Array.isArray(detailsData) ? detailsData : []);
      } else {
        console.warn("Failed to fetch transaction details");
        setTransactionDetails([]);
      }

    } catch (err) {
      console.error("Error fetching transaction data:", err);
      setError(err.message);
      showAnimatedError(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return Number(price).toLocaleString('id-ID');
  };

  const calculateTotal = () => {
    return transactionDetails.reduce((total, detail) => {
      return total + (parseFloat(detail.harga) * detail.quantity);
    }, 0);
  };

  const handleBack = () => {
    navigate("/transaksi");
  };

  if (loading) {
    return <FullPageLoading message="Loading transaction details..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-6">
        <MessageContainer />
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-200">
            <div className="text-center">
              <div className="text-6xl mb-4">❌</div>
              <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Transaction</h2>
              <p className="text-red-700 mb-6">{error}</p>
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl mx-auto"
              >
                <FaArrowLeft /> Back to Transactions
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-6">
        <MessageContainer />
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-yellow-200">
            <div className="text-center">
              <div className="text-6xl mb-4">📋</div>
              <h2 className="text-2xl font-bold text-yellow-600 mb-4">Transaction Not Found</h2>
              <p className="text-yellow-700 mb-6">The transaction you're looking for doesn't exist or has been removed.</p>
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl mx-auto"
              >
                <FaArrowLeft /> Back to Transactions
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-6">
      <MessageContainer />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Transaction Details
              </h1>
              <p className="text-blue-600 mt-2">
                Viewing details for transaction {transaction.id}
              </p>
            </div>
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-all duration-200"
            >
              <FaArrowLeft /> Back to Transactions
            </button>
          </div>
        </div>

        {/* Transaction Info */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Left Column - Transaction Header */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-200">
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <FaBox className="text-blue-600 text-xl" />
                <h3 className="text-lg font-semibold text-blue-800">Transaction Information</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-blue-600">Transaction ID</label>
                  <p className="text-lg font-mono text-blue-800 bg-white px-3 py-2 rounded-lg border border-blue-200 mt-1">
                    {transaction.id}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-blue-600">User</label>
                  <div className="flex items-center gap-2 mt-1">
                    <FaUser className="text-blue-600" />
                    <p className="text-lg font-medium text-blue-800 bg-white px-3 py-2 rounded-lg border border-blue-200 flex-1">
                      {transaction.user_id}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-blue-600">Type</label>
                  <div className="mt-1">
                    <span className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      transaction.type === 'IN'
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : transaction.type === 'OUT'
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : 'bg-gray-100 text-gray-800 border border-gray-200'
                    }`}>
                      {transaction.type === 'IN' ? 'Stock In' :
                       transaction.type === 'OUT' ? 'Stock Out' : transaction.type}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-blue-600">Date</label>
                  <div className="flex items-center gap-2 mt-1">
                    <FaCalendar className="text-blue-600" />
                    <p className="text-lg text-blue-800 bg-white px-3 py-2 rounded-lg border border-blue-200 flex-1">
                      {formatDate(transaction.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Description */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-200">
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
              <div className="flex items-center gap-3 mb-4">
                <FaList className="text-purple-600 text-xl" />
                <h3 className="text-lg font-semibold text-purple-800">Description</h3>
              </div>
              <div className="bg-white p-4 rounded-lg border border-purple-200">
                <p className="text-gray-700 leading-relaxed">
                  {transaction.description || "No description available"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-6">
            <FaShoppingCart className="text-green-600 text-xl" />
            <h3 className="text-xl font-semibold text-green-800">Transaction Details</h3>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
              {transactionDetails.length} items
            </span>
          </div>

          {transactionDetails.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-green-200 rounded-xl">
                  <thead>
                    <tr className="bg-gradient-to-r from-green-50 to-emerald-100 text-green-800 text-sm">
                      <th className="py-4 px-6 text-left border-b border-green-200 font-semibold">Product ID</th>
                      <th className="py-4 px-6 text-left border-b border-green-200 font-semibold">Quantity</th>
                      <th className="py-4 px-6 text-left border-b border-green-200 font-semibold">Unit Price</th>
                      <th className="py-4 px-6 text-left border-b border-green-200 font-semibold">Supplier</th>
                      <th className="py-4 px-6 text-left border-b border-green-200 font-semibold">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactionDetails.map((detail, index) => (
                      <tr key={detail.id || index} className="border-b border-green-100 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-200">
                        <td className="py-4 px-6">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-mono font-medium">
                            {detail.product_id}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <FaBox className="text-green-600" />
                            <span className="font-semibold text-green-800">{detail.quantity}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-medium text-green-800">
                            Rp {formatPrice(detail.harga)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <FaTruck className="text-orange-600" />
                            <span className="text-orange-800 font-medium">
                              {detail.supplier_id || 'No Supplier'}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-bold text-green-600 text-lg">
                            Rp {formatPrice(parseFloat(detail.harga) * detail.quantity)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Section */}
              <div className="bg-green-50 p-6 rounded-xl border border-green-200 mt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FaDollarSign className="text-green-600 text-2xl" />
                    <h4 className="text-xl font-semibold text-green-800">Total Amount</h4>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-green-600">
                      Rp {formatPrice(calculateTotal())}
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                      {transactionDetails.length} item{transactionDetails.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h4 className="text-xl font-semibold text-gray-600 mb-2">No Transaction Details</h4>
              <p className="text-gray-500">No items found for this transaction.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailPage;
