import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLocation as useGeoLocation } from "../../context/LocationContext";
import api from "../../services/api";
import ProductCard from "../../components/ProductCard";
import ProductSkeleton from "../../components/ui/preloaders/ProductSkeleton";
import SellerCard from "../../components/SellerCard";
import ImageSlider from "../../components/ImageSlider";
import toast from "react-hot-toast";
import useAuthStore from "../../store/authStore";
import useCategoryStore from "../../store/categoryStore"; // Import store
import { LayoutGrid } from "lucide-react";
import { categoryIcons, DefaultCategoryIcon, getSubCategoryIcon } from "../../constants/categoryIcons";
import Grocery from '../../assets/hero_section/food_grocery_banner.png';
import Hardware from '../../assets/hero_section/hardware_diy.png';
import Electronics from '../../assets/hero_section/electronics.png';
import Fashion from '../../assets/hero_section/fashion_banner.png';
import Electricals from '../../assets/hero_section/electricals.png';
import HomeKitchen from '../../assets/hero_section/home_kitchen.jpeg';
import DailyNeeds from '../../assets/hero_section/daily_needs.png';

// Category Row Component (Internal)
function CategoryRow({ title, categoryId, banner }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    // Determine items per page based on screen width
    const updateItemsPerPage = () => {
      if (window.innerWidth < 1024) {
        setItemsPerPage(8); // Mobile/Tablet: 8 items
      } else {
        setItemsPerPage(5); // Desktop: 5 items
      }
    };

    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { location: geoLocation } = useGeoLocation();

  useEffect(() => {
    setLoading(true);
    const params = { category: categoryId, limit: 20 };
    if (geoLocation && geoLocation.area !== "Katni") {
      params.pincode = geoLocation.pincode;
      params.area = geoLocation.area;
    }

    api.get("/products", {
      params
    })
      .then((res) => {
        setProducts(res.data.data);
      })
      .catch((err) => {
        // console.error(`Failed to load ${title}`, err);
      })
      .finally(() => setLoading(false));
  }, [categoryId, title, geoLocation]);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const currentProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!loading && products.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4 px-4 md:px-6">
        <h2 className="text-xl font-bold">{title}</h2>
        {products.length > itemsPerPage && (
          <button
            onClick={() => navigate("/buyer/shop", { state: { category: categoryId } })}
            className="text-blue-600 hover:underline text-sm font-semibold"
          >
            View All
          </button>
        )}
      </div>

      {/* Optional Banner */}
      {banner && (
        <div className="w-full h-[160px] sm:h-[250px] rounded-2xl overflow-hidden shadow-md mb-6 px-4 md:px-6">
          <img src={banner} alt={title} className="w-full h-full object-fill" />
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 px-4 md:px-6">
          {[...Array(itemsPerPage)].map((_, i) => (
            <div key={i}>
              <ProductSkeleton />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Grid display instead of horizontal scroll for pagination flow */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 lg:gap-4 px-4 md:px-6">
            {currentProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold transition-colors
                    ${currentPage === i + 1
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default function Shop() {
  const location = useLocation();
  const { location: geoLocation } = useGeoLocation();
  const navigate = useNavigate();
  const { categories, fetchCategories } = useCategoryStore();

  const urlParams = new URLSearchParams(location.search);
  const initialQ = urlParams.get("q") || "";

  const [category, setCategory] = useState(location.state?.category || "");
  const [subcategory, setSubcategory] = useState(location.state?.subcategory || "");
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [sellers, setSellers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(24);
  const [isExpanded, setIsExpanded] = useState(false);

  const [filters, setFilters] = useState({
    q: initialQ,
    maxPrice: "",
    inStock: false,
  });

  // Mobile Filter Drawer State
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Desktop Filter Toggle (kept for backward compatibility, but effectively always visible on desktop usually)
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [openCategory, setOpenCategory] = useState(null);

  // Media query for mobile detection
  const [isMobile, setIsMobile] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1023px)');
    setIsMobile(mediaQuery.matches);

    const handleMediaChange = (e) => {
      setIsMobile(e.matches);
    };

    mediaQuery.addEventListener('change', handleMediaChange);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const selectedCategory = categories.find(c => c._id === category || c.slug === category);

  // Check if any filters are active
  const isBrowsingAll = !category && !subcategory && !filters.q && !filters.maxPrice && !filters.inStock;

  useEffect(() => {
    // Always sync with location state. If null/undefined, reset to empty.
    const newCat = location.state?.category || "";
    setCategory(newCat);
    setSubcategory(location.state?.subcategory || "");
  }, [location.state]);

  // Sync openCategory with category state (for visual highlighting)
  useEffect(() => {
    if (category && categories.length > 0) {
      const matched = categories.find(c => c.slug === category || c._id === category);
      if (matched) {
        setOpenCategory(matched._id);
      }
    } else if (!category) {
      setOpenCategory(null);
    }
  }, [category, categories]);

  useEffect(() => {
    setPage(1);
    setIsExpanded(false); // Reset expansion on filter change
  }, [category, subcategory, filters, geoLocation]);

  // Fetch Sellers
  useEffect(() => {
    const sellerParams = {};
    if (geoLocation && geoLocation.area !== "Katni") {
      sellerParams.pincode = geoLocation.pincode;
      sellerParams.area = geoLocation.area;
    }

    if (category) {
      sellerParams.category = category;
    }

    api.get("/seller/profile/list", { params: sellerParams })
      .then((res) => setSellers(res.data))
      .catch(() => { });
  }, [geoLocation, category]);

  // Load Products
  useEffect(() => {
    loadProducts();
  }, [category, subcategory, filters, page, geoLocation]);

  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const params = {
        page,
        limit,
        ...(filters.q && { q: filters.q }),
        ...(category && { category }),
        ...(subcategory && { subcategory }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        ...(filters.inStock && { inStock: true }),
      };

      if (geoLocation && geoLocation.area !== "Katni") {
        params.pincode = geoLocation.pincode;
        params.area = geoLocation.area;
      }

      const res = await api.get("/products", { params });
      setProducts(res.data.data);
      setTotalPages(res.data.pages || 1);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoadingProducts(false);
    }
  };

  const categoryBanners = {
    "electronics": Electronics,
    "fashion": Fashion,
    "electricals": Electricals,
    "home-and-kitchen": HomeKitchen,
    "daily-needs": DailyNeeds,
    "hardware-and-diy": Hardware,
    "hardware": Hardware,
    "food-grocery": Grocery,
    "Electronics": Electronics,
    "Fashion": Fashion,
    "Electricals": Electricals,
    "Home and Kitchen": HomeKitchen,
    "Daily Needs": DailyNeeds,
    "HARDWARE & DIY": Hardware,
    "Food-Grocery": Grocery,
    "Vegetable and Fruits": Grocery
  };

  return (
    <div className="w-full space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* HERO SLIDER */}
      <div className="shadow-lg">
        <ImageSlider />
      </div>

      <div className="flex-1 w-full mx-auto space-y-12 pb-12 w-full">

        {/* EXPLORE CATEGORIES */}
        <section>
          <div className="flex justify-between items-center mb-4 sm:mb-6 px-4 md:px-6">
            <h2 className="text-xl sm:text-2xl font-bold">
              Explore Categories
            </h2>

            {/* MOBILE FILTER BUTTON */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow text-blue-600 font-bold border border-blue-100"
            >
              <span>⚡ Filters</span>
            </button>
          </div>

          {isMobile ? (
            /* MOBILE VIEW - Two Buttons: All + Categories Dropdown */
            <div className="flex gap-3 pb-4 px-4 md:px-6">
              <button
                onClick={() => {
                  setCategory("");
                  setSubcategory("");
                  setFilters({ q: "", maxPrice: "", inStock: false });
                  setOpenCategory(null);
                }}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${!category
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
              >
                <LayoutGrid className={`w-5 h-5 ${!category ? "text-white" : "text-blue-600"}`} />
                <span>All</span>
              </button>
              <div className="flex-1 relative">
                <button
                  onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                  className={`w-full px-4 py-3 rounded-lg font-semibold transition border flex items-center justify-center gap-2 ${category
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    }`}
                >
                  {category ? (
                    <>
                      {(() => {
                        const selectedCat = categories.find(c => c.slug === category);
                        const Icon = categoryIcons[selectedCat?.name.toLowerCase()] || categoryIcons[selectedCat?.slug?.toLowerCase()] || DefaultCategoryIcon;
                        return <Icon className="w-5 h-5" />;
                      })()}
                      <span>{categories.find(c => c.slug === category)?.name}</span>
                    </>
                  ) : (
                    <span>Categories</span>
                  )}
                  <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {categoryDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setCategoryDropdownOpen(false)} />
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 max-h-64 overflow-y-auto z-20">
                      <button
                        onClick={() => {
                          setCategory("");
                          setSubcategory("");
                          setOpenCategory(null);
                          setCategoryDropdownOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                      >
                        <LayoutGrid className="w-5 h-5 text-blue-600" />
                        <span>All Categories</span>
                      </button>
                      {categories.map((cat) => {
                        const Icon = categoryIcons[cat.name.toLowerCase()] || categoryIcons[cat.slug?.toLowerCase()] || DefaultCategoryIcon;
                        return (
                          <button
                            key={cat._id}
                            onClick={() => {
                              if (category === cat.slug) {
                                setCategory("");
                                setSubcategory("");
                                setOpenCategory(null);
                                setCategoryDropdownOpen(false);
                              } else {
                                setCategory(cat.slug);
                                setSubcategory("");
                                setOpenCategory(cat._id);
                                setCategoryDropdownOpen(false);
                              }
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                          >
                            <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            <span>{cat.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            /* DESKTOP VIEW - Full Category Grid */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 pb-4 px-4 md:px-6">
              <button
                onClick={() => {
                  setCategory("");
                  setSubcategory("");
                  setFilters({ q: "", maxPrice: "", inStock: false });
                  setOpenCategory(null);
                }}
                className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg border transition h-full w-full
                  ${!category
                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
              >
                <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6 mb-0.5" />
                <span className="text-[10px] sm:text-xs font-medium text-center leading-none">All</span>
              </button>
              {categories.map((cat) => {
                const Icon = categoryIcons[cat.name.toLowerCase()] || categoryIcons[cat.slug?.toLowerCase()] || DefaultCategoryIcon;
                return (
                  <button
                    key={cat._id}
                    onClick={() => {
                      if (category === cat.slug) {
                        setCategory("");
                        setSubcategory("");
                        setOpenCategory(null);
                      } else {
                        setOpenCategory(openCategory === cat._id ? null : cat._id);
                        setCategory(cat.slug);
                        setSubcategory("");
                      }
                    }}
                    className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg border transition h-full w-full
                      ${openCategory === cat._id
                        ? "bg-blue-600 text-white border-blue-600 shadow-md"
                        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                  >
                    <Icon className="w-8 h-8 sm:w-10 sm:h-10 mb-0.5" />
                    <span className="text-[10px] sm:text-xs font-medium text-center leading-tight px-0.5 truncate w-full">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Subcategories Expansion Panel */}
          {openCategory && (
            <div className="mt-4 mx-4 md:mx-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow border dark:border-gray-700 animate-fade-in-down">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                Subcategories
              </h3>
              <div className="flex flex-wrap gap-3">
                {categories.find(c => c._id === openCategory)?.subCategories?.map((sub) => {
                  const SubIcon = getSubCategoryIcon(sub.name);
                  return (
                    <button
                      key={sub._id}
                      onClick={() => {
                        // Toggle behavior: if clicking the same sub-category, clear it
                        if (subcategory === sub.slug) {
                          setSubcategory("");
                        } else {
                          setSubcategory(sub.slug);
                        }
                        setCategory(categories.find(c => c._id === openCategory).slug);
                        // Keep panel open on desktop, close on mobile for better UX
                        if (isMobile) setMobileFiltersOpen(false);
                      }}
                      className={`inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition border
                          ${subcategory === sub.slug
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-gray-100 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-200 border-transparent hover:border-blue-200 dark:hover:border-blue-800"}`}
                    >
                      <SubIcon size={16} className={subcategory === sub.slug ? "text-white" : "text-gray-500 dark:text-gray-400"} />
                      {sub.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* DESKTOP FILTER BAR (Hidden on Mobile usually, but here we can just show it nicely) */}
        {/* We'll use the "Filters" toggle logic for desktop if desired, but let's keep it simple: 
            The toggle below controls visibility on desktop. Mobile uses the drawer.
        */}
        <div className="px-4 md:px-6 hidden lg:block">
          <button
            onClick={() => setFiltersOpen((o) => !o)}
            className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded shadow text-sm border border-transparent dark:border-gray-700"
          >
            <span className="font-semibold">Filters</span>
            <span className="text-xs text-gray-500 dark:text-gray-300">{filtersOpen ? "Hide" : "Show"}</span>
          </button>

          {filtersOpen && (
            <div className="mt-4 bg-white dark:bg-gray-800 p-4 rounded shadow flex flex-wrap gap-4 items-center border border-transparent dark:border-gray-700">
              {/* Desktop Filter Controls */}
              <select value={category} onChange={e => { setCategory(e.target.value); setSubcategory(""); }} className="input">
                <option value="">All Categories</option>
                {categories.map(c => <option key={c._id} value={c.slug}>{c.name}</option>)}
              </select>
              <select value={subcategory} onChange={e => setSubcategory(e.target.value)} className="input" disabled={!selectedCategory}>
                <option value="">All Sub-Categories</option>
                {selectedCategory?.subCategories?.map(s => <option key={s._id} value={s.slug}>{s.name}</option>)}
              </select>
              <input type="number" value={filters.maxPrice} onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))} placeholder="Max Price" className="input w-32" />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={filters.inStock} onChange={e => setFilters(f => ({ ...f, inStock: e.target.checked }))} /> In stock
              </label>
            </div>
          )}
        </div>

        {/* MOBILE FILTER DRAWER (Slide over) */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} />

            {/* Drawer */}
            <div className="absolute right-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-900 shadow-2xl p-6 overflow-y-auto animate-slide-in-right">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Filters</h2>
                <button onClick={() => setMobileFiltersOpen(false)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">✕</button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold mb-2">Category</label>
                  <select value={category} onChange={e => { setCategory(e.target.value); setSubcategory(""); }} className="w-full input">
                    <option value="">All Categories</option>
                    {categories.map(c => <option key={c._id} value={c.slug}>{c.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Sub-Category</label>
                  <select value={subcategory} onChange={e => setSubcategory(e.target.value)} className="w-full input" disabled={!selectedCategory}>
                    <option value="">All Sub-Categories</option>
                    {selectedCategory?.subCategories?.map(s => <option key={s._id} value={s.slug}>{s.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Max Price</label>
                  <input type="number" value={filters.maxPrice} onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))} placeholder="Any" className="w-full input" />
                </div>

                <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <input type="checkbox" checked={filters.inStock} onChange={e => setFilters(f => ({ ...f, inStock: e.target.checked }))} className="w-5 h-5" />
                  <span className="font-medium">In Stock Only</span>
                </label>

                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl mt-4"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* POPULAR RETAILERS - Only show when browsing All */}
        {!category && sellers.length > 0 && (
          <section>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 px-4 md:px-6">Popular Retailers</h2>
            <div className="flex gap-6 overflow-x-auto pb-4 px-4 md:px-6 scrollbar-hide">
              {sellers.map((s) => (
                <SellerCard key={s._id} seller={s} requireLogin={false} />
              ))}
            </div>
          </section>
        )}

        {/* DEALS IN FOOD-GROCERY */}
        {isBrowsingAll && categories.find(c => c.name === "Food-Grocery" || c.slug === "food-grocery") && (
          <div className="mb-8">
            <CategoryRow
              title="Products in Food-Grocery"
              categoryId={categories.find(c => c.name === "Food-Grocery" || c.slug === "food-grocery").slug}
              banner={Grocery}
            />
          </div>
        )}

        {/* DEALS IN VEGETABLES */}
        {isBrowsingAll && categories.find(c => c.name === "Vegetable and Fruits" || c.slug === "vegetable-and-fruits") && (
          <div className="mb-8">
            <CategoryRow
              title="Products in Vegetable and Fruits"
              categoryId={categories.find(c => c.name === "Vegetable and Fruits" || c.slug === "vegetable-and-fruits").slug}
              banner={Grocery}
            />
          </div>
        )}



        {/* ALL PRODUCTS GRID */}
        <section>
          <div className="flex items-center justify-between mb-4 px-4 md:px-6">
            <h2 className="text-xl sm:text-2xl font-bold">All Products</h2>
          </div>

          {loadingProducts ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 px-4 md:px-6">
              {[...Array(8)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="px-4 md:px-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                {products
                  .slice(0, isExpanded ? products.length : (isMobile ? 8 : 6))
                  .map((p) => (
                    <ProductCard key={p._id} product={p} />
                  ))}
              </div>

              {/* Show All / Show Less Button */}
              {products.length > (isMobile ? 8 : 6) && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-md transition-all flex items-center gap-2"
                  >
                    {isExpanded ? (
                      <>Show Less <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></>
                    ) : (
                      <>Show All <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></>
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400">No products found.</div>
          )}
        </section>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 pt-10">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded bg-white dark:bg-gray-800 border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-600 dark:text-gray-300 font-medium">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded bg-white dark:bg-gray-800 border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {/* MORE DEALS (Footer) */}
        {isBrowsingAll && (
          <div className="space-y-6 pt-12 border-t border-gray-200 dark:border-gray-700 pb-8 mb-8">
            {categories
              .filter(cat =>
                cat.name !== "Food-Grocery" && cat.slug !== "food-grocery" &&
                cat.name !== "Vegetable and Fruits" && cat.slug !== "vegetable-and-fruits"
              )
              .map((cat) => (
                <CategoryRow
                  key={cat._id}
                  title={`Products in ${cat.name}`}
                  categoryId={cat.slug}
                  banner={categoryBanners[cat.slug] || categoryBanners[cat.name]}
                />
              ))}
          </div>
        )}
      </div>

      {/* Global Styles */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fade-in-down { 0% { opacity: 0; transform: translateY(-10px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-down { animation: fade-in-down 0.3s ease-out; }
        @keyframes slide-in-right { 0% { transform: translateX(100%); } 100% { transform: translateX(0); } }
        .animate-slide-in-right { animation: slide-in-right 0.3s ease-out; }
      `}</style>
    </div>
  );
}
