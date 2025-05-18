import React from "react";

const Pengaturan = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-blue-800">Pengaturan Akun</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informasi Akun */}
        <div className="bg-white rounded-xl shadow-md p-5">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Informasi Akun</h3>
          <div className="space-y-2">
            <div>
              <label className="text-sm text-gray-600">Nama</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                value="Admin 1"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded-md"
                value="admincoke@gmail.com"
              />
            </div>
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Simpan Perubahan
            </button>
          </div>
        </div>

        {/* Ubah Password */}
        <div className="bg-white rounded-xl shadow-md p-5">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Ubah Password</h3>
          <div className="space-y-2">
            <div>
              <label className="text-sm text-gray-600">Password Lama</label>
              <input
                type="password"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="********"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Password Baru</label>
              <input
                type="password"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="********"
              />
            </div>
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pengaturan;
