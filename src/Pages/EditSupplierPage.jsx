import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaSave, FaTimes, FaArrowLeft, FaBuilding, FaEnvelope, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { useToast } from "../Component/Toast";
import { useAnimatedMessage } from "../Component/AnimatedMessage";
import { ButtonLoading } from "../Component/Loading";
import { useActivity } from "../context/ActivityContext";
import { ActivityTypes } from "../utils/activityLogger";

const EditSupplierPage = ({ userData }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showSuccess, showError, showInfo } = useToast();
  const { logActivity } = useActivity();
  const {
    showSuccess: showAnimatedSuccess,
    showError: showAnimatedError,
    showInfo: showAnimatedInfo,
    MessageContainer
  } = useAnimatedMessage();
  
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [originalData, setOriginalData] = useState(null);

  // Check if user has admin role
  const isAdmin = userData?.role === 'admin' || userData?.role === 'administrator';

  const [formData, setFormData] = useState({
    nama: "",
    contact_info: "",
    address: ""
  });

  useEffect(() => {
    // Redirect if not admin
    if (!isAdmin) {
      showError("Access denied. Only administrators can edit suppliers.");
      navigate("/supplier");
      return;
    }

    fetchSupplierData();
  }, [id, isAdmin, navigate]);

  const fetchSupplierData = async () => {
    try {
      setPageLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await fetch(`https://stechno.up.railway.app/api/suppliers/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Supplier not found`);
      }

      const supplierData = await response.json();
      console.log("Fetched supplier data:", supplierData);

      // Handle different response formats
      const supplier = supplierData.data || supplierData;
      
      const supplierFormData = {
        nama: supplier.nama || "",
        contact_info: supplier.contact_info || "",
        address: supplier.address || ""
      };

      setFormData(supplierFormData);
      setOriginalData(supplierFormData);
      
    } catch (error) {
      console.error("Error fetching supplier:", error);
      showAnimatedError(`Failed to load supplier: ${error.message}`);
      setTimeout(() => navigate("/supplier"), 2000);
    } finally {
      setPageLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nama || !formData.contact_info || !formData.address) {
      showAnimatedError("Please fill in all required fields");
      return;
    }

    // Check if data has changed
    const hasChanges = Object.keys(formData).some(key => 
      formData[key] !== originalData[key]
    );

    if (!hasChanges) {
      showAnimatedInfo("No changes detected");
      return;
    }

    setLoading(true);
    showAnimatedInfo("Updating supplier...");

    try {
      const token = localStorage.getItem("token");
      
      const requestBody = {
        nama: formData.nama.trim(),
        contact_info: formData.contact_info.trim(),
        address: formData.address.trim()
      };

      console.log("Updating supplier with data:", requestBody);

      const response = await fetch(`https://stechno.up.railway.app/api/suppliers/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      console.log("Update response status:", response.status);

      if (response.ok) {
        const updatedSupplier = await response.json();
        console.log("Supplier updated successfully:", updatedSupplier);
        console.log("Updated data sent:", requestBody);
        console.log("Original data:", originalData);
        console.log("Form data:", formData);

        showAnimatedSuccess(`✅ Supplier "${formData.nama}" updated successfully!`);

        // Log activity
        logActivity(ActivityTypes.SUPPLIER_UPDATED, {
          name: formData.nama,
          id: id,
          changes: Object.keys(formData).filter(key => formData[key] !== originalData[key])
        }, userData?.id);

        // Force refresh the supplier list by dispatching a custom event
        window.dispatchEvent(new CustomEvent('supplierUpdated', {
          detail: { id, updatedData: requestBody }
        }));

        // Navigate after a short delay to show the success message
        setTimeout(() => {
          navigate("/supplier");
        }, 1500);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Update failed:", errorData);
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to update supplier`);
      }
    } catch (error) {
      console.error("Error updating supplier:", error);
      showAnimatedError(`❌ ${error.message || "Failed to update supplier. Please try again."}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Check if there are unsaved changes
    const hasChanges = Object.keys(formData).some(key => 
      formData[key] !== originalData[key]
    );

    if (hasChanges) {
      if (window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
        navigate("/supplier");
      }
    } else {
      navigate("/supplier");
    }
  };

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-blue-600 font-medium">Loading supplier data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-6">
      <MessageContainer />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Edit Supplier
              </h1>
              <p className="text-blue-600 mt-2">Update supplier information below</p>
            </div>
            <button
              onClick={() => navigate("/supplier")}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-all duration-200"
            >
              <FaArrowLeft /> Back to Suppliers
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-200">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">Supplier Information</h2>
            <p className="text-blue-600 text-sm">Update all supplier details below. All fields are required.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-1 gap-6">
              {/* Supplier Name */}
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  <FaBuilding className="inline mr-2 text-blue-600" />
                  Supplier Name *
                </label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  placeholder="e.g., PT. Indofood Sukses Makmur"
                  required
                />
                <p className="text-xs text-blue-500 mt-1">Enter the complete legal name of the supplier company</p>
              </div>

              {/* Contact Information */}
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  <FaEnvelope className="inline mr-2 text-blue-600" />
                  Contact Information *
                </label>
                <input
                  type="text"
                  name="contact_info"
                  value={formData.contact_info}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  placeholder="e.g., contact@indofood.com or +62-21-12345678"
                  required
                />
                <p className="text-xs text-blue-500 mt-1">Primary contact email or phone number for communication</p>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  <FaMapMarkerAlt className="inline mr-2 text-blue-600" />
                  Complete Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none"
                  placeholder="e.g., Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10110"
                  required
                />
                <p className="text-xs text-blue-500 mt-1">Full business address including street, city, and postal code</p>
              </div>
            </div>

            {/* Preview Changes */}
            {originalData && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="text-sm font-medium text-blue-800 mb-3">📝 Changes Preview:</h3>
                <div className="space-y-2 text-sm">
                  {formData.nama !== originalData.nama && (
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600">Name:</span>
                      <span className="text-red-500 line-through">{originalData.nama}</span>
                      <span className="text-green-600">→ {formData.nama}</span>
                    </div>
                  )}
                  {formData.contact_info !== originalData.contact_info && (
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600">Contact:</span>
                      <span className="text-red-500 line-through">{originalData.contact_info}</span>
                      <span className="text-green-600">→ {formData.contact_info}</span>
                    </div>
                  )}
                  {formData.address !== originalData.address && (
                    <div className="flex items-start gap-2">
                      <span className="text-blue-600">Address:</span>
                      <div className="flex-1">
                        <div className="text-red-500 line-through">{originalData.address}</div>
                        <div className="text-green-600">→ {formData.address}</div>
                      </div>
                    </div>
                  )}
                  {Object.keys(formData).every(key => formData[key] === originalData[key]) && (
                    <div className="text-blue-600 italic">No changes detected</div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-6 border-t border-blue-200">
              <ButtonLoading
                type="submit"
                loading={loading}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FaSave /> Update Supplier
              </ButtonLoading>

              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 px-6 py-3 border border-blue-300 text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200"
              >
                <FaTimes /> Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditSupplierPage;
