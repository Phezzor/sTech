import { useState, useEffect } from "react";
import Sidebar from "./Component/Sidebar";
import Topbar from "./Component/Topbar";
import ProdukCard from "./Component/Product";
import LoginForm from "./Component/LoginForm";
import Pengaturan from "./Component/Pengaturan";
import Dashboard from "./Component/Dashboard";

const kategoriList = ["Semua", "Minuman", "Es Krim"];

const dataProduk = [
  { nama: "Es Teh", stok: 10, gambar: "esteh.png", kategori: "Minuman" },
  { nama: "Kopi Hitam", stok: 8, gambar: "kopihitam.png", kategori: "Minuman" },
  { nama: "Es Krim Coklat", stok: 5, gambar: "eskrim.png", kategori: "Es Krim" },
];

function App() {
  const [produk, setProduk] = useState([]);
  const [kategori, setKategori] = useState("Semua");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [halamanAktif, setHalamanAktif] = useState("produk");
  const [totalTransaksi, setTotalTransaksi] =useState(15);

  useEffect(() => {
    const hasil =
      kategori === "Semua"
        ? dataProduk
        : dataProduk.filter((p) => p.kategori === kategori);
    setProduk(hasil);
  }, [kategori]);

  // Tangani logout dengan useEffect agar tidak infinite render
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
        return <Dashboard dataProduk={dataProduk} totalTransaksi={totalTransaksi}/>;
      case "produk":
        return (
          <div>
            <h2 className="text-sm font-semibold mb-2">Kategori</h2>
            <div className="flex gap-2 mb-4">
              {kategoriList.map((kat, idx) => (
                <button
                  key={idx}
                  className={`px-3 py-1 rounded text-sm transition ${
                    kategori === kat ? "bg-cyan-400 text-white" : "border bg-white"
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
                {produk.map((item, i) => (
                  <ProdukCard
                    key={i}
                    nama={item.nama}
                    stok={item.stok}
                    gambar={item.gambar || "https://via.placeholder.com/150"}
                    kategori={item.kategori}
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
          <div className="text-gray-700 text-lg">
            <p>Fitur bantuan masih dalam pengembangan.</p>
          </div>
        
        );
      default:
        return <p>Halaman tidak ditemukan</p>;
    }
  };

  return (
    <div className="flex">
      <Sidebar onNavigate={setHalamanAktif} halamanAktif={halamanAktif} />
      <div className="flex-1 min-h-screen bg-gray-100">
        <Topbar />
        <div className="p-4">{renderHalaman()}</div>
      </div>
    </div>
  );
}

export default App;
