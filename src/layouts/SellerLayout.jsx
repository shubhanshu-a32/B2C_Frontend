import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import useThemeStore from "../store/themeStore";
import Logo from '../assets/logo/Ketalog_Logo.jpeg';
import {
  LayoutDashboard,
  PlusCircle,
  Package,
  User,
  LogOut,
  Moon,
  Sun,
  Menu,
  ChevronLeft
} from "lucide-react";
import WhatsAppButton from "../components/WhatsAppButton";

export default function SellerLayout() {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);

  const navigation = [
    { name: 'Dashboard', href: '/seller/dashboard', icon: LayoutDashboard },
    { name: 'Add Product', href: '/seller/add-product', icon: PlusCircle },
    { name: 'Manage Products', href: '/seller/products', icon: Package },
    { name: 'Profile', href: '/seller/profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Sidebar */}
      <aside
        className={`${isSidebarOpen ? 'w-64' : 'w-20'
          } bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 relative z-30`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
          <Link to="/seller/dashboard" className="flex items-center gap-2 overflow-hidden px-4 w-full">
            <img src={Logo} alt="Logo" className="w-8 h-8 rounded-full flex-shrink-0" />
            <span className={`font-bold text-xl text-brand dark:text-white transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'
              }`}>
              KETALOG
            </span>
          </Link>
        </div>

        {/* Toggle Button (Desktop) */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-20 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full p-1 shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors z-50"
        >
          <ChevronLeft className={`w-4 h-4 text-gray-600 dark:text-gray-300 transition-transform duration-300 ${!isSidebarOpen ? 'rotate-180' : ''
            }`} />
        </button>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                title={!isSidebarOpen ? item.name : ''}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                  }`} />
                <span className={`font-medium whitespace-nowrap transition-all duration-200 ${isSidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 w-0 overflow-hidden'
                  }`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}

      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 shadow-sm z-20">
          <div className="flex items-center gap-4">


            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
              {navigation.find(n => n.href === location.pathname)?.name || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* User Info */}
            {user && (
              <div className="flex items-center gap-3 mr-2 sm:mr-4">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                    {user.name || user.shopName || "Seller"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800 overflow-hidden">
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    user.shopName ? user.shopName.charAt(0).toUpperCase() : 'S'
                  )}
                </div>
              </div>
            )}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/10 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto animate-fadeIn">
            <Outlet />
          </div>

          {/* Global WhatsApp Button for Seller Dashboard */}
          <WhatsAppButton />
        </main>
      </div>
    </div>
  );
}