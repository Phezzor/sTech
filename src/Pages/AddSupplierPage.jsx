import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSave, FaTimes, FaArrowLeft } from "react-icons/fa";
import { useToast } from "../Component/Toast";
import { ButtonLoading } from "../Component/Loading";

const AddSupplierPage = ({ userData }) => {
  const navigate = useNavigate();
  const { showSuccess, showError, showInfo } = useToast();
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Supplier Name *
                </label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter supplier name (e.g., CV Jaya Bersama)"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Contact Info *
                </label>
                <input
                  type="text"
                  name="contact_info"
                  value={formData.contact_info}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter contact info (email, phone, etc.)"
                  required
                />
                <p className="text-sm text-blue-600 mt-1">
                  You can enter email, phone number, or any contact information
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter supplier address (e.g., Arengka II)"
                  required
                />
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
