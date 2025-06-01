import React, { useState, useEffect } from "react";
import { FaUser, FaEdit, FaSave, FaTimes, FaCamera } from "react-icons/fa";
import { useToast } from "../Component/Toast";
import { ButtonLoading, LoadingOverlay } from "../Component/Loading";

const ProfilePage = ({ userData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    username: "",
    email: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { showSuccess, showError, showInfo } = useToast();

  useEffect(() => {
    if (userData) {
      setFormData({
        id: userData.id || "",
        username: userData.username || "",
        email: userData.email || "",
        role: userData.role || "",
      });
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      showInfo("Updating profile...");

      console.log("Updating profile with data:", formData);

      const token = localStorage.getItem("token");
      console.log("Token:", token);

      // Try different API endpoints for profile update
      const endpoints = [
        
        `https://stechno.up.railway.app/api/users/${formData.id}`
      ];

      let response;
      let endpoint;

      for (const url of endpoints) {
        try {
          console.log("Trying endpoint:", url);
          response = await fetch(url, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              username: formData.username,
              email: formData.email
            }),
          });

          console.log("Response status:", response.status);

          if (response.ok) {
            endpoint = url;
            break;
          } else {
            const errorData = await response.json();
            console.log("Error from", url, ":", errorData);
          }
        } catch (e) {
          console.log("Endpoint failed:", url, e.message);
          continue;
        }
      }

      if (response && response.ok) {
        const result = await response.json();
        console.log("Profile updated successfully:", result);
        showSuccess("Profile updated successfully!");
        setIsEditing(false);
      } else {
        throw new Error(`Failed to update profile from all endpoints. Last status: ${response?.status}`);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      showError("Failed to update profile: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (userData) {
      setFormData({
        id: userData.id || "",
        username: userData.username || "",
        email: userData.email || "",
        role: userData.role || "",
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-6">
      <LoadingOverlay isVisible={saving} message="Updating profile..." />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border border-blue-200">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              User Profile
            </h1>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FaEdit /> Edit Profile
              </button>
            ) : (
              <div className="flex gap-3">
                <ButtonLoading
                  onClick={handleSave}
                  loading={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <FaSave /> Save
                </ButtonLoading>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <FaTimes /> Cancel
                </button>
              </div>
            )}
          </div>

          {/* Profile Content */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Avatar Section */}
            <div className="md:col-span-1">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                    {formData.username ? formData.username.charAt(0).toUpperCase() : <FaUser />}
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200">
                      <FaCamera className="text-blue-600" />
                    </button>
                  )}
                </div>
                <h2 className="text-xl font-semibold mt-4 text-blue-800">{formData.username}</h2>
                <p className="text-blue-600 capitalize">{formData.role}</p>
              </div>
            </div>

            {/* Form Section */}
            <div className="md:col-span-2">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">User ID</label>
                  <input
                    type="text"
                    name="id"
                    value={formData.id}
                    disabled={true}
                    className="w-full px-4 py-3 border border-blue-300 rounded-xl bg-blue-50 text-blue-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 ${
                      isEditing
                        ? "border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white"
                        : "border-blue-300 bg-blue-50 cursor-not-allowed text-blue-600"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 ${
                      isEditing
                        ? "border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white"
                        : "border-blue-300 bg-blue-50 cursor-not-allowed text-blue-600"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">Role</label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    disabled={true}
                    className="w-full px-4 py-3 border border-blue-300 rounded-xl bg-blue-50 text-blue-500 cursor-not-allowed capitalize"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Account Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-blue-600">Account Status:</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-600">Member Since:</span>
                <span className="text-blue-800">January 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-600">Last Login:</span>
                <span className="text-blue-800">Today</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Security</h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-200 text-blue-700">
                Change Password
              </button>
              <button className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-200 text-blue-700">
                Two-Factor Authentication
              </button>
              <button className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-200 text-blue-700">
                Login History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
