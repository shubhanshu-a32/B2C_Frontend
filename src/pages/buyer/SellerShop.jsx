import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";
import ProductCard from "../../components/ProductCard";

export default function SellerShop() {
  const { sellerId } = useParams();
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        // Fetch public seller profile
        const profileRes = await api.get(`/seller/profile/${sellerId}`);
        setSeller(profileRes.data);

        // Fetch seller's products
        const productsRes = await api.get(`/products?seller=${sellerId}`);
        setProducts(productsRes.data.docs || []);
      } catch (err) {
        console.error("Failed to load seller shop data", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [sellerId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Seller Not Found</h2>
        <Link to="/buyer/shop" className="text-blue-600 hover:underline">Return to Shop</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Seller Header */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{seller.shopName || "Seller Shop"}</h1>
            <p className="text-gray-600 dark:text-gray-300">Owned by <span className="font-semibold">{seller.ownerName || "Unknown"}</span></p>
            {seller.address && <p className="text-sm text-gray-500 mt-1">{seller.address}</p>}
          </div>

          <div className="flex flex-col items-start md:items-end gap-2">
            {seller.mobile && (
              <div className="text-sm bg-blue-50 dark:bg-gray-700 text-blue-700 dark:text-blue-200 px-3 py-1 rounded-full">
                📞 {seller.mobile}
              </div>
            )}
            {seller.lat && seller.lng && (
              <a
                href={`https://www.google.com/maps?q=${seller.lat},${seller.lng}`}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
              >
                📍 View Location
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Seller Products */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Products from {seller.shopName} ({products.length})</h2>

        {products.length === 0 ? (
          <div className="p-8 text-center text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-xl">
            No products found for this seller.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
