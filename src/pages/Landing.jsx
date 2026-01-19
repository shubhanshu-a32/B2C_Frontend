import { useLocation } from "../context/LocationContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/Navbar";
import ImageSlider from "../components/ImageSlider";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ui/preloaders/ProductSkeleton";
import SellerCard from "../components/SellerCard";
import useAuthStore from "../store/authStore";
import useCategoryStore from "../store/categoryStore"; // Import store
import api from "../services/api";
import toast from "react-hot-toast";
import WhatsAppButton from "../components/WhatsAppButton";

import { LayoutGrid } from "lucide-react";
import { categoryIcons, DefaultCategoryIcon, getSubCategoryIcon } from "../constants/categoryIcons";
import Grocery from '../assets/hero_section/food_grocery_banner.png';
import Electronics from '../assets/hero_section/electronics.png';
import Fashion from '../assets/hero_section/fashion_banner.png';
import Electricals from '../assets/hero_section/electricals.png';
import HomeKitchen from '../assets/hero_section/home_kitchen.jpeg';
import DailyNeeds from '../assets/hero_section/daily_needs.png';
import Hardware from '../assets/hero_section/hardware_diy.png';

// Category Row Component (Internal)
function CategoryRow({ title, categoryId, banner }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { location } = useLocation();

  useEffect(() => {
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

  useEffect(() => {
    setLoading(true);
    // Fetch enough products to show a few pages (e.g., 20 = 4 pages of 5)
    const params = { category: categoryId, limit: 20 };
    if (location && location.area !== "Katni") {
      params.pincode = location.pincode;
      params.area = location.area;
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
  }, [categoryId, title, location]);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const currentProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!loading && products.length === 0) {
    return (
      <section className="py-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">{title}</h2>
        <div className="flex justify-center items-center py-10 bg-gray-50 dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
          <p className="text-gray-500">No products found in this category.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
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
        <div className="w-full h-[160px] sm:h-[250px] rounded-2xl overflow-hidden shadow-md mb-6">
          <img src={banner} alt={title} className="w-full h-full object-fill" />
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {[...Array(itemsPerPage)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {currentProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
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
          <div className="flex justify-center mt-6">
            <button
              onClick={() => {
                if (user) {
                  navigate("/buyer/shop", { state: { category: categoryId } });
                } else {
                  toast.error("Please login to explore products");
                  navigate("/login");
                }
              }}
              className="px-6 py-2 bg-white dark:bg-gray-800 border border-blue-600 text-blue-600 font-semibold rounded-full hover:bg-blue-50 dark:hover:bg-gray-700 transition shadow-sm"
            >
              Explore Products
            </button>
          </div>
        </>
      )
      }
    </section >
  );
}

export default function MainLanding() {
  const user = useAuthStore((s) => s.user);
  const { categories, fetchCategories } = useCategoryStore();
  const navigate = useNavigate();
  const [openCategory, setOpenCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  /* Filters State */
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [filters, setFilters] = useState({
    q: "",
    maxPrice: "",
    inStock: false,
  });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const selectedCategory = categories.find(c => c._id === category || c.slug === category);

  // Check if any filters are active
  const isBrowsingAll = !category && !subcategory && !filters.q && !filters.maxPrice && !filters.inStock;

  /* Sellers State */
  const [sellers, setSellers] = useState([]);

  /* Pagination State */
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(24); // Increased limit to support "Show All" expansion
  const [isExpanded, setIsExpanded] = useState(false);
  const { location } = useLocation();

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

  // Fetch Sellers (Filtered by Location and Category)
  useEffect(() => {
    const sellerParams = {};
    if (location && location.area !== "Katni") {
      sellerParams.pincode = location.pincode;
      sellerParams.area = location.area;
    }

    if (category) {
      sellerParams.category = category;
    }

    api.get("/seller/profile/list", { params: sellerParams })
      .then((res) => setSellers(res.data))
      .catch(() => { });
  }, [location, category]);

  // Fetch Featured Products for Slider
  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [category, subcategory, filters, location]);

  // Fetch Featured Products for Slider
  useEffect(() => {
    setLoadingProducts(true);
    setIsExpanded(false); // Reset expansion on fetch/filter change

    const params = {
      page,
      limit
    };

    if (filters.q) params.q = filters.q;
    if (category) params.category = category;
    if (subcategory) params.subcategory = subcategory;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.inStock) params.inStock = true;

    if (location && location.area !== "Katni") {
      params.pincode = location.pincode;
      params.area = location.area;
    }



    api.get("/products", {
      params
    })
      .then((res) => {
        setProducts(res.data.data);
        setTotalPages(res.data.pages);
      })
      .catch((err) => {
        // console.error("Failed to load featured products", err);
      })
      .finally(() => setLoadingProducts(false));
  }, [page, limit, location, category, subcategory, filters]);

  const openSubCategory = (cat, sub) => {
    // Toggle behavior: if clicking the same sub-category, clear it and show category products
    if (subcategory === sub.slug) {
      setSubcategory("");
      setCategory(cat.slug);
    } else {
      setCategory(cat.slug);
      setSubcategory(sub.slug);
    }
    // Optional: Scroll to products
    document.getElementById("all-products-section")?.scrollIntoView({ behavior: "smooth" });
  };

  // Map slugs/names to imported images
  const categoryBanners = {
    "electronics": Electronics,
    "fashion": Fashion,
    "electricals": Electricals,
    "home-and-kitchen": HomeKitchen,
    "daily-needs": DailyNeeds,
    "hardware-and-diy": Hardware,
    "hardware": Hardware, // Match simple slug
    "food-grocery": Grocery,
    // Fallback for names if slugs vary
    "Electronics": Electronics,
    "Fashion": Fashion,
    "Electricals": Electricals,
    "Home and Kitchen": HomeKitchen,
    "Daily Needs": DailyNeeds,
    "HARDWARE & DIY": Hardware,
    "Food-Grocery": Grocery,
    "Vegetable and Fruits": Grocery // Explicit match for Veg
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 pt-32">
      <NavBar />

      {/* IMAGE SLIDER - Full Width */}
      <div className="w-full">
        <ImageSlider />
      </div>

      <main className="flex-1 w-full mx-auto px-4 py-6 space-y-12">

        {/* CATEGORY SECTION */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
            Explore Categories
          </h2>

          {isMobile ? (
            /* MOBILE VIEW - Two Buttons: All + Categories Dropdown */
            <div className="flex gap-3 pb-4">
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 pb-4">
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
                <LayoutGrid className={`w-5 h-5 sm:w-6 sm:h-6 mb-0.5 ${!category ? "text-white" : "text-blue-600"}`} />
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
            <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow border dark:border-gray-700 animate-fade-in-down">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                Subcategories
              </h3>
              <div className="flex flex-wrap gap-3">
                {categories.find(c => c._id === openCategory)?.subCategories?.map((sub) => {
                  const SubIcon = getSubCategoryIcon(sub.name);
                  return (
                    <button
                      key={sub._id}
                      onClick={() => openSubCategory(categories.find(c => c._id === openCategory), sub)}
                      className={`inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition border 
                        ${subcategory === sub.slug
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-gray-100 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-200 border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                        }`}
                    >
                      <SubIcon size={16} className={subcategory === sub.slug ? "text-white" : "text-gray-500 dark:text-gray-400"} />
                      {sub.name}
                    </button>
                  );
                })}
                {(!categories.find(c => c._id === openCategory)?.subCategories?.length) && (
                  <span className="text-gray-400 text-sm">No subcategories</span>
                )}
              </div>
            </div>
          )}
        </section>



        {/* FILTER TOGGLE */}
        <button
          onClick={() => setFiltersOpen((o) => !o)}
          className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded shadow text-sm border border-transparent dark:border-gray-700 w-fit mb-4"
          aria-expanded={filtersOpen}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M3 5.25A.75.75 0 0 1 3.75 4.5h16.5a.75.75 0 0 1 .53 1.28L15 11.56v6.69a.75.75 0 0 1-1.16.62l-3-2.1a.75.75 0 0 1-.32-.62v-4.59L3.22 5.78A.75.75 0 0 1 3 5.25Z" />
          </svg>
          <span className="font-semibold">Filters</span>
          <span className="text-xs text-gray-500 dark:text-gray-300">
            {filtersOpen ? "Hide" : "Show"}
          </span>
        </button>

        {/* FILTERS (collapsed by default) */}
        {filtersOpen && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow flex flex-wrap gap-4 items-center border border-transparent dark:border-gray-700 mb-8">
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setSubcategory("");
              }}
              className="input"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>

            <select
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              className="input"
              disabled={!selectedCategory}
            >
              <option value="">All Sub-Categories</option>
              {selectedCategory?.subCategories?.map((s) => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>

            <input
              type="number"
              min="0"
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters((f) => ({ ...f, maxPrice: e.target.value }))
              }
              placeholder="Max Price"
              className="input w-32"
            />

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, inStock: e.target.checked }))
                }
              />
              In stock only
            </label>
          </div>
        )}



        {/* POPULAR RETAILERS - Only show when browsing All */}
        {!category && (
          <section>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Popular Retailers</h2>
            {sellers.length > 0 ? (
              <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                {sellers.map((s) => (
                  <SellerCard key={s._id} seller={s} requireLogin={true} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No popular retailers found.</p>
            )}
          </section>
        )}

        {/* DEALS IN FOOD-GROCERY (Specific placement) */}
        {isBrowsingAll && categories.find(c => c.name === "Food-Grocery" || c.slug === "food-grocery") && (
          <CategoryRow
            title="Products in Food-Grocery"
            categoryId={categories.find(c => c.name === "Food-Grocery" || c.slug === "food-grocery").slug}
            banner={categoryBanners["food-grocery"] || categoryBanners["Food-Grocery"]}
          />
        )}

        {/* DEALS IN VEGETABLE AND FRUITS (Specific placement above All Products) */}
        {isBrowsingAll && categories.find(c => c.name === "Vegetable and Fruits" || c.slug === "vegetable-and-fruits") && (
          <CategoryRow
            title="Products in Vegetable and Fruits"
            categoryId={categories.find(c => c.name === "Vegetable and Fruits" || c.slug === "vegetable-and-fruits").slug}
            banner={Grocery}
          />
        )}

        {/* FEATURED PRODUCTS - GRID */}
        <section>
          <div className="flex items-center justify-between mb-6" id="all-products-section">
            <h2 className="text-xl sm:text-2xl font-bold">
              {category ? `Products in ${categories.find(c => c.slug === category)?.name || 'Category'}` : 'All Products'}
            </h2>
          </div>

          {loadingProducts ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {[...Array(6)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                {/* 
                    Logic:
                    - If NOT expanded:
                      - Mobile: Show 4
                      - Desktop: Show 6
                    - If expanded: Show All
                 */}
                {products
                  .slice(0, isExpanded ? products.length : (isMobile ? 4 : 6))
                  .map((p) => (
                    <ProductCard key={p._id} product={p} />
                  ))}
              </div>

              {/* Show All / Show Less Button */}
              {products.length > (isMobile ? 4 : 6) && (
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

              {/* Keep Pagination if expanded? Or just hide it? 
                  If we have "Show All", user might expect infinite scroll or load more. 
                  But for now, let's keep the page nav if they want to see *more* than the current batch 
                  if we treat "Show All" as just expanding the *viewport*. 
                  However, user said "expand all products". 
              */}
            </>
          ) : (
            <div className="text-center py-10 text-gray-400">No products found.</div>
          )}
        </section>

        {/* DYNAMIC DEALS SECTIONS (Excluding Food-Grocery) */}
        {isBrowsingAll && (
          <div className="space-y-12">
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


      </main>

      {/* WhatsApp Floating Button */}
      <WhatsAppButton />

      <Footer />

      {/* Hide Scrollbar Style */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        @keyframes fade-in-down {
            0% { opacity: 0; transform: translateY(-10px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
            animation: fade-in-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
