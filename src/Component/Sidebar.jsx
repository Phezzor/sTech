import {
  FaThLarge,
  FaCube,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
} from "react-icons/fa";

function Sidebar({ onNavigate, halamanAktif, sidebarOpen, closeSidebar }) {
  const isActive = (page) =>
    halamanAktif === page
      ? "bg-sky-800"
      : "bg-sky-600 hover:bg-sky-800 cursor-pointer";

  return (
    <div
      className={`bg-sky-700 text-white w-64 min-h-screen flex flex-col justify-between fixed z-50 top-0 left-0 transform transition-transform duration-300 ease-in-out 
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative`}
    >
      {/* Logo */}
      <div>
        <div className="bg-sky-900 p-4 flex items-center justify-center">
          <img src="/logo.png" alt="STECH Logo" className="h-20" />
        </div>

        {/* Menu utama */}
        <div className="mt-4 px-4">
          <h2 className="text-lg font-semibold mb-4">Menu</h2>
          <div className="space-y-3">
            <div
              className={`p-2 rounded-lg flex items-center gap-2 ${isActive("dashboard")}`}
              onClick={() => {
                onNavigate("dashboard");
                closeSidebar?.();
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onNavigate("dashboard")}
            >
              <FaThLarge /> <span className="font-mono">Dashboard</span>
            </div>

            <div
              className={`p-2 rounded-lg flex items-center gap-2 ${isActive("produk")}`}
              onClick={() => {
                onNavigate("produk");
                closeSidebar?.();
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onNavigate("produk")}
            >
              <FaCube /> <span className="font-mono">Produk</span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu bawah */}
      <div className="mt-8 mb-4 px-4">
        <h2 className="text-lg font-semibold mb-4">Pengaturan</h2>
        <div className="space-y-3">
          <button
            onClick={() => {
              onNavigate("pengaturan");
              closeSidebar?.();
            }}
            className={`w-full text-sky-900 py-2 px-4 rounded-lg text-sm flex items-center gap-2 ${
              halamanAktif === "pengaturan"
                ? "bg-cyan-400"
                : "bg-white hover:bg-cyan-300"
            }`}
          >
            <FaCog /> <span>Pengaturan</span>
          </button>

          <button
            onClick={() => {
              onNavigate("help");
              closeSidebar?.();
            }}
            className={`w-full text-sky-900 py-2 px-4 rounded-lg text-sm flex items-center gap-2 ${
              halamanAktif === "help"
                ? "bg-cyan-400"
                : "bg-white hover:bg-cyan-300"
            }`}
          >
            <FaQuestionCircle /> <span>Bantuan</span>
          </button>

          <button
            onClick={() => onNavigate("logout")}
            className="w-full bg-red-200 text-red-700 py-2 px-4 rounded-lg text-sm flex items-center gap-2"
          >
            <FaSignOutAlt /> <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
