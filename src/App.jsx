import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Navigate
} from "react-router-dom";

import Sidebar from "./Component/Sidebar";
import Topbar from "./Component/Topbar";
import LoginForm from "./Component/LoginForm";
import Pengaturan from "./Component/Pengaturan";
import Dashboard from "./Component/Dashboard";
import Help from "./Component/Help";
import ProductPage from "./Pages/ProductPage";
import ProductIdPage from "./Pages/ProductIdPage";
import AddProductPage from "./Pages/AddProductPage";
import EditProductPage from "./Pages/EditProductPage";
import ProfilePage from "./Pages/ProfilePage";
import TransactionPage from "./Pages/TransactionPage";
import SupplierPage from "./Pages/SupplierPage";
import { useToast } from "./Component/Toast";
import { FullPageLoading } from "./Component/Loading";
import PageTransition from "./Component/PageTransition";

// Komponen route yang dilindungi
function ProtectedRoute({ isLoggedIn, children }) {
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

// Layout dengan Sidebar dan Topbar
function Layout({ children, sidebarOpen, setSidebarOpen, onNavigate, halamanAktif, userData }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
      <Sidebar
        onNavigate={onNavigate}
        halamanAktif={halamanAktif}
        sidebarOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
        userData={userData}
      />
      <div className="flex flex-col flex-1 w-full max-w-full overflow-hidden">
        <Topbar
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          userData={userData}
        />
        <main className="flex-1 overflow-y-auto w-full max-w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [halamanAktif, setHalamanAktif] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { ToastContainer, showSuccess, showError, showInfo } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      validateToken(token);
    } else {
      setIsLoggedIn(false);
      setIsLoading(false);
    }
  }, []);

  const validateToken = async (token) => {
    try {
      setIsLoading(true);
      console.log("Validating token:", token);

      const res = await fetch("https://stechno.up.railway.app/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Token validation response status:", res.status);

      if (res.ok) {
        const data = await res.json();
        console.log("Token validation data:", data);

        const user = data.user || data.data || data;
        setUserData(user);
        setIsLoggedIn(true);

        const username = user.username || user.name || user.email || 'User';
        showSuccess(`Welcome back, ${username}!`);
      } else {
        console.log("Token validation failed, removing token");
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        // Don't show error on initial load if token is just expired
        if (res.status !== 401) {
          showError("Session expired. Please login again.");
        }
      }
    } catch (err) {
      console.error("Error validating token:", err);
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      // Don't show error on initial load for network issues
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading screen during initial load
  if (isLoading) {
    return <FullPageLoading message="Loading sTechno..." type="spinner" />;
  }

  return (
    <Router>
      <ToastContainer />

      {error && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-100 p-4 text-red-700 text-center">
          <p>{error}</p>
          <button onClick={() => setError(null)} className="ml-2 text-sm underline">
            Tutup
          </button>
        </div>
      )}

      <PageTransition>
        <Routes>
        {/* Default redirect */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Layout
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                onNavigate={(page) => setHalamanAktif(page)}
                halamanAktif={halamanAktif}
                userData={userData}
              >
                <Dashboard userData={userData} />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Login Page */}
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/" replace />
            ) : (
              <LoginForm
                onLogin={(data) => {
                  console.log("Login callback received data:", data);
                  const user = data.user || data.data || data;
                  setUserData(user);
                  setIsLoggedIn(true);
                  console.log("State updated - isLoggedIn:", true, "userData:", user);
                }}
              />
            )
          }
        />

        {/* Dashboard Page */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Layout
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                onNavigate={(page) => setHalamanAktif(page)}
                halamanAktif="dashboard"
                userData={userData}
              >
                <Dashboard userData={userData} />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Product Page */}
        <Route
          path="/products"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Layout
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                onNavigate={(page) => setHalamanAktif(page)}
                halamanAktif="products"
                userData={userData}
              >
                <ProductPage userData={userData} />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Add Product Page */}
        <Route
          path="/products/add"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Layout
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                onNavigate={(page) => setHalamanAktif(page)}
                halamanAktif="products"
                userData={userData}
              >
                <AddProductPage userData={userData} />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Edit Product Page */}
        <Route
          path="/products/edit/:id"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Layout
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                onNavigate={(page) => setHalamanAktif(page)}
                halamanAktif="products"
                userData={userData}
              >
                <EditProductPage userData={userData} />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Detail Produk berdasarkan ID */}
        <Route
          path="/produk/:id"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Layout
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                onNavigate={(page) => setHalamanAktif(page)}
                halamanAktif="produk"
                userData={userData}
              >
                <ProductIdPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Add Product Page */}
        <Route
          path="/tambah-produk"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Layout
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                onNavigate={(page) => setHalamanAktif(page)}
                halamanAktif={"produk"}
                userData={userData}
              >
                <AddProductPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Edit Product Page */}
        <Route
          path="/edit-produk/:id"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Layout
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                onNavigate={(page) => setHalamanAktif(page)}
                halamanAktif="produk"
                userData={userData}
              >
                <EditProductPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Profile Page */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Layout
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                onNavigate={(page) => setHalamanAktif(page)}
                halamanAktif="profile"
                userData={userData}
              >
                <ProfilePage userData={userData} />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Transaction Page */}
        <Route
          path="/transaksi"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Layout
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                onNavigate={(page) => setHalamanAktif(page)}
                halamanAktif="transaksi"
                userData={userData}
              >
                <TransactionPage userData={userData} />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Supplier Page */}
        <Route
          path="/supplier"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Layout
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                onNavigate={(page) => setHalamanAktif(page)}
                halamanAktif="supplier"
                userData={userData}
              >
                <SupplierPage userData={userData} />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Settings Page */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Layout
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                onNavigate={(page) => setHalamanAktif(page)}
                halamanAktif="settings"
                userData={userData}
              >
                <Pengaturan userData={userData} />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Help Page */}
        <Route
          path="/help"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Layout
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                onNavigate={(page) => setHalamanAktif(page)}
                halamanAktif="help"
                userData={userData}
              >
                <Help />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<p>Halaman tidak ditemukan</p>} />
        </Routes>
      </PageTransition>

          
    </Router>
  );
}

export default App;
