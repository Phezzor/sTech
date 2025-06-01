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
import TransactionDetailPage from "./Pages/TransactionDetailPage";
import AddTransactionPage from "./Pages/AddTransactionPage";
import EditTransactionPage from "./Pages/EditTransactionPage";
import SupplierPage from "./Pages/SupplierPage";
import AddSupplierPage from "./Pages/AddSupplierPage";
import EditSupplierPage from "./Pages/EditSupplierPage";
import { useToast } from "./Component/Toast";
import { FullPageLoading } from "./Component/Loading";
import PageTransition from "./Component/PageTransition";
import { ActivityProvider } from "./context/ActivityContext";

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

      // Try multiple possible endpoints for token validation
      const endpoints = [
        "https://stechno.up.railway.app/api/auth/me",
        "https://stechno.up.railway.app/api/user/me",
        "https://stechno.up.railway.app/api/profile",
        "https://stechno.up.railway.app/api/auth/profile"
      ];

      let validationSuccess = false;
      let userData = null;

      for (const endpoint of endpoints) {
        try {
          const res = await fetch(endpoint, {
            headers: { Authorization: `Bearer ${token}` },
          });

          console.log(`Token validation attempt at ${endpoint}: ${res.status}`);

          if (res.ok) {
            const data = await res.json();
            console.log("Token validation data:", data);

            userData = data.user || data.data || data;
            validationSuccess = true;
            break;
          }
        } catch (endpointError) {
          console.log(`Endpoint ${endpoint} failed:`, endpointError.message);
          continue;
        }
      }

      if (validationSuccess && userData) {
        setUserData(userData);
        setIsLoggedIn(true);

        const username = userData.username || userData.name || userData.email || 'User';
        showSuccess(`Welcome back, ${username}!`);
      } else {
        console.log("All token validation endpoints failed");
        // If token validation fails, we can still try to use the token
        // Some APIs might not have a validation endpoint but still work with valid tokens
        // We'll keep the token and let individual API calls handle authentication

        // Try to extract user info from the token itself (if it's a JWT)
        try {
          const tokenParts = token.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            console.log("Extracted user data from token:", payload);

            // Check if token is not expired
            if (payload.exp && payload.exp * 1000 > Date.now()) {
              const fallbackUserData = {
                id: payload.id || payload.sub || 'unknown',
                username: payload.username || payload.name || 'User',
                email: payload.email || '',
                role: payload.role || 'user'
              };

              setUserData(fallbackUserData);
              setIsLoggedIn(true);
              console.log("Using fallback user data from token");
              return;
            }
          }
        } catch (tokenError) {
          console.log("Could not extract user data from token:", tokenError.message);
        }

        // If all else fails, remove the token
        localStorage.removeItem("token");
        setIsLoggedIn(false);
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
      <ActivityProvider>
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

        {/* Product Detail Page */}
        <Route
          path="/products/:id"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Layout
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                onNavigate={(page) => setHalamanAktif(page)}
                halamanAktif="products"
                userData={userData}
              >
                <ProductIdPage userData={userData} />
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

        {/* Add Transaction Page */}
        <Route
          path="/transaksi/add"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Layout
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                onNavigate={(page) => setHalamanAktif(page)}
                halamanAktif="transaksi"
                userData={userData}
              >
                <AddTransactionPage userData={userData} />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Edit Transaction Page */}
        <Route
          path="/transaksi/edit/:id"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Layout
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                onNavigate={(page) => setHalamanAktif(page)}
                halamanAktif="transaksi"
                userData={userData}
              >
                <EditTransactionPage userData={userData} />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Transaction Detail Page */}
        <Route
          path="/transactions/:id"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Layout
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                onNavigate={(page) => setHalamanAktif(page)}
                halamanAktif="transaksi"
                userData={userData}
              >
                <TransactionDetailPage userData={userData} />
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

        {/* Add Supplier Page */}
        <Route
          path="/suppliers/add"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Layout
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                onNavigate={(page) => setHalamanAktif(page)}
                halamanAktif="supplier"
                userData={userData}
              >
                <AddSupplierPage userData={userData} />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Edit Supplier Page */}
        <Route
          path="/suppliers/edit/:id"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Layout
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                onNavigate={(page) => setHalamanAktif(page)}
                halamanAktif="supplier"
                userData={userData}
              >
                <EditSupplierPage userData={userData} />
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

      </ActivityProvider>
    </Router>
  );
}

export default App;
