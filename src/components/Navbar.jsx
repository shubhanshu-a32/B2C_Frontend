import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import useThemeStore from "../store/themeStore";
import useCartStore from "../store/cartStore";
import useWishlistStore from "../store/wishlistStore";
import CategoriesDrawer from "./CategoriesDrawer";
import GlobalSearch from "./GlobalSearch";
import LocationFilter from "./LocationFilter";
import Logo from '../assets/logo/Ketalog_Logo.jpeg';

export default function NavBar() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { theme, toggleTheme } = useThemeStore();
  const cartItems = useCartStore((s) => s.items);
  const wishlistItems = useWishlistStore((s) => s.items);
  const [openCategories, setOpenCategories] = useState(false);
  const [cartBlink, setCartBlink] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip blink on initial load (refresh), only blink on updates
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (cartItems.length > 0) {
      setCartBlink(true);
      const timer = setTimeout(() => setCartBlink(false), 1000); // 1s blink
      return () => clearTimeout(timer);
    }
  }, [cartItems]);

  const navigate = useNavigate();



  return (
    <>
      <nav className="w-full sm:text-sm text-lg bg-white dark:bg-gray-800 shadow px-4 py-3 flex items-center justify-between gap-2 sm:gap-4 fixed top-0 z-50">
        <div className="flex items-center gap-3">
          {(!user || user.role !== "seller") && (
            <button onClick={() => setOpenCategories(true)} className="p-3 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
              <svg className="w-6 h-6 text-gray-700 dark:text-gray-200" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
          )}
          <Link
            to={user ? (user.role === "seller" ? "/seller/dashboard" : "/buyer/shop") : "/"}
            className={`sm:text-xl text-xl font-bold text-brand dark:text-white ${user?.role === "seller" ? "ml-3" : ""}`}
          >
            <div className="flex items-center gap-2">
              <img src={Logo} alt="Logo" className="w-8 h-8 sm:w-10 sm:h-10" />
              <span className="text-base sm:text-lg lg:text-xl font-semibold">
                KETALOG
              </span>
            </div>
          </Link>
          {/* {!user && (
            <p className="text-gray-600 sm:text-sm dark:text-gray-300 hidden md:block">
              Shop from trusted sellers. Explore products by category.
            </p>
          )} */}
        </div>

        {/* Hide Search for Sellers */}
        {(!user || user.role !== "seller") && <GlobalSearch />}

        <div className="flex items-center gap-4">

          {/* Buyer Navigation Links */}
          {user && user.role === "buyer" && (
            <div className="flex items-center gap-4 text-sm font-medium text-gray-700 dark:text-gray-200">
              <Link to="/buyer/cart" className={`hover:text-blue-600 relative p-1 transition-colors duration-300 ${cartBlink ? 'text-green-600' : ''}`}>
                <span className="sr-only">Cart</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${cartBlink ? 'animate-pulse' : ''}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                {cartItems.length > 0 && (
                  <span className={`absolute -top-1 -right-1 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center transition-colors duration-300 ${cartBlink ? 'bg-green-600 scale-110' : 'bg-blue-600'}`}>
                    {cartItems.length}
                  </span>
                )}
              </Link>
            </div>
          )}


          <div className="flex items-center gap-3">
            {!user ? (
              <div className="relative group">
                <button className="px-2 py-1.5 sm:px-4 bg-blue-600 hover:bg-blue-700 text-white rounded transition flex items-center gap-2">
                  <span className="hidden sm:block">Login</span>
                  <svg className="w-5 h-5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                </button>

                {/* Dropdown Menu - invisible bridge using padding */}
                <div className="absolute right-0 top-full w-32 pt-2 hidden group-hover:block z-50">
                  <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-xl rounded-md overflow-hidden">
                    <button
                      onClick={() => navigate("/login?role=buyer")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Buyer
                    </button>
                    <button
                      onClick={() => navigate("/login?role=seller")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Seller
                    </button>

                  </div>
                </div>
              </div>
            ) : (
              <>
                {user.role === "seller" ? (
                  <div className="flex items-center gap-2 sm:gap-4">
                    <Link to="/seller/dashboard" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600">
                      <span className="hidden sm:block">Dashboard</span>
                      <span className="block sm:hidden">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                      </span>
                    </Link>
                    <div className="relative group mr-2">
                      <button className="px-2 py-1 sm:px-3 flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                        <span className="hidden sm:block">Profile</span>
                        <svg className="w-6 h-6 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      </button>

                      {/* Dropdown Menu - invisible bridge using padding */}
                      <div className="absolute right-0 top-full w-48 pt-2 hidden group-hover:block z-50">
                        <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-xl rounded-md overflow-hidden">
                          <Link to="/seller/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Profile</Link>
                          <Link to="/seller/products" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Manage Products</Link>
                          <Link to="/seller/add-product" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Add Product</Link>
                          <div className="border-t dark:border-gray-700 mt-1 pt-1">
                            <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10">Logout</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative group">
                    <button className="px-2 py-1 sm:px-3 flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                      <span className="hidden sm:block">Profile</span>
                      <svg className="w-6 h-6 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </button>

                    {/* Dropdown Menu - invisible bridge using padding */}
                    <div className="absolute right-0 top-full w-48 pt-2 hidden group-hover:block z-50">
                      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-xl rounded-md overflow-hidden">
                        <Link to="/buyer/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Profile</Link>
                        <Link to="/buyer/shop" state={null} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Shop</Link>
                        <Link to="/buyer/orders" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Orders</Link>
                        <div className="relative">
                          <Link to="/buyer/wishlist" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex justify-between items-center">
                            Wishlist
                            {wishlistItems.length > 0 && <span className="bg-red-500 text-white text-xs rounded-full px-1.5">{wishlistItems.length}</span>}
                          </Link>
                        </div>
                        <div className="border-t dark:border-gray-700 mt-1 pt-1">
                          <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10">Logout</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            <button onClick={toggleTheme} className="p-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100">
              {theme === "light" ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              )}
            </button>
          </div>
        </div>
      </nav >

      {/* Location Filter Bar - Buyers/Public Only */}
      {(!user || user.role !== "seller") && <LocationFilter />}

      <CategoriesDrawer open={openCategories} setOpen={setOpenCategories} />

    </>
  );
}