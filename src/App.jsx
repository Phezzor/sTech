import { useState, useEffect } from "react";
import Sidebar from "./Component/Sidebar";
import Topbar from "./Component/Topbar";
import LoginForm from "./Component/LoginForm";
import Pengaturan from "./Component/Pengaturan";
import Dashboard from "./Component/Dashboard";
import Help from "./Component/Help";
import ProductPage from "./Pages/ProductPage";
import ProductDetailPage from "./Pages/ProductDetailPage";

// Dummy data untuk dashboard
const dataProduk = [
  { nama: "Produk A", kategori: "Elektronik", stok: 10 },
  { nama: "Produk B", kategori: "Pakaian", stok: 3 },
  { nama: "Produk C", kategori: "Makanan", stok: 8 },
];

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [halamanAktif, setHalamanAktif] = useState("produk");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [totalTransaksi] = useState(15);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [error, setError] = useState(null);

  // Cek token saat aplikasi dimuat
  useEffect(() => {
    // Hapus token yang ada untuk memastikan user selalu login dulu
    localStorage.removeItem("token");
    console.log("Token dihapus, user perlu login");
    setIsLoggedIn(false);
  }, []);

  useEffect(() => {
    if (halamanAktif === "logout") {
      // Hapus token saat logout
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setHalamanAktif("produk");
    }
  }, [halamanAktif]);

  // Error boundary untuk komponen
  const renderWithErrorHandling = (component) => {
    try {
      return component;
    } catch (err) {
      console.error("Error rendering component:", err);
      return (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <h3 className="font-bold">Error:</h3>
          <p>{err.message}</p>
        </div>
      );
    }
  };

  if (!isLoggedIn) {
    return renderWithErrorHandling(
      <LoginForm 
        onLogin={(userData) => {
          console.log("Login berhasil, data user:", userData);
          setIsLoggedIn(true);
        }} 
      />
    );
  }

  const renderHalaman = () => {
    try {
      switch (halamanAktif) {
        case "dashboard":
          return <Dashboard dataProduk={dataProduk} totalTransaksi={totalTransaksi} />;
        case "produk":
          return selectedProductId ? (
            <ProductDetailPage 
              productId={selectedProductId} 
              onBack={() => setSelectedProductId(null)}
            />
          ) : (
            <ProductPage onSelectProduct={(id) => setSelectedProductId(id)} />
          );
        case "pengaturan":
          return <Pengaturan />;
        case "help":
          return <Help />;
        default:
          return <p>Halaman tidak ditemukan</p>;
      }
    } catch (err) {
      console.error("Error rendering page:", err);
      setError(err.message);
      return (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <h3 className="font-bold">Error:</h3>
          <p>{err.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Muat Ulang
          </button>
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
      {error && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-100 p-4 text-red-700 text-center">
          <p>{error}</p>
          <button 
            onClick={() => setError(null)}
            className="ml-2 text-sm underline"
          >
            Tutup
          </button>
        </div>
      )}
      
      <Sidebar
        onNavigate={(page) => {
          setHalamanAktif(page);
          setSelectedProductId(null);
          setSidebarOpen(false);
        }}
        halamanAktif={halamanAktif}
        sidebarOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
      />
      <div className="flex flex-col flex-1 w-full max-w-full overflow-hidden">
        <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 overflow-y-auto w-full max-w-full">
          {renderHalaman()}
        </main>
      </div>
    </div>
  );
}

export default App;
