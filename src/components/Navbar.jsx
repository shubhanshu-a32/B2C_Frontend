import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import useThemeStore from "../store/themeStore";
import CategoriesDrawer from "./CategoriesDrawer";
import GlobalSearch from "./GlobalSearch";

export default function NavBar() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { theme, toggleTheme } = useThemeStore();
  const [openCategories, setOpenCategories] = useState(false);

  const navigate = useNavigate();

  return (
    <>
      <nav className="w-full bg-white dark:bg-gray-800 shadow px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setOpenCategories(true)} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            <svg className="w-6 h-6 text-gray-700 dark:text-gray-200" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
          <Link to="/" className="text-xl font-bold text-brand dark:text-white">B2C Website </Link>
          <p className="text-gray-600 dark:text-gray-300">
            Shop from trusted sellers. Explore products by category.
          </p>
        </div>

        <GlobalSearch />

        <div className="flex items-center justify-between gap-3">
          {!user ? (
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-1 bg-blue-600 text-white rounded"
            >Login
            </button>
          ) : (
            <>
              <Link to={user.role === "seller" ? "/seller/dashboard" : "/buyer/dashboard"} className="px-3 py-1 text-gray-700 dark:text-gray-200">Dashboard</Link>
              <button onClick={logout} className="px-3 py-1 bg-red-500 text-white rounded">Logout</button>
            </>
          )}

          <button onClick={toggleTheme} className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100">
            {theme === "light" ? "Dark" : "Light"}
          </button>
        </div>
      </nav>

      <CategoriesDrawer open={openCategories} setOpen={setOpenCategories} />

    </>
  );
}