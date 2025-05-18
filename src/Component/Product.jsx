function Product({ nama, stok, gambar }) {
    return (
      <div className="bg-white border p-2 rounded shadow w-32 text-center">
        <div className="w-full h-24 bg-gray-200 flex items-center justify-center">
          {gambar ? (
            <img src={`/${gambar}`} alt={nama} className="h-full w-full object-cover" />
          ) : (
            <span className="text-sm text-gray-500">Gambar</span>
          )}
        </div>
        <p className="text-xs mt-2 font-medium">{nama}</p>
        <p className="text-xs">STOK: {stok}</p>
      </div>
    );
  }
  
  export default Product;
  