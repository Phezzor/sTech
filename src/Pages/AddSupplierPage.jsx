import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSave, FaTimes, FaArrowLeft, FaBuilding, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { useToast } from "../Component/Toast";
import { ButtonLoading } from "../Component/Loading";
import { useActivity } from "../context/ActivityContext";
import { ActivityTypes } from "../utils/activityLogger";

const AddSupplierPage = ({ userData }) => {
  const navigate = useNavigate();
  const { showSuccess, showError, showInfo } = useToast();
  const { logActivity } = useActivity();
  const [loading, setLoading] = useState(false);

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
      showError("Access denied. Only administrators can add suppliers.");
      navigate("/supplier");
      return;
    }
  }, [isAdmin, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form submitted with data:", formData);

    if (!formData.nama || !formData.contact_info || !formData.address) {
      showError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    showInfo("Adding supplier...");

    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token);

      const requestBody = {
        ...formData
      };

      console.log("Request body:", requestBody);

      const response = await fetch("https://stechno.up.railway.app/api/suppliers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        const newSupplier = await response.json();
        console.log("Supplier added successfully:", newSupplier);
        showSuccess(`Supplier "${formData.nama}" added successfully!`);

        // Log activity
        logActivity(ActivityTypes.SUPPLIER_ADDED, {
          name: formData.nama,
          id: newSupplier.id || 'unknown',
          contact: formData.contact_info
        }, userData?.id);

        navigate("/supplier");
      } else {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to add supplier`);
      }
    } catch (error) {
      console.error("Error adding supplier:", error);
      showError(error.message || "Failed to add supplier. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Add New Supplier
              </h1>
              <p className="text-blue-600 mt-2">Fill in the form below to add a new supplier</p>
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
            <p className="text-blue-600 text-sm">Fill in all supplier details below. All fields are required.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
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

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-6 border-t border-blue-200">
              <ButtonLoading
                type="submit"
                loading={loading}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FaSave /> Add Supplier
              </ButtonLoading>

              <button
                type="button"
                onClick={() => navigate("/supplier")}
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

export default AddSupplierPage;
