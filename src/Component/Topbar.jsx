import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaCaretDown, FaBars, FaSearch, FaSignOutAlt } from "react-icons/fa";

function Topbar({ toggleSidebar, userData }) {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
    window.location.reload();
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white shadow-xl border-b border-blue-500/30">
      <div className="flex items-center justify-between p-4">

        {/* Kiri: Logo dan Search */}
        <div className="flex items-center gap-4 flex-1">
          <button
            className="p-2 bg-blue-800/50 rounded-xl hover:bg-blue-700/70 transition-all duration-200 md:hidden"
            onClick={toggleSidebar}
          >
            <FaBars size={18} />
          </button>

          <div className="hidden md:flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">ST</span>
            </div>
            <span className="font-bold text-lg">sTechno</span>
          </div>

          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products, transactions..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/20 transition-all duration-200"
            />
          </div>
        </div>

        {/* Kanan: User Menu */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button className="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 relative">
            <FaBell size={18} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl transition-all duration-200"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                {userData?.username ? userData.username.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium">{userData?.username || 'User'}</p>
                <p className="text-xs text-blue-200 capitalize">{userData?.role || 'Member'}</p>
              </div>
              <FaCaretDown className="text-blue-200" />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-medium text-gray-800">{userData?.username}</p>
                  <p className="text-sm text-gray-500">{userData?.email}</p>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-all duration-200"
                >
                  <FaSignOutAlt size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Topbar;
