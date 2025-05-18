import React from "react";
import { FaEnvelope, FaBell, FaCaretDown, FaSearch, FaBars } from "react-icons/fa";

function Topbar() {
  return (
    <div className="bg-sky-600 text-white flex flex-wrap items-center justify-between gap-3 p-3 shadow">
      
      <div className="flex items-center gap-3 flex-1 min-w-[200px] max-w-lg">
        
        <button className="p-2 bg-sky-700 rounded hover:bg-sky-800 flex-shrink-0">
          <FaBars size={20} />
        </button>

        <div className="flex w-full">
          <input
            type="text"
            placeholder="Cari barang disini.."
            className="rounded-l px-3 py-1 text-sky-800 w-full text-sm bg-sky-50 focus:outline-none"
          />
        
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
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
