import { Link, useNavigate } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import toast from "react-hot-toast";
import useAuthStore from "../store/authStore";
import useCartStore from "../store/cartStore";
import useWishlistStore from "../store/wishlistStore";

export default function ProductCard({ product }) {
  const user = useAuthStore((s) => s.user);
  const addToCart = useCartStore((s) => s.addToCart);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const wishlistItems = useWishlistStore((s) => s.items);
  const navigate = useNavigate();

  const isInWishlist = user && wishlistItems.some(
    (i) => i._id === product._id
  );

  const requireLogin = () => {
    toast.error("Please login as buyer to continue");
    navigate("/login?role=buyer");
  };

  const handleAddToCart = () => {
    if (!user || user.role !== "buyer") return requireLogin();
    if (product.stock <= 0) return toast.error("Out of stock");
    addToCart(product, 1);
  };

  const handleWishlist = () => {
    if (!user || user.role !== "buyer") return requireLogin();
    toggleWishlist(product);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col border border-transparent dark:border-gray-700 h-full">
      <Link to={`/buyer/product/${product._id}`}>
        <div className="h-44 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden mb-3">
          {product.images?.length ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>

        <h3 className="font-semibold text-lg line-clamp-1">
          {product.title}
        </h3>

        {/* Rating Badge */}
        <div className="flex items-center gap-2 mt-1 mb-1">
          <div className="flex items-center bg-green-600 text-white text-xs px-1.5 py-0.5 rounded font-bold">
            {product.rating ? product.rating.toFixed(1) : "0.0"} <Star size={10} className="ml-0.5 fill-white" />
          </div>
          <span className="text-xs text-gray-500">({product.numReviews || 0})</span>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
          {product.description}
        </p>
      </Link>

      <div className="mt-auto pt-4 flex items-center justify-between gap-3">
        <p className="text-xl font-bold text-blue-600">
          ₹{product.price}
        </p>

        <div className="flex gap-2">
          <button
            onClick={handleWishlist}
            className={`p-2 rounded border transition ${isInWishlist
              ? "text-red-500 border-red-500"
              : "text-gray-500 dark:text-gray-300"
              }`}
          >
            <Heart
              size={18}
              fill={isInWishlist ? "currentColor" : "none"}
            />
          </button>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`px-3 py-1.5 rounded text-sm font-medium text-white transition-colors whitespace-nowrap ${product.stock > 0
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
              }`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
