import { getAuthToken, createAuthHeaders } from './productApi';

/**
 * Fungsi untuk menguji API kategori TH01
 * @param {string} token - Token autentikasi
 * @returns {Promise<Object>} Hasil test
 */
export const testCategoryTH01API = async (token = getAuthToken()) => {
  if (!token) {
    return {
      success: false,
      error: 'Token tidak ditemukan. Silakan login terlebih dahulu.',
      timestamp: new Date().toISOString()
    };
  }

  try {
    const response = await fetch('https://stechno.up.railway.app/api/product/category/TH01', {
      method: 'GET',
      headers: createAuthHeaders(token)
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Error ${response.status}: ${response.statusText}`,
        status: response.status,
        timestamp: new Date().toISOString()
      };
    }

    const data = await response.json();
    
    // Periksa format data
    let dataType = "unknown";
    let productsCount = 0;
    
    if (Array.isArray(data)) {
      dataType = "array";
      productsCount = data.length;
    } else if (data && typeof data === 'object') {
      dataType = "object";
      if (data.products && Array.isArray(data.products)) {
        productsCount = data.products.length;
      }
    }
    
    return {
      success: true,
      status: response.status,
      dataType: dataType,
      count: productsCount,
      data: data,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Fungsi untuk menjalankan semua test API
 * @param {string} token - Token autentikasi
 * @returns {Promise<Object>} Hasil semua test
 */
export const runAllAPITests = async (token = getAuthToken()) => {
  if (!token) {
    return {
      allPassed: false,
      error: 'Token tidak ditemukan. Silakan login terlebih dahulu.',
      timestamp: new Date().toISOString(),
      tests: []
    };
  }

  const tests = [
    { name: 'Kategori TH01', fn: testCategoryTH01API },
    { name: 'Semua Produk', fn: testAllProductsAPI },
    { name: 'Autentikasi', fn: testAuthAPI }
  ];

  const results = [];
  let allPassed = true;

  for (const test of tests) {
    try {
      const result = await test.fn(token);
      results.push({
        name: test.name,
        success: result.success,
        details: result
      });

      if (!result.success) {
        allPassed = false;
      }
    } catch (error) {
      results.push({
        name: test.name,
        success: false,
        error: error.message
      });
      allPassed = false;
    }
  }

  return {
    allPassed,
    timestamp: new Date().toISOString(),
    tests: results
  };
};


