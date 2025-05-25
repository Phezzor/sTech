import React from "react";

function Help() {
  return (
    <div className="p-6">
      <div className="bg-white rounded shadow p-6 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-4">📘 Bantuan Penggunaan</h2>

        <div className="space-y-5 text-sm text-gray-700">
          <div>
            <h3 className="font-semibold text-blue-700">🛒 1. Menambah Produk Baru</h3>
            <p>
              Untuk menambahkan produk, buka menu <strong>Produk</strong>, lalu isi nama, stok, gambar, dan kategori.
              Setelah itu klik tombol <span className="text-white bg-blue-500 px-2 py-1 rounded text-xs">Tambah Produk</span>.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-blue-700">🏷️ 2. Menambah Kategori Baru</h3>
            <p>
              Jika kategori belum tersedia, kamu bisa langsung mengetik nama kategori baru di kolom kategori saat menambah produk.
              Sistem akan otomatis menyimpan kategori baru tersebut.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-blue-700">📦 3. Menambah Stok Produk</h3>
            <p>
              Di setiap kartu produk, klik tombol <span className="text-white bg-green-500 px-2 py-1 rounded text-xs">+ Tambah Stok</span>
              untuk menambah stok produk sebanyak 1 unit.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-blue-700">🔍 4. Mencari Produk</h3>
            <p>
              Gunakan kolom pencarian di atas untuk mencari produk berdasarkan nama. Hasil akan otomatis difilter saat kamu mengetik.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-blue-700">⚙️ 5. Pengaturan & Bantuan</h3>
            <p>
              Gunakan menu <strong>Pengaturan</strong> untuk mengubah informasi admin. Untuk informasi penggunaan, kunjungi halaman <strong>Bantuan</strong> ini.
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          Jika kamu mengalami kendala, silakan hubungi tim pengembang melalui email: <br />
          <span className="text-blue-600">admincoke@gmail.com</span>
        </div>
      </div>
    </div>
  );
}

export default Help;
