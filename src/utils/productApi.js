// Fungsi helper untuk mendapatkan token
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Fungsi helper untuk membuat header dengan token
const createAuthHeaders = (token) => {
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

/**
 * Fungsi untuk mengambil data kategori TH01 (Minuman)
 */
export const fetchCategoryTH01 = async () => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error("Token tidak ditemukan. Silakan login kembali.");
  }

  try {
    console.log("Memulai fetch kategori TH01...");
    
    const response = await fetch('https://stechno.up.railway.app/api/product/category/TH01', {
      method: 'GET',
      headers: createAuthHeaders(token),
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        console.warn("Kategori TH01 tidak ditemukan");
        return { 
          category: { id: "TH01", nama: "Minuman" },
          products: []
        };
      }
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Data mentah kategori TH01:", data);
    
    // Periksa format data
    if (Array.isArray(data)) {
      // Jika data adalah array produk langsung
      return {
        category: { id: "TH01", nama: "Minuman" },
        products: data
      };
    } else if (data && typeof data === 'object') {
      // Jika data adalah objek kategori
      if (data.id === "TH01" || data.id) {
        const category = {
          id: data.id || "TH01",
          nama: data.nama || "Minuman"
        };
        
        // Cek apakah ada property products
        if (data.products && Array.isArray(data.products)) {
          return {
            category,
            products: data.products
          };
        } else {
          return {
            category,
            products: []
          };
        }
      } else if (data.products && Array.isArray(data.products)) {
        // Jika data adalah objek dengan property products
        return {
          category: { id: "TH01", nama: "Minuman" },
          products: data.products
        };
      }
    }
    
    // Fallback jika format tidak sesuai ekspektasi
    console.warn("Format data kategori TH01 tidak sesuai ekspektasi:", data);
    return {
      category: { id: "TH01", nama: "Minuman" },
      products: []
    };
  } catch (error) {
    console.error('Error fetching category TH01:', error);
    throw error;
  }
};

/**
 * Fungsi untuk mengambil kategori berdasarkan ID
 */
export const fetchCategoryById = async (categoryId) => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error("Token tidak ditemukan. Silakan login kembali.");
  }

  try {
    console.log(`Mengambil data kategori dengan ID: ${categoryId}`);
    
    const response = await fetch(`https://stechno.up.railway.app/api/product/category/${categoryId}`, {
      method: 'GET',
      headers: createAuthHeaders(token),
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Kategori dengan ID ${categoryId} tidak ditemukan`);
      }
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Data kategori ${categoryId}:`, data);
    
    // Periksa format data
    if (data && typeof data === 'object') {
      // Jika data adalah objek kategori
      if (data.id === categoryId || data.id) {
        return {
          id: data.id || categoryId,
          nama: data.nama || `Kategori ${categoryId}`
        };
      }
    }
    
    // Fallback jika format tidak sesuai ekspektasi
    console.warn(`Format data untuk kategori ${categoryId} tidak sesuai ekspektasi:`, data);
    
    // Fallback untuk kategori umum
    if (categoryId === "TH01") {
      return { id: "TH01", nama: "Minuman" };
    } else if (categoryId === "TH02") {
      return { id: "TH02", nama: "Makanan" };
    } else if (categoryId === "TH03") {
      return { id: "TH03", nama: "Snack" };
    }
    
    return { id: categoryId, nama: `Kategori ${categoryId}` };
  } catch (error) {
    console.error(`Error fetching category ${categoryId}:`, error);
    throw error;
  }
};

/**
 * Fungsi untuk mengambil semua kategori
 */
export const fetchAllCategories = async () => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error("Token tidak ditemukan. Silakan login kembali.");
  }

  try {
    console.log("Memulai fetch semua kategori...");
    
    const response = await fetch('https://stechno.up.railway.app/api/product/category', {
      method: 'GET',
      headers: createAuthHeaders(token),
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Data mentah kategori:", data);
    
    // Pastikan data adalah array
    if (!Array.isArray(data)) {
      console.warn("Data kategori bukan array:", data);
      return [
        { id: "TH01", nama: "Minuman" },
        { id: "TH02", nama: "Makanan" },
        { id: "TH03", nama: "Snack" }
      ];
    }
    
    // Pastikan kategori Minuman selalu ada dengan ID TH01
    let hasMinuman = false;
    const processedCategories = data.map(category => {
      if (category.id === "TH01") {
        hasMinuman = true;
        return { ...category, nama: "Minuman" };
      }
      return category;
    });
    
    // Jika tidak ada kategori Minuman dengan ID TH01, tambahkan
    if (!hasMinuman) {
      processedCategories.push({ id: "TH01", nama: "Minuman" });
    }
    
    console.log("Kategori setelah diproses:", processedCategories);
    return processedCategories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return default categories on error
    return [
      { id: "TH01", nama: "Minuman" },
      { id: "TH02", nama: "Makanan" },
      { id: "TH03", nama: "Snack" }
    ];
  }
};

/**
 * Fungsi untuk mengambil produk berdasarkan kategori
 */
export const fetchProductsByCategory = async (categoryId) => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error("Token tidak ditemukan. Silakan login kembali.");
  }

  if (!categoryId) {
    throw new Error("ID Kategori tidak valid");
  }

  try {
    console.log(`Mengambil produk untuk kategori: ${categoryId}`);
    
    const response = await fetch(`https://stechno.up.railway.app/api/product/category/${categoryId}`, {
      method: 'GET',
      headers: createAuthHeaders(token),
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Kategori dengan ID ${categoryId} tidak ditemukan di server`);
      } else if (response.status === 401) {
        throw new Error("Token tidak valid. Silakan login kembali.");
      } else if (response.status === 403) {
        throw new Error("Akses ditolak. Anda tidak memiliki izin untuk mengakses data ini.");
      } else {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    }
    
    const data = await response.json();
    console.log(`Response data untuk kategori ${categoryId}:`, data);
    
    // Periksa berbagai kemungkinan format data
    if (Array.isArray(data)) {
      // Jika data adalah array produk langsung
      return data;
    } else if (data && typeof data === 'object') {
      if (data.products && Array.isArray(data.products)) {
        // Jika data adalah objek dengan property 'products' yang berupa array
        return data.products;
      } else if (data.id === categoryId) {
        // Jika data adalah objek kategori itu sendiri
        // Cek apakah ada property products
        if (data.products && Array.isArray(data.products)) {
          return data.products;
        } else {
          return [];
        }
      }
    }
    
    // Fallback jika format tidak sesuai ekspektasi
    console.warn(`Format data untuk kategori ${categoryId} tidak sesuai ekspektasi:`, data);
    return [];
  } catch (error) {
    console.error(`Error fetching products for category ${categoryId}:`, error);
    throw error;
  }
};

/**
 * Fungsi untuk mengambil semua produk
 */
export const fetchMinumanProducts = async () => {
  return fetchProductsByCategory("TH01");
};

/**
 * Fungsi untuk memperbarui produk
 */
export const updateProduct = async (productId, productData) => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error("Token tidak ditemukan. Silakan login kembali.");
  }

  try {
    const response = await fetch(`https://stechno.up.railway.app/api/product/${productId}`, {
      method: 'PUT',
      headers: createAuthHeaders(token),
      body: JSON.stringify(productData)
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error updating product ${productId}:`, error);
    throw error;
  }
};

/**
 * Fungsi untuk menghapus produk
 */
export const deleteProduct = async (productId) => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error("Token tidak ditemukan. Silakan login kembali.");
  }

  try {
    const response = await fetch(`https://stechno.up.railway.app/api/product/${productId}`, {
      method: 'DELETE',
      headers: createAuthHeaders(token)
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error deleting product ${productId}:`, error);
    throw error;
  }
};

/**
 * Fungsi untuk mengambil semua supplier
 */
export const fetchAllSuppliers = async () => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error("Token tidak ditemukan. Silakan login kembali.");
  }

  try {
    console.log("Memulai fetch semua supplier...");
    
    const response = await fetch('https://stechno.up.railway.app/api/product/supplier', {
      method: 'GET',
      headers: createAuthHeaders(token),
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Data mentah supplier:", data);
    
    // Pastikan data adalah array
    if (!Array.isArray(data)) {
      console.warn("Data supplier bukan array:", data);
      return [];
    }
    
    console.log("Supplier setelah diproses:", data);
    return data;
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    // Return empty array on error
    return [];
  }
};

/**
 * Fungsi untuk mengambil produk berdasarkan supplier
 */
export const fetchProductsBySupplier = async (supplierId) => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error("Token tidak ditemukan. Silakan login kembali.");
  }

  if (!supplierId) {
    throw new Error("ID Supplier tidak valid");
  }

  try {
    console.log(`Mengambil produk untuk supplier: ${supplierId}`);
    
    const response = await fetch(`https://stechno.up.railway.app/api/product/supplier/${supplierId}`, {
      method: 'GET',
      headers: createAuthHeaders(token),
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Supplier dengan ID ${supplierId} tidak ditemukan di server`);
      } else if (response.status === 401) {
        throw new Error("Token tidak valid. Silakan login kembali.");
      } else if (response.status === 403) {
        throw new Error("Akses ditolak. Anda tidak memiliki izin untuk mengakses data ini.");
      } else {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    }
    
    const data = await response.json();
    console.log(`Data produk untuk supplier ${supplierId}:`, data);
    
    // Jika data adalah array, kembalikan langsung
    if (Array.isArray(data)) {
      return data;
    }
    
    // Jika data memiliki property products yang berupa array, kembalikan itu
    if (data && data.products && Array.isArray(data.products)) {
      return data.products;
    }
    
    // Fallback jika format tidak sesuai ekspektasi
    console.warn(`Format data untuk supplier ${supplierId} tidak sesuai ekspektasi:`, data);
    return [];
  } catch (error) {
    console.error(`Error fetching products for supplier ${supplierId}:`, error);
    throw error;
  }
};

/**
 * Fungsi untuk mengambil supplier berdasarkan ID
 */
export const fetchSupplierById = async (supplierId) => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error("Token tidak ditemukan. Silakan login kembali.");
  }

  try {
    console.log(`Mengambil data supplier dengan ID: ${supplierId}`);
    
    const response = await fetch(`https://stechno.up.railway.app/api/product/supplier/${supplierId}`, {
      method: 'GET',
      headers: createAuthHeaders(token),
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Data supplier ${supplierId}:`, data);
    
    // Jika data adalah objek dengan property supplier, kembalikan itu
    if (data && data.supplier) {
      return data.supplier;
    }
    
    // Jika data sendiri adalah objek supplier, kembalikan langsung
    if (data && data.id === supplierId) {
      return data;
    }
    
    // Fallback jika format tidak sesuai ekspektasi
    console.warn(`Format data untuk supplier ${supplierId} tidak sesuai ekspektasi:`, data);
    return { id: supplierId, nama: `Supplier ${supplierId}` };
  } catch (error) {
    console.error(`Error fetching supplier ${supplierId}:`, error);
    throw error;
  }
};



