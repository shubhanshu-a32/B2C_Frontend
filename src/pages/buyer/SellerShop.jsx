import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import api from "../../services/api";
import ProductCard from "../../components/ProductCard";
import { MapPin, Phone, User, Store, ShoppingBag, ArrowLeft } from "lucide-react";
import SellerShopSkeleton from "../../components/ui/preloaders/SellerShopSkeleton";

export default function SellerShop() {
  const { sellerId } = useParams();
  const location = useLocation();
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check if we came from a product page
  const fromProductId = location.state?.fromProduct;

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        // Fetch public seller profile
        const profileRes = await api.get(`/seller/profile/${sellerId}`);
        setSeller(profileRes.data);

        // Fetch seller's products
        const productsRes = await api.get(`/products?seller=${sellerId}`);
        setProducts(productsRes.data.data || []);
      } catch (err) {
        // console.error("Failed to load seller shop data", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [sellerId]);

  if (loading) {
    return <SellerShopSkeleton />;
  }

  if (!seller) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Store size={64} className="text-gray-300" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Seller Not Found</h2>
        <Link to="/buyer/shop" className="text-blue-600 hover:underline">Return to Shop</Link>
      </div>
    );
  }

  const mapLink =
    seller.lat && seller.lng
      ? `https://www.google.com/maps?q=${seller.lat},${seller.lng}`
      : seller.address
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(seller.address)}`
        : null;

  return (
    <div className="space-y-8 animate-fade-in px-4 py-6">
      {/* Navigation Header */}
      {fromProductId && (
        <div>
          <Link
            to={`/buyer/product/${fromProductId}`}
            className="inline-flex items-center gap-2 text-blue-600 font-medium hover:underline transition-colors"
          >
            <ArrowLeft size={20} />
            Go to Product
          </Link>
        </div>
      )}

      {/* Modern Hero Section */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Decorative Background Gradient */}
        {/* Decorative Background Gradient / Cover Photo */}
        <div className="h-48 w-full relative bg-gray-200 dark:bg-gray-700">
          {seller.coverPhoto ? (
            <img src={seller.coverPhoto} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              {/* Abstract circles */}
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <path fill="white" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-4.9C93.5,9.4,82.2,23.1,70.8,34.3C59.4,45.5,47.9,54.2,35.6,60.7C23.3,67.2,10.2,71.5,-2.1,75.1C-14.4,78.7,-25.9,81.6,-36.7,76.5C-47.5,71.4,-57.6,58.3,-65.4,45C-73.2,31.7,-78.7,18.2,-81.2,3.8C-83.7,-10.6,-83.2,-25.9,-75.6,-38.5C-68,-51.1,-53.3,-61,-38.9,-68C-24.5,-75,-10.4,-79.1,2.8,-83.9C16,-88.7,30.5,-94.1,44.7,-76.4Z" transform="translate(100 100)" />
                </svg>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 pb-6 mt-[-3rem] relative z-10">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Avatar / Icon */}
            <div className="w-24 h-24 bg-white dark:bg-gray-700 rounded-2xl shadow-lg p-1 flex items-center justify-center border-4 border-white dark:border-gray-800 overflow-hidden">
              {seller.profilePicture ? (
                <img src={seller.profilePicture} alt={seller.shopName} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <Store size={40} className="text-blue-600 dark:text-blue-400" />
              )}
            </div>

            {/* Shop Info */}
            <div className="flex-1 pt-0 md:pt-14">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {seller.shopName || "Seller Shop"}
              </h1>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300 mt-3">
                <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded-full">
                  <User size={16} />
                  <span>{seller.ownerName || "Unknown Owner"}</span>
                </div>
                {seller.address && (
                  <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded-full text-gray-700 dark:text-gray-200">
                    <MapPin size={16} />
                    <span className="max-w-xs truncate">{seller.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-0 md:pt-14 flex gap-3 w-full md:w-auto">
              {seller.mobile && (
                <a
                  href={`tel:${seller.mobile}`}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <Phone size={18} />
                  <span>Call</span>
                </a>
              )}

              {mapLink && (
                <a
                  href={mapLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md hover:shadow-lg transition active:translate-y-0.5"
                >
                  <MapPin size={18} />
                  <span>Locate Shop</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Seller Products Grid */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
            <ShoppingBag size={20} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            All Products ({products.length})
          </h2>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 text-center">
            <ShoppingBag size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">No products listed by this seller yet.</p>
          </div>
        ) : (
          <div className="flex gap-3 sm:gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth">
            {products.map((product) => (
              <div key={product._id} className="min-w-[calc(50%-6px)] w-[calc(50%-6px)] sm:min-w-[280px] sm:w-[280px] snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
