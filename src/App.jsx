import { useState, useEffect } from "react";
import Sidebar from "./Component/Sidebar";
import Topbar from "./Component/Topbar";
import ProdukCard from "./Component/Product";
import LoginForm from "./Component/LoginForm";
import Pengaturan from "./Component/Pengaturan";
import Dashboard from "./Component/Dashboard";

const kategoriList = ["Semua", "Minuman", "Es Krim"];

const dataProduk = [
  { id: 1, nama: "Es Teh", stok: 10, gambar: "esteh.png", kategori: "Minuman" },
  { id: 2, nama: "Kopi Hitam", stok: 8, gambar: "kopihitam.png", kategori: "Minuman" },
  { id: 3, nama: "Es Krim Coklat", stok: 5, gambar: "eskrim.png", kategori: "Es Krim" },
];

function App() {
  const [produk, setProduk] = useState(dataProduk);
  const [kategori, setKategori] = useState("Semua");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [halamanAktif, setHalamanAktif] = useState("produk");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [totalTransaksi, setTotalTransaksi] = useState(15);

  useEffect(() => {
    if (kategori === "Semua") {
      setProduk(dataProduk);
    } else {
      setProduk(dataProduk.filter((p) => p.kategori === kategori));
    }
  }, [kategori]);

  useEffect(() => {
    if (halamanAktif === "logout") {
      setIsLoggedIn(false);
      setHalamanAktif("produk");
    }
  }, [halamanAktif]);

  if (!isLoggedIn) {
    return <LoginForm onLogin={() => setIsLoggedIn(true)} />;
  }

  const renderHalaman = () => {
    switch (halamanAktif) {
      case "dashboard":
        return <Dashboard dataProduk={dataProduk} totalTransaksi={totalTransaksi} />;
      case "produk":
        return (
          <div className="w-full max-w-7xl mx-auto">
            <h2 className="text-sm font-semibold mb-2">Kategori</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {kategoriList.map((kat) => (
                <button
                  key={kat}
                  className={`px-3 py-1 rounded text-sm transition-colors duration-300 ${
                    kategori === kat
                      ? "bg-cyan-500 text-white"
                      : "border border-gray-300 bg-white hover:bg-cyan-100"
                  }`}
                  onClick={() => setKategori(kat)}
                >
                  {kat}
                </button>
              ))}
              
            </div>

            <h3 className="text-md font-semibold mb-3">Produk {kategori}</h3>
            {produk.length > 0 ? (
              <div className="flex flex-wrap gap-4">
                {produk.map(({ id, nama, stok, gambar, kategori }) => (
                  <ProdukCard
                    key={id}
                    nama={nama}
                    stok={stok}
                    gambar={gambar || "https://via.placeholder.com/150"}
                    kategori={kategori}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Tidak ada produk dalam kategori ini.</p>
            )}

            

            
          </div>
        );
      case "pengaturan":
        return <Pengaturan />;
      case "bantuan":
        return (
          <div className="bg-white p-4 rounded shadow max-w-3xl mx-auto">
            <h2 className="text-lg font-semibold mb-3">Bantuan</h2>
            <p className="text-gray-700">Fitur bantuan masih dalam pengembangan.</p>
          </div>
        );
      default:
        return <p>Halaman tidak ditemukan</p>;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        onNavigate={(page) => {
          setHalamanAktif(page);
          setSidebarOpen(false);
        }}
        halamanAktif={halamanAktif}
        sidebarOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 w-full max-w-full overflow-hidden">
        <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Content */}
        <main className="flex-1 p-4 overflow-y-auto w-full max-w-full">
          {renderHalaman()}
        </main>
      </div>
    </div>
  );
}

export default App;
