import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaSave, FaTimes, FaArrowLeft, FaPlus, FaTrash, FaBox, FaUser, FaFileAlt } from "react-icons/fa";
import { useAnimatedMessage } from "../Component/AnimatedMessage";
import { ButtonLoading, FullPageLoading } from "../Component/Loading";

const EditTransactionPage = ({ userData }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    showSuccess: showAnimatedSuccess,
    showError: showAnimatedError,
    showInfo: showAnimatedInfo,
    MessageContainer
  } = useAnimatedMessage();

  // Check if user has admin role
  const isAdmin = userData?.role === 'admin' || userData?.role === 'administrator';

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  // Transaction header form
  const [transactionForm, setTransactionForm] = useState({
    user_id: "",
    type: "IN",
    description: ""
  });

  // Transaction details (items)
  const [transactionDetails, setTransactionDetails] = useState([]);
  const [originalDetails, setOriginalDetails] = useState([]);

  useEffect(() => {
    if (!isAdmin) {
      showAnimatedError("Access denied. Only administrators can edit transactions.");
      navigate("/transaksi");
      return;
    }

    fetchTransactionData();
    fetchProducts();
    fetchSuppliers();
  }, [id, isAdmin, navigate]);

  const fetchTransactionData = async () => {
    try {
      setPageLoading(true);
      const token = localStorage.getItem("token");

      // Fetch transaction header
      const transactionResponse = await fetch(`https://stechno.up.railway.app/api/transaksi/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!transactionResponse.ok) {
        throw new Error("Transaction not found");
      }

      const transactionData = await transactionResponse.json();
      setTransactionForm({
        user_id: transactionData.user_id || "",
        type: transactionData.type || "IN",
        description: transactionData.description || ""
      });

      // Fetch transaction details
      const detailsResponse = await fetch(`https://stechno.up.railway.app/api/detail_transaksi?transaction_id=${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (detailsResponse.ok) {
        const detailsData = await detailsResponse.json();
        const details = Array.isArray(detailsData) ? detailsData : [];
        setTransactionDetails(details);
        setOriginalDetails(details);
      } else {
        setTransactionDetails([{
          product_id: "",
          quantity: 1,
          harga: "",
          supplier_id: ""
        }]);
      }

    } catch (error) {
      console.error("Error fetching transaction data:", error);
      showAnimatedError(`❌ ${error.message}`);
      navigate("/transaksi");
    } finally {
      setPageLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://stechno.up.railway.app/api/product", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://stechno.up.railway.app/api/suppliers", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setSuppliers(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const handleTransactionChange = (e) => {
    const { name, value } = e.target;
    setTransactionForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDetailChange = (index, field, value) => {
    const updatedDetails = [...transactionDetails];
    updatedDetails[index][field] = value;

    // Auto-fill price when product is selected
    if (field === 'product_id' && value) {
      const selectedProduct = products.find(p => p.id === value);
      if (selectedProduct) {
        updatedDetails[index].harga = selectedProduct.harga;
      }
    }

    setTransactionDetails(updatedDetails);
  };

  const addDetailRow = () => {
    setTransactionDetails([
      ...transactionDetails,
      {
        product_id: "",
        quantity: 1,
        harga: "",
        supplier_id: ""
      }
    ]);
  };

  const removeDetailRow = (index) => {
    if (transactionDetails.length > 1) {
      const updatedDetails = transactionDetails.filter((_, i) => i !== index);
      setTransactionDetails(updatedDetails);
    }
  };

  const calculateTotal = () => {
    return transactionDetails.reduce((total, detail) => {
      const price = parseFloat(detail.harga) || 0;
      const quantity = parseInt(detail.quantity) || 0;
      return total + (price * quantity);
    }, 0);
  };

  const validateForm = () => {
    if (!transactionForm.user_id || !transactionForm.type || !transactionForm.description) {
      showAnimatedError("Please fill in all transaction fields");
      return false;
    }

    for (let i = 0; i < transactionDetails.length; i++) {
      const detail = transactionDetails[i];
      if (!detail.product_id || !detail.quantity || !detail.harga) {
        showAnimatedError(`Please fill in all fields for item ${i + 1}`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    showAnimatedInfo("Updating transaction...");

    try {
      const token = localStorage.getItem("token");

      // Update transaction header
      const transactionResponse = await fetch(`https://stechno.up.railway.app/api/transaksi/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(transactionForm)
      });

      if (!transactionResponse.ok) {
        const errorData = await transactionResponse.json();
        throw new Error(errorData.message || "Failed to update transaction");
      }

      // Delete existing details
      for (const originalDetail of originalDetails) {
        if (originalDetail.id) {
          await fetch(`https://stechno.up.railway.app/api/detail_transaksi/${originalDetail.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
          });
        }
      }

      // Create new details
      for (const detail of transactionDetails) {
        const detailResponse = await fetch("https://stechno.up.railway.app/api/detail_transaksi", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            transaction_id: id,
            product_id: detail.product_id,
            quantity: parseInt(detail.quantity),
            harga: parseFloat(detail.harga),
            supplier_id: detail.supplier_id || null
          })
        });

        if (!detailResponse.ok) {
          console.warn("Failed to create detail item:", detail);
        }
      }

      showAnimatedSuccess(`✅ Transaction updated successfully!`);

      // Navigate after a short delay to show the success message
      setTimeout(() => {
        navigate("/transaksi");
      }, 1500);

    } catch (error) {
      console.error("Error updating transaction:", error);
      showAnimatedError(`❌ ${error.message || "Failed to update transaction. Please try again."}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  if (pageLoading) {
    return <FullPageLoading message="Loading transaction data..." />;
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
                Edit Transaction
              </h1>
              <p className="text-blue-600 mt-2">Update transaction {id} information and items</p>
            </div>
            <button
              onClick={() => navigate("/transaksi")}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-all duration-200"
            >
              <FaArrowLeft /> Back to Transactions
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transaction Header */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-200">
            <div className="flex items-center gap-3 mb-6">
              <FaFileAlt className="text-blue-600 text-xl" />
              <h3 className="text-xl font-semibold text-blue-800">Transaction Information</h3>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  User ID *
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                  <input
                    type="text"
                    name="user_id"
                    value={transactionForm.user_id}
                    onChange={handleTransactionChange}
                    className="w-full pl-10 pr-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter user ID"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Transaction Type *
                </label>
                <select
                  name="type"
                  value={transactionForm.type}
                  onChange={handleTransactionChange}
                  className="w-full px-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="IN">Stock In</option>
                  <option value="OUT">Stock Out</option>
                </select>
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Total Amount
                </label>
                <div className="px-4 py-3 bg-green-50 border border-green-300 rounded-xl">
                  <span className="text-lg font-bold text-green-600">
                    Rp {calculateTotal().toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={transactionForm.description}
                  onChange={handleTransactionChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter transaction description"
                  required
                />
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <FaBox className="text-green-600 text-xl" />
                <h3 className="text-xl font-semibold text-green-800">Transaction Items</h3>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
                  {transactionDetails.length} items
                </span>
              </div>
              <button
                type="button"
                onClick={addDetailRow}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FaPlus /> Add Item
              </button>
            </div>

            <div className="space-y-4">
              {transactionDetails.map((detail, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-800">Item {index + 1}</h4>
                    {transactionDetails.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDetailRow(index)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Remove Item"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product *
                      </label>
                      <select
                        value={detail.product_id}
                        onChange={(e) => handleDetailChange(index, 'product_id', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select Product</option>
                        {products.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.nama} ({product.produk_kode})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        value={detail.quantity}
                        onChange={(e) => handleDetailChange(index, 'quantity', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Qty"
                        min="1"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unit Price *
                      </label>
                      <input
                        type="number"
                        value={detail.harga}
                        onChange={(e) => handleDetailChange(index, 'harga', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Price"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Supplier
                      </label>
                      <select
                        value={detail.supplier_id}
                        onChange={(e) => handleDetailChange(index, 'supplier_id', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Supplier</option>
                        {suppliers.map((supplier) => (
                          <option key={supplier.id} value={supplier.id}>
                            {supplier.nama}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Subtotal:</span>
                      <span className="text-lg font-bold text-green-600">
                        Rp {((parseFloat(detail.harga) || 0) * (parseInt(detail.quantity) || 0)).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-3xl font-bold text-green-600">
                  Rp {calculateTotal().toLocaleString('id-ID')}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {transactionDetails.length} item{transactionDetails.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/transaksi")}
                  className="flex items-center gap-2 px-6 py-3 border border-blue-300 text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200"
                >
                  <FaTimes /> Cancel
                </button>

                <ButtonLoading
                  type="submit"
                  loading={loading}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <FaSave /> Update Transaction
                </ButtonLoading>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTransactionPage;
