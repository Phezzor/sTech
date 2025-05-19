import React from "react";
import { FaEnvelope, FaBell, FaCaretDown, FaBars } from "react-icons/fa";

function Topbar({ toggleSidebar }) {
  return (
    <div className="bg-sky-600 text-white flex flex-wrap items-center justify-between p-3 shadow gap-y-2">
      
      {/* Kiri: Tombol dan Pencarian */}
      <div className="flex items-center gap-3 flex-1 min-w-[200px] max-w-full sm:max-w-md">
        
        <button
          className="p-2 bg-sky-700 rounded hover:bg-sky-800"
          onClick={toggleSidebar}
        >
          <FaBars size={20} />
        </button>

        <input
          type="text"
          placeholder="Cari barang disini.."
          className="rounded-l px-3 py-2 text-sky-800 w-full text-sm bg-sky-50 focus:outline-none"
        />
      </div>

      {/* Kanan: Icon dan user */}
      <div className="flex items-center gap-3 mt-2 sm:mt-0">
        <button className="text-white hover:text-sky-200">
          <FaEnvelope size={18} />
        </button>
        <button className="text-white hover:text-sky-200">
          <FaBell size={18} />
        </button>

        <div className="flex items-center gap-2 bg-white text-sky-800 px-2 py-1 rounded">
          <div className="hidden sm:block text-right leading-tight">
            <p className="text-xs font-bold">Admin 1</p>
            <p className="text-[10px]">admincoke@gmail.com</p>
          </div>
          <FaCaretDown className="text-sky-800" />
        </div>
      </div>
    </div>
  );
}

export default Topbar;
