import useWishlistStore from "../../store/wishlistStore";
import ProductCard from "../../components/ProductCard";
import { Link } from "react-router-dom";

export default function WishlistPage() {
  const { items } = useWishlistStore();

  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="text-6xl">💔</div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Your wishlist is empty</h2>
        <p className="text-gray-500 dark:text-gray-400">Explore products and add your favorites here.</p>
        <Link to="/buyer/shop" className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
          Browse Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">My Wishlist ({items.length})</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}