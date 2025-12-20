import { Link } from "react-router-dom";
import useAuthStore from "./store/authStore";
import useThemeStore from "./store/themeStore";

export default function LoginMain() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="w-full flex justify-between items-center px-6 py-4 shadow bg-white dark:bg-gray-800">
        <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          B2C Website
        </Link>

        <button
          onClick={toggleTheme}
          className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </button>
      </header>

      <main className="flex flex-col justify-center items-center flex-1 px-6">
        <h1 className="text-5xl font-bold mb-10">B2C Shopping</h1>

        {!user ? (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-md space-y-4">
            <Link
              to="/login?role=buyer"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-lg text-lg"
            >
              Login as Buyer
            </Link>

            <Link
              to="/login?role=seller"
              className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-3 rounded-lg text-lg"
            >
              Login as Seller
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl text-center w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-2">
              Welcome {user.fullName || user.shopName || "User"}
            </h2>

            <div className="flex gap-4 justify-center mt-4">
              <Link
                to={user.role === "seller" ? "/seller/dashboard" : "/buyer/dashboard"}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Dashboard
              </Link>

              <button
                onClick={logout}
                className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}