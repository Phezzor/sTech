import React from "react";
import EditProductButton from "./EditProductButton";

function ProductDetail({ product, onBack }) {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-sky-600 text-white p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="px-4 py-2 bg-white text-sky-600 rounded-lg hover:bg-sky-100 transition-colors flex items-center gap-2"
            >
              ← Kembali
            </button>
            <h2 className="text-2xl font-bold">Detail Produk</h2>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-sky-50 p-4 rounded-lg">
              <h3 className="text-xl font-bold text-sky-800 mb-2">{product.nama}</h3>
              <p className="text-sm text-gray-500">Kode: <span className="font-mono font-medium">{product.produk_kode}</span></p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">Deskripsi</h4>
              <p className="text-gray-600">{product.deskripsi || "Tidak ada deskripsi"}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="text-sm text-green-800">Harga</h4>
                <p className="text-xl font-bold text-green-700">Rp {parseInt(product.harga).toLocaleString()}</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm text-blue-800">Stok</h4>
                <p className="text-xl font-bold text-blue-700">{product.stock}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Kategori:</span>
                <span className="font-medium">{product.category_nama}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Supplier:</span>
                <span className="font-medium">{product.supplier_nama}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dibuat:</span>
                <span className="font-medium">{new Date(product.created_at).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Diperbarui:</span>
                <span className="font-medium">{new Date(product.updated_at).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end p-4 mt-4">
        <EditProductButton productId={product.id} className="mr-2" />
        <button
          onClick={onBack}
          className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
        >
          Kembali
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;


