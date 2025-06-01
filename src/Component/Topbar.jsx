import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaCaretDown, FaBars, FaSearch, FaSignOutAlt, FaTimes, FaBox, FaTruck, FaReceipt, FaEye } from "react-icons/fa";
import { useActivity } from "../context/ActivityContext";
import { getRelativeTime } from "../utils/activityLogger";

function Topbar({ toggleSidebar, userData }) {
  const navigate = useNavigate();
  const { recentActivities, unreadCount, markAsRead } = useActivity();

  // State management
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState({
    products: [],
    suppliers: [],
    transactions: [],
    loading: false
  });

  // Refs for click outside detection
  const searchRef = useRef(null);
  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);

  // Search functionality
  useEffect(() => {
    if (searchTerm.trim().length > 2) {
      performSearch(searchTerm);
    } else {
      setSearchResults({
        products: [],
        suppliers: [],
        transactions: [],
        loading: false
      });
      setShowSearchResults(false);
    }
  }, [searchTerm]);

  // Click outside detection
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = async (query) => {
    setSearchResults(prev => ({ ...prev, loading: true }));
    setShowSearchResults(true);

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // Search products, suppliers, and transactions in parallel
      const [productsRes, suppliersRes, transactionsRes] = await Promise.allSettled([
        fetch("https://stechno.up.railway.app/api/product", { headers }),
        fetch("https://stechno.up.railway.app/api/suppliers", { headers }),
        fetch("https://stechno.up.railway.app/api/transaksi", { headers })
      ]);

      const results = {
        products: [],
        suppliers: [],
        transactions: [],
        loading: false
      };

      // Process products
      if (productsRes.status === 'fulfilled' && productsRes.value.ok) {
        const products = await productsRes.value.json();
        results.products = Array.isArray(products)
          ? products.filter(p =>
              p.nama?.toLowerCase().includes(query.toLowerCase()) ||
              p.produk_kode?.toLowerCase().includes(query.toLowerCase()) ||
              p.deskripsi?.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 5)
          : [];
      }

      // Process suppliers
      if (suppliersRes.status === 'fulfilled' && suppliersRes.value.ok) {
        const suppliers = await suppliersRes.value.json();
        results.suppliers = Array.isArray(suppliers)
          ? suppliers.filter(s =>
              s.nama?.toLowerCase().includes(query.toLowerCase()) ||
              s.contact_info?.toLowerCase().includes(query.toLowerCase()) ||
              s.address?.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 5)
          : [];
      }

      // Process transactions
      if (transactionsRes.status === 'fulfilled' && transactionsRes.value.ok) {
        const transactions = await transactionsRes.value.json();
        results.transactions = Array.isArray(transactions)
          ? transactions.filter(t =>
              t.id?.toString().includes(query) ||
              t.description?.toLowerCase().includes(query.toLowerCase()) ||
              t.type?.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 5)
          : [];
      }

      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults({
        products: [],
        suppliers: [],
        transactions: [],
        loading: false
      });
    }
  };

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

          <div className="relative flex-1 max-w-md" ref={searchRef}>
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products, suppliers, transactions..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/20 transition-all duration-200"
            />

            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-96 overflow-y-auto z-50">
                {searchResults.loading ? (
                  <div className="p-4 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2">Searching...</p>
                  </div>
                ) : (
                  <div className="py-2">
                    {/* Products Section */}
                    {searchResults.products.length > 0 && (
                      <div className="px-4 py-2">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <FaBox className="text-blue-600" /> Products
                        </h4>
                        {searchResults.products.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => {
                              navigate(`/products/${product.id}`);
                              setShowSearchResults(false);
                              setSearchTerm("");
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded-lg transition-colors duration-200 flex items-center gap-3"
                          >
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <FaBox className="text-blue-600 text-sm" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">{product.nama}</p>
                              <p className="text-xs text-gray-500 truncate">{product.produk_kode}</p>
                            </div>
                            <FaEye className="text-gray-400 text-sm" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Suppliers Section */}
                    {searchResults.suppliers.length > 0 && (
                      <div className="px-4 py-2 border-t border-gray-100">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <FaTruck className="text-green-600" /> Suppliers
                        </h4>
                        {searchResults.suppliers.map((supplier) => (
                          <button
                            key={supplier.id}
                            onClick={() => {
                              navigate(`/supplier`); // Navigate to supplier page since detail page might not exist
                              setShowSearchResults(false);
                              setSearchTerm("");
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-green-50 rounded-lg transition-colors duration-200 flex items-center gap-3"
                          >
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                              <FaTruck className="text-green-600 text-sm" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">{supplier.nama}</p>
                              <p className="text-xs text-gray-500 truncate">{supplier.contact_info}</p>
                            </div>
                            <FaEye className="text-gray-400 text-sm" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Transactions Section */}
                    {searchResults.transactions.length > 0 && (
                      <div className="px-4 py-2 border-t border-gray-100">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <FaReceipt className="text-purple-600" /> Transactions
                        </h4>
                        {searchResults.transactions.map((transaction) => (
                          <button
                            key={transaction.id}
                            onClick={() => {
                              navigate(`/transactions/${transaction.id}`);
                              setShowSearchResults(false);
                              setSearchTerm("");
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-purple-50 rounded-lg transition-colors duration-200 flex items-center gap-3"
                          >
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                              <FaReceipt className="text-purple-600 text-sm" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">Transaction {transaction.id}</p>
                              <p className="text-xs text-gray-500 truncate">{transaction.type} - {transaction.description}</p>
                            </div>
                            <FaEye className="text-gray-400 text-sm" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* No Results */}
                    {searchResults.products.length === 0 &&
                     searchResults.suppliers.length === 0 &&
                     searchResults.transactions.length === 0 && (
                      <div className="px-4 py-8 text-center text-gray-500">
                        <FaSearch className="mx-auto text-2xl mb-2 text-gray-300" />
                        <p>No results found for "{searchTerm}"</p>
                        <p className="text-xs mt-1">Try searching with different keywords</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Kanan: User Menu */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications) markAsRead();
              }}
              className="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 relative"
            >
              <FaBell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-96 overflow-hidden z-50">
                <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-blue-100">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <FaBell className="text-blue-600" />
                    Recent Activities
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">Your latest actions and updates</p>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {recentActivities.length > 0 ? (
                    <div className="py-2">
                      {recentActivities.map((activity) => (
                        <div
                          key={activity.id}
                          className="px-4 py-3 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-50 last:border-b-0"
                        >
                          <div className="flex items-start gap-3">
                            <div className="text-lg mt-0.5">
                              {activity.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 leading-relaxed">
                                {activity.message}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-500">
                                  {activity.time}
                                </span>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-gray-500">
                                  {getRelativeTime(activity.timestamp)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-8 text-center text-gray-500">
                      <FaBell className="mx-auto text-2xl mb-2 text-gray-300" />
                      <p>No recent activities</p>
                      <p className="text-xs mt-1">Your actions will appear here</p>
                    </div>
                  )}
                </div>

                {recentActivities.length > 0 && (
                  <div className="p-3 border-t border-gray-100 bg-gray-50">
                    <button
                      onClick={() => {
                        // Navigate to full activity log page (if exists)
                        setShowNotifications(false);
                      }}
                      className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                    >
                      View All Activities
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
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
