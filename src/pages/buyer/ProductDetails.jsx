import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import useCartStore from "../../store/cartStore";
import useWishlistStore from "../../store/wishlistStore";
import useAuthStore from "../../store/authStore";
import toast from "react-hot-toast";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [p, setP] = useState(null);
  const addToCart = useCartStore((s) => s.addToCart);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get(`/products/${id}`);
      setP(data);
    };
    load();
  }, [id]);
  const requireLogin = () => {
    toast.error("Please login as buyer to continue");
    navigate("/login?role=buyer");
  };

  const handleAddToCart = () => {
    if (!user || user.role !== "buyer") return requireLogin();
    if (p.stock <= 0) return toast.error("Out of stock");
    addToCart(p, 1);
  };

  const handleWishlist = () => {
    if (!user || user.role !== "buyer") return requireLogin();
    toggleWishlist(p);
  };

  if (!p) return <p className="text-gray-900 dark:text-gray-100">Loading...</p>;

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-gray-100 p-6 shadow rounded-lg max-w-3xl mx-auto">
      <div className="h-64 bg-gray-200 dark:bg-gray-800 flex items-center justify-center mb-4 rounded">
        <span>Image</span>
      </div>

      <h2 className="text-3xl font-bold">{p.title}</h2>
      <p className="text-gray-700 dark:text-gray-200 mt-2">{p.description}</p>

      <p className="text-3xl font-bold mt-4">₹{p.price}</p>

      <div className="flex items-center gap-4 mt-4">
        <button
          onClick={handleAddToCart}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add to cart
        </button>
        <button
          onClick={handleWishlist}
          className="px-4 py-2 border rounded border-gray-300 dark:border-gray-600"
        >
          Wishlist
        </button>
      </div>

      {/* Seller info exactly as configured in seller profile */}
      {p.sellerId && (
        <div className="mt-8 border-t pt-4">
          <h3 className="text-xl font-semibold mb-2">Seller</h3>
          <p className="font-medium">
            Shop:&nbsp;
            <Link
              to={`/buyer/seller/${p._id}`}
              className="text-blue-600 underline"
            >
              {p.sellerId.shopName || "Not set"}
            </Link>
          </p>
          {p.sellerId.ownerName && <p className="text-gray-700 dark:text-gray-200">Owner: {p.sellerId.ownerName}</p>}
          <p className="text-gray-700 dark:text-gray-200">Contact: {p.sellerId.mobile}</p>
          {p.sellerId.address && <p className="text-gray-700 dark:text-gray-200">Address: {p.sellerId.address}</p>}
          {p.sellerId.lat && p.sellerId.lng && (
            <a
              href={`https://www.google.com/maps?q=${p.sellerId.lat},${p.sellerId.lng}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline mt-2 inline-block"
            >
              View location in Google Maps
            </a>
          )}
        </div>
      )}
    </div>
  );
}