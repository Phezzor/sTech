import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaThLarge,
  FaCube,
  FaExchangeAlt,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
  FaUser,
  FaTruck
} from "react-icons/fa";

function Sidebar({ onNavigate, halamanAktif, sidebarOpen, closeSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (page) =>
    halamanAktif === page
      ? "bg-blue-600/50 backdrop-blur-sm border-l-4 border-blue-300 shadow-lg"
      : "bg-blue-800/20 hover:bg-blue-600/30 cursor-pointer transition-all duration-200 hover:shadow-md";

  const handleNavigation = (page, route) => {
    onNavigate(page);
    if (route) {
      navigate(route);
    }
    closeSidebar?.();
  };

  return (
    <div
      className={`bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 text-white w-64 min-h-screen flex flex-col justify-between fixed z-50 top-0 left-0 transform transition-transform duration-300 ease-in-out shadow-2xl
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative`}
    >
      {/* Logo */}
      <div>
        <div className="bg-blue-800/30 backdrop-blur-sm p-6 flex items-center justify-center border-b border-blue-600/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">ST</span>
            </div>
            <span className="text-xl font-bold">sTechno</span>
          </div>
        </div>

        {/* Menu utama */}
        <div className="mt-6 px-4">
          <h2 className="text-sm font-bold mb-6 text-blue-200 uppercase tracking-wider">Main Menu</h2>
          <div className="space-y-2">
            <div
              className={`p-3 rounded-xl flex items-center gap-3 ${isActive("dashboard")}`}
              onClick={() => handleNavigation("dashboard", "/")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleNavigation("dashboard", "/")}
            >
              <FaThLarge className="text-lg" /> <span className="font-medium">Dashboard</span>
            </div>

            <div
              className={`p-3 rounded-xl flex items-center gap-3 ${isActive("profile")}`}
              onClick={() => handleNavigation("profile", "/profile")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleNavigation("profile", "/profile")}
            >
              <FaUser className="text-lg" /> <span className="font-medium">Profile</span>
            </div>

            <div
              className={`p-3 rounded-xl flex items-center gap-3 ${isActive("products")}`}
              onClick={() => handleNavigation("products", "/products")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleNavigation("products", "/products")}
            >
              <FaCube className="text-lg" /> <span className="font-medium">Products</span>
            </div>

            <div
              className={`p-3 rounded-xl flex items-center gap-3 ${isActive("transaksi")}`}
              onClick={() => handleNavigation("transaksi", "/transaksi")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleNavigation("transaksi", "/transaksi")}
            >
              <FaExchangeAlt className="text-lg" /> <span className="font-medium">Transactions</span>
            </div>

            <div
              className={`p-3 rounded-xl flex items-center gap-3 ${isActive("supplier")}`}
              onClick={() => handleNavigation("supplier", "/supplier")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleNavigation("supplier", "/supplier")}
            >
              <FaTruck className="text-lg" /> <span className="font-medium">Suppliers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu bawah */}
      <div className="mt-8 mb-6 px-4">
        <h2 className="text-sm font-bold mb-4 text-blue-200 uppercase tracking-wider">Settings</h2>
        <div className="space-y-2">
          <button
            onClick={() => {
              handleNavigation("settings", "/settings");
            }}
            className={`w-full py-3 px-4 rounded-xl text-sm flex items-center gap-3 transition-all duration-200 ${
              halamanAktif === "settings"
                ? "bg-blue-600/50 backdrop-blur-sm border-l-4 border-blue-300 shadow-lg"
                : "bg-blue-800/20 hover:bg-blue-600/30 text-white/90 hover:text-white"
            }`}
          >
            <FaCog className="text-lg" /> <span className="font-medium">Settings</span>
          </button>

          <button
            onClick={() => {
              handleNavigation("help", "/help");
            }}
            className={`w-full py-3 px-4 rounded-xl text-sm flex items-center gap-3 transition-all duration-200 ${
              halamanAktif === "help"
                ? "bg-blue-600/50 backdrop-blur-sm border-l-4 border-blue-300 shadow-lg"
                : "bg-blue-800/20 hover:bg-blue-600/30 text-white/90 hover:text-white"
            }`}
          >
            <FaQuestionCircle className="text-lg" /> <span className="font-medium">Help</span>
          </button>

          <button
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/login', { replace: true });
              window.location.reload();
            }}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-4 rounded-xl text-sm flex items-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <FaSignOutAlt className="text-lg" /> <span className="font-medium">Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
