import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductDetail from "../Component/ProductDetail";


function ProductIdPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("ID produk tidak ditemukan");
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `https://stechno.up.railway.app/api/product/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Gagal mengambil data produk");
        }

        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleBack = () => {
    navigate("/");
  };

  if (loading) return <div className="p-4 text-center">Memuat data produk...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  if (!product) return <div className="p-4 text-center">Produk tidak ditemukan</div>;

  return <ProductDetail product={product} onBack={handleBack} />;
}

export default ProductIdPage;
