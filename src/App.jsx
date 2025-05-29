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

// Komponen route yang dilindungi
function ProtectedRoute({ isLoggedIn, children }) {
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

// Layout dengan Sidebar dan Topbar
function Layout({ children, sidebarOpen, setSidebarOpen, onNavigate, halamanAktif, userData }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
      <Sidebar
        onNavigate={onNavigate}
        halamanAktif={halamanAktif}
        sidebarOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
        userData={userData}
      />
      <div className="flex flex-col flex-1 w-full max-w-full overflow-hidden">
        <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} userData={userData} />
        <main className="flex-1 p-4 overflow-y-auto w-full max-w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [halamanAktif, setHalamanAktif] = useState("produk");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) validateToken(token);
    else setIsLoggedIn(false);
  }, []);

  const validateToken = async (token) => {
    try {
      const res = await fetch("https://stechno.up.railway.app/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setUserData(data);
        setIsLoggedIn(true);
      } else {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
      }
    } catch (err) {
      console.error("Error validasi token:", err);
      localStorage.removeItem("token");
      setIsLoggedIn(false);
    }
  };

  return (
    <Router>
      {error && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-100 p-4 text-red-700 text-center">
          <p>{error}</p>
          <button onClick={() => setError(null)} className="ml-2 text-sm underline">
            Tutup
          </button>
        </div>
      )}

      <Routes>
        {/* Login Page */}
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/" replace />
            ) : (
              <LoginForm
                onLogin={(data) => {
                  setUserData(data);
                  setIsLoggedIn(true);
                }}
              />
            )
          }
        />

        {/* Halaman Utama */}
        <Route
          path="/"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Layout
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                onNavigate={(page) => setHalamanAktif(page)}
                halamanAktif={halamanAktif}
                userData={userData}
              >
                {halamanAktif === "dashboard" && <Dashboard userData={userData} />}
                {halamanAktif === "produk" && <ProductPage />}
                {halamanAktif === "pengaturan" && <Pengaturan userData={userData} />}
                {halamanAktif === "help" && <Help />}
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

        {/* Fallback */}
        <Route path="*" element={<p>Halaman tidak ditemukan</p>} />
      </Routes>
    </Router>
  );
}

export default App;
