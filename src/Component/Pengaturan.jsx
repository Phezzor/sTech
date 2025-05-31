import React, { useState } from "react";
import { FaUser, FaBell, FaLock, FaGlobe, FaPalette, FaDatabase, FaSave, FaUserShield } from "react-icons/fa";
import { useToast } from "./Toast";
import { ButtonLoading } from "./Loading";

function Pengaturan({ userData }) {
  const { showSuccess, showError, showInfo } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);

  // Profile Settings
  const [profileSettings, setProfileSettings] = useState({
    username: userData?.username || "",
    email: userData?.email || "",
    phone: userData?.phone || "",
    address: userData?.address || "",
    bio: userData?.bio || ""
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    orderUpdates: true,
    stockAlerts: true
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: 30,
    passwordExpiry: 90
  });

  // System Settings
  const [systemSettings, setSystemSettings] = useState({
    language: "en",
    timezone: "UTC+7",
    dateFormat: "DD/MM/YYYY",
    currency: "IDR",
    theme: "light"
  });

  const tabs = [
    { id: "profile", label: "Profile", icon: FaUser },
    { id: "notifications", label: "Notifications", icon: FaBell },
    { id: "security", label: "Security", icon: FaLock },
    { id: "system", label: "System", icon: FaGlobe },
    { id: "appearance", label: "Appearance", icon: FaPalette },
    { id: "data", label: "Data", icon: FaDatabase }
  ];

  const handleSaveSettings = async (settingsType) => {
    setSaving(true);
    showInfo("Saving settings...");

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      showSuccess(`${settingsType} settings saved successfully!`);
    } catch (error) {
      showError("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-blue-800 mb-4">Profile Information</h3>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-blue-700 mb-2">Username</label>
          <input
            type="text"
            value={profileSettings.username}
            onChange={(e) => setProfileSettings({...profileSettings, username: e.target.value})}
            className="w-full px-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-700 mb-2">Email</label>
          <input
            type="email"
            value={profileSettings.email}
            onChange={(e) => setProfileSettings({...profileSettings, email: e.target.value})}
            className="w-full px-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-700 mb-2">Phone</label>
          <input
            type="tel"
            value={profileSettings.phone}
            onChange={(e) => setProfileSettings({...profileSettings, phone: e.target.value})}
            className="w-full px-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-700 mb-2">Address</label>
          <input
            type="text"
            value={profileSettings.address}
            onChange={(e) => setProfileSettings({...profileSettings, address: e.target.value})}
            className="w-full px-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-blue-700 mb-2">Bio</label>
        <textarea
          value={profileSettings.bio}
          onChange={(e) => setProfileSettings({...profileSettings, bio: e.target.value})}
          rows={4}
          className="w-full px-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Tell us about yourself..."
        />
      </div>

      <ButtonLoading
        onClick={() => handleSaveSettings("Profile")}
        loading={saving}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <FaSave /> Save Profile
      </ButtonLoading>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-blue-800 mb-4">Notification Preferences</h3>

      <div className="space-y-4">
        {Object.entries(notificationSettings).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
            <div>
              <h4 className="font-medium text-blue-800 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </h4>
              <p className="text-sm text-blue-600">
                {key === 'emailNotifications' && 'Receive notifications via email'}
                {key === 'pushNotifications' && 'Receive push notifications in browser'}
                {key === 'smsNotifications' && 'Receive SMS notifications'}
                {key === 'marketingEmails' && 'Receive marketing and promotional emails'}
                {key === 'orderUpdates' && 'Get notified about order status changes'}
                {key === 'stockAlerts' && 'Get alerts when stock is low'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => setNotificationSettings({...notificationSettings, [key]: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>

      <ButtonLoading
        onClick={() => handleSaveSettings("Notification")}
        loading={saving}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <FaSave /> Save Notifications
      </ButtonLoading>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfileSettings();
      case "notifications":
        return renderNotificationSettings();
      case "security":
        return (
          <div className="text-center py-12">
            <FaLock className="text-6xl text-blue-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-blue-800 mb-2">Security Settings</h3>
            <p className="text-blue-600">Advanced security features coming soon!</p>
          </div>
        );
      case "system":
        return (
          <div className="text-center py-12">
            <FaGlobe className="text-6xl text-blue-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-blue-800 mb-2">System Settings</h3>
            <p className="text-blue-600">System preferences coming soon!</p>
          </div>
        );
      case "appearance":
        return (
          <div className="text-center py-12">
            <FaPalette className="text-6xl text-blue-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-blue-800 mb-2">Appearance Settings</h3>
            <p className="text-blue-600">Theme and appearance customization coming soon!</p>
          </div>
        );
      case "data":
        return (
          <div className="text-center py-12">
            <FaDatabase className="text-6xl text-blue-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-blue-800 mb-2">Data Management</h3>
            <p className="text-blue-600">Data export and backup features coming soon!</p>
          </div>
        );
      default:
        return renderProfileSettings();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-blue-200">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-blue-600 mt-2">Manage your account preferences and system settings</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-4 border border-blue-200">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                        activeTab === tab.id
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                          : "text-blue-700 hover:bg-blue-50"
                      }`}
                    >
                      <Icon className="text-lg" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-200">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pengaturan;
