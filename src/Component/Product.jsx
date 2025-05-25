import React from "react";

function Product({ nama, stok, kategori, harga, deskripsi, supplier, onTambahStok, id, onSelectProduct }) {
  // Pastikan kategori selalu ditampilkan dengan benar
  const displayKategori = kategori === "TH01" ? "Minuman" : kategori;
  
  return (
    <div 
      className="border rounded shadow p-4 w-72 mb-4 mr-4 bg-white hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onSelectProduct && onSelectProduct(id)}
    >
      <h4 className="text-lg font-semibold">{nama}</h4>
      <p className="text-sm text-gray-600">Kategori: {displayKategori}</p>
      <p className="text-sm">
        Stok: <span className={stok <= 5 ? "text-red-500 font-bold" : ""}>{stok}</span>
      </p>
      <p className="text-sm">Harga: Rp {parseInt(harga).toLocaleString()}</p>
      {deskripsi && <p className="text-sm text-gray-600 mt-2 line-clamp-2">{deskripsi}</p>}
      <p className="text-sm text-gray-500 mt-1">Supplier: {supplier}</p>
      {onTambahStok && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onTambahStok(id);
          }}
          className="mt-2 px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
        >
          + Tambah Stok
        </button>
      )}
    </div>
  );
}


export default Product;
