import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaEdit, 
  FaTrash, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaCalendarAlt,
  FaBox,
  FaPhone,
  FaGlobe,
  FaUser,
  FaBuilding
} from "react-icons/fa";
import { useToast } from "../Component/Toast";
import { FullPageLoading, ButtonLoading } from "../Component/Loading";
import { useActivity } from "../context/ActivityContext";
import { ActivityTypes } from "../utils/activityLogger";

const SupplierDetailPage = ({ userData }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError, showInfo } = useToast();
  const { logActivity } = useActivity();

  // Check if user has admin role
  const isAdmin = userData?.role === 'admin' || userData?.role === 'administrator';

  // State management
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchSupplierDetail();
      fetchRelatedProducts();
    }
  }, [id]);

  const fetchSupplierDetail = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await fetch(`https://stechno.up.railway.app/api/suppliers/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Supplier detail data:", data);
        
        // Handle different response formats
        const supplierData = data.data || data;
        setSupplier(supplierData);
        setError(null);
      } else if (response.status === 404) {
        setError("Supplier not found");
      } else {
        throw new Error(`Failed to fetch supplier details. Status: ${response.status}`);
      }
    } catch (err) {
      console.error("Error fetching supplier detail:", err);
      setError("Failed to load supplier details. Please try again.");
      showError("Failed to load supplier details: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      setProductsLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await fetch("https://stechno.up.railway.app/api/product", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const products = Array.isArray(data) ? data : (data.data || []);
        
        // Filter products by supplier
        const supplierProducts = products.filter(product => 
          product.supplier_id === id || 
          product.supplier_id === parseInt(id) ||
          product.supplier_nama === supplier?.nama
        );
        
        setRelatedProducts(supplierProducts);
      }
    } catch (err) {
      console.error("Error fetching related products:", err);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleDeleteSupplier = async () => {
    if (!isAdmin) {
      showError("Access denied. Only administrators can delete suppliers.");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${supplier?.nama}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeleteLoading(true);
      showInfo("Deleting supplier...");

      const token = localStorage.getItem("token");
      const response = await fetch(`https://stechno.up.railway.app/api/suppliers/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        showSuccess(`Supplier "${supplier?.nama}" deleted successfully!`);
        
        // Log activity
        logActivity(ActivityTypes.SUPPLIER_DELETED, {
          name: supplier?.nama,
          id: id
        }, userData?.id);

        // Navigate back to suppliers list
        navigate("/supplier");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete supplier");
      }
    } catch (error) {
      console.error("Delete error:", error);
      showError(error.message || "Failed to delete supplier. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return "Invalid date";
    }
  };

  if (loading) {
    return <FullPageLoading message="Loading supplier details..." />;
  }

  if (error) {
    return (
      <div className="min-h-full bg-transparent flex items-center justify-center p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl max-w-md text-center">
          <h3 className="font-semibold mb-2">Error</h3>
          <p>{error}</p>
          <button
            onClick={() => navigate("/supplier")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Suppliers
          </button>
        </div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="min-h-full bg-transparent flex items-center justify-center p-6">
        <div className="text-center text-blue-600">
          <div className="text-4xl mb-4">🏢</div>
          <p className="text-lg font-medium mb-2">Supplier not found</p>
          <button
            onClick={() => navigate("/supplier")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Suppliers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-transparent">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/supplier")}
                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200"
                title="Back to Suppliers"
              >
                <FaArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Supplier Details
                </h1>
                <p className="text-blue-600 mt-1">View and manage supplier information</p>
              </div>
            </div>

            {isAdmin && (
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/suppliers/edit/${id}`)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-200"
                >
                  <FaEdit /> Edit
                </button>
                <ButtonLoading
                  onClick={handleDeleteSupplier}
                  loading={deleteLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200"
                >
                  <FaTrash /> Delete
                </ButtonLoading>
              </div>
            )}
          </div>
        </div>

        {/* Supplier Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6 border border-blue-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {supplier.nama?.charAt(0) || "S"}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-blue-800 mb-2">{supplier.nama}</h2>
                <p className="text-blue-600 mb-1">Supplier ID: #{supplier.id}</p>
                <span className="px-3 py-1 rounded-lg text-sm font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FaEnvelope className="text-blue-500 mt-1" />
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Email</p>
                    <p className="text-blue-800">{supplier.contact_info || "Not provided"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-blue-500 mt-1" />
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Address</p>
                    <p className="text-blue-800">{supplier.address || "Not provided"}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FaCalendarAlt className="text-blue-500 mt-1" />
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Created Date</p>
                    <p className="text-blue-800">{formatDate(supplier.created_at)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FaCalendarAlt className="text-blue-500 mt-1" />
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Last Updated</p>
                    <p className="text-blue-800">{formatDate(supplier.updated_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FaBox className="text-blue-500" />
                    <span className="text-blue-600">Products</span>
                  </div>
                  <span className="font-semibold text-blue-800">{relatedProducts.length}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-blue-500" />
                    <span className="text-blue-600">Days Active</span>
                  </div>
                  <span className="font-semibold text-blue-800">
                    {supplier.created_at ? Math.floor((new Date() - new Date(supplier.created_at)) / (1000 * 60 * 60 * 24)) : 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-blue-800">Products from this Supplier</h3>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">
              {relatedProducts.length} products
            </span>
          </div>

          {productsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-blue-600">Loading products...</span>
            </div>
          ) : relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedProducts.map((product) => (
                <div key={product.id} className="border border-blue-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold">
                      {product.nama?.charAt(0) || "P"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-blue-800 truncate">{product.nama}</h4>
                      <p className="text-sm text-blue-600 mb-2">#{product.produk_kode}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-green-600">
                          Rp {parseFloat(product.harga || 0).toLocaleString('id-ID')}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.stock > 10
                            ? 'bg-green-100 text-green-800'
                            : product.stock > 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stock} stock
                        </span>
                      </div>

                      <button
                        onClick={() => navigate(`/products/${product.id}`)}
                        className="mt-3 w-full px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                      >
                        View Product
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-blue-600">
              <div className="text-4xl mb-4">📦</div>
              <p className="text-lg font-medium mb-2">No products found</p>
              <p className="text-sm">This supplier doesn't have any products yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierDetailPage;
