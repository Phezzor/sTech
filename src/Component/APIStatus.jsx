import { useState, useEffect } from "react";
import { fetchCategoryTH01 } from "../utils/productApi";

const APIStatus = () => {
  const [apiStatus, setApiStatus] = useState({
    loading: true,
    lastTest: null,
    error: null,
    data: null
  });

  const runTest = async () => {
    setApiStatus({
      loading: true,
      lastTest: new Date().toLocaleString(),
      error: null,
      data: null
    });

    try {
      const result = await fetchCategoryTH01();
      setApiStatus({
        loading: false,
        lastTest: new Date().toLocaleString(),
        error: null,
        data: {
          success: true,
          count: result.products.length,
          category: result.category,
          dataType: typeof result,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      setApiStatus({
        loading: false,
        lastTest: new Date().toLocaleString(),
        error: error.message,
        data: null
      });
    }
  };

  // Jalankan test saat komponen dimuat
  useEffect(() => {
    runTest();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Status API Kategori TH01</h3>
        <button
          onClick={runTest}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          Test API
        </button>
      </div>

      {apiStatus.loading ? (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Menguji koneksi API...</span>
        </div>
      ) : apiStatus.error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Koneksi API gagal: {apiStatus.error}
              </p>
              <p className="text-xs text-red-500 mt-1">
                Terakhir diuji: {apiStatus.lastTest}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                Koneksi API berhasil! Ditemukan {apiStatus.data.count} produk dalam kategori TH01.
              </p>
              <p className="text-xs text-green-500 mt-1">
                Terakhir diuji: {apiStatus.lastTest}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default APIStatus;


