import { Link, Outlet } from "react-router-dom";
import useAuthStore from "../store/authStore";
import useThemeStore from "../store/themeStore";
import useCartStore from "../store/cartStore";
import useWishlistStore from "../store/wishlistStore";

export default function BuyerLayout() {
  const logout = useAuthStore((s) => s.logout);
  const { theme, toggleTheme } = useThemeStore();
  const cartItems = useCartStore((s) => s.items);
  const wishlistItems = useWishlistStore((s) => s.items);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <nav className="flex justify-between items-center px-6 py-4 shadow bg-white dark:bg-gray-800">
        <div className="flex items-center gap-6">
          <Link to="/buyer/shop" className="hover:text-blue-600">Shop</Link>
          <Link to="/buyer/orders" className="hover:text-blue-600">Orders</Link>
          <Link to="/buyer/wishlist" className="hover:text-blue-600">
            Wishlist {wishlistItems.length > 0 && `(${wishlistItems.length})`}
          </Link>
          <Link to="/buyer/cart" className="hover:text-blue-600">
            Cart {cartItems.length > 0 && `(${cartItems.length})`}
          </Link>
          <Link to="/buyer/profile" className="hover:text-blue-600">Profile</Link>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>

          <Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
            B2C Website
          </Link>

          <button onClick={logout} className="px-3 py-1 bg-red-500 text-white rounded">
            Logout
          </button>
        </div>
      </nav>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}