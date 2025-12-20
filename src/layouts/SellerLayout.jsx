import { Link, Outlet } from "react-router-dom";
import useAuthStore from "../store/authStore";
import useThemeStore from "../store/themeStore";

export default function SellerLayout() {
  const logout = useAuthStore((s) => s.logout);
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-xl p-6 flex flex-col gap-5">
        <Link to="/seller/dashboard" className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-6">
          B2C Website
        </Link>

        <Link to="/seller/dashboard" className="hover:text-blue-600">Dashboard</Link>
        <Link to="/seller/products" className="hover:text-blue-600">Manage Products</Link>
        <Link to="/seller/add-product" className="hover:text-blue-600">Add Product</Link>
        <Link to="/seller/profile" className="hover:text-blue-600">Profile</Link>

        <button
          onClick={toggleTheme}
          className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 mt-4"
        >
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </button>

        <button
          onClick={logout}
          className="mt-auto bg-red-500 p-2 text-white rounded-lg"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}