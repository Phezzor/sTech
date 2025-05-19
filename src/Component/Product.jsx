import React from "react";

function Product({ nama, stok, gambar, kategori, onTambahStok }) {
  return (
    <div className="bg-white border p-2 rounded shadow w-36 text-center">
      <div className="w-full h-24 bg-gray-200 flex items-center justify-center">
        {gambar ? (
          <img
            src={`/${gambar}`}
            alt={nama}
            className="h-full w-full object-cover"
            onError={(e) => (e.target.style.display = "none")}
          />
        ) : (
          <span className="text-sm text-gray-500">Gambar</span>
        )}
      </div>
      <p className="text-xs mt-2 font-semibold">{nama}</p>
      <p className="text-xs text-gray-600 italic">{kategori}</p>
      <p className="text-xs">STOK: {stok}</p>
      <button
        className="mt-1 bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
        onClick={onTambahStok}
      >
        + Tambah Stok
      </button>
    </div>
  );
}

export default Product;
