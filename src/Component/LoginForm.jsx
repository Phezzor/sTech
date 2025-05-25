import React, { useState } from "react";

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("https://stechno.up.railway.app/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Login gagal. Coba lagi.");
      } else {
        // ✅ Simpan token ke localStorage
        if (data.token) {
          localStorage.setItem("token", data.token);
          console.log("Token disimpan ke localStorage:", data.token);
        } else {
          console.warn("Token tidak ditemukan di response:", data);
        }

        onLogin(data); // Opsional: callback untuk update parent state
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Terjadi kesalahan jaringan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      {/* Selamat Datang */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-2 animate-pulse">
          Selamat Datang di Sistem sTech!
        </h1>
        <p className="text-gray-700 text-lg max-w-md mx-auto">
          Kelola persediaan Anda dengan mudah dan efisien. Pastikan stok selalu terpantau agar bisnis berjalan lancar tanpa hambatan.
        </p>
      </div>

      {/* Form Login */}
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-2 text-sm sm:text-base">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@mail.com"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 mb-2 text-sm sm:text-base">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="******"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-2 rounded-lg transition-colors duration-300 ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
