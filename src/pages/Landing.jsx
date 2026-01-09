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

import { LayoutGrid } from "lucide-react";
import { categoryIcons, DefaultCategoryIcon, getSubCategoryIcon } from "../constants/categoryIcons";

// Category Row Component (Internal)
function CategoryRow({ title, categoryId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { location } = useLocation();

  useEffect(() => {
    setLoading(true);
    const params = { category: categoryId, limit: 8 };
    if (location) {
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
        console.error(`Failed to load ${title}`, err);
      })
      .finally(() => setLoading(false));
  }, [categoryId, title, location]);

  if (!loading && products.length === 0) {
    return (
      <section className="py-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">{title}</h2>
        <div className="flex justify-center items-center py-10 bg-gray-50 dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 font-medium">No product available</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
        {/* Only show "View All" if there are products? Or always? Usually if there are products. */}
        {products.length > 0 && (
          <button
            onClick={() => navigate("/shop", { state: { category: categoryId } })}
            className="text-blue-600 hover:underline text-sm font-semibold"
          >
            View All
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex gap-6 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="min-w-[280px]">
              <ProductSkeleton />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="flex gap-3 sm:gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory scroll-smooth">
            {products.map((p) => (
              <div key={p._id} className="min-w-[calc(50%-6px)] w-[calc(50%-6px)] sm:min-w-[280px] sm:w-[280px] snap-start">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
          {/* Centered Explore Button for Section */}
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
      )}
    </section>
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
  const [limit] = useState(8);
  const { location } = useLocation();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Fetch Sellers (Filtered by Location)
  useEffect(() => {
    const sellerParams = {};
    if (location) {
      sellerParams.pincode = location.pincode;
      sellerParams.area = location.area;
    }

    api.get("/seller/profile/list", { params: sellerParams })
      .then((res) => setSellers(res.data))
      .catch((err) => console.error("Failed to load sellers", err));
  }, [location]);

  // Fetch Featured Products for Slider
  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [category, subcategory, filters, location]);

  // Fetch Featured Products for Slider
  useEffect(() => {
    setLoadingProducts(true);

    const params = {
      page,
      limit
    };

    if (filters.q) params.q = filters.q;
    if (category) params.category = category;
    if (subcategory) params.subcategory = subcategory;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.inStock) params.inStock = true;

    if (location) {
      params.pincode = location.pincode;
      params.area = location.area;
    }

    console.log("Fetching landing products with params:", params);

    api.get("/products", {
      params
    })
      .then((res) => {
        setProducts(res.data.data);
        setTotalPages(res.data.pages);
      })
      .catch((err) => {
        console.error("Failed to load featured products", err);
      })
      .finally(() => setLoadingProducts(false));
  }, [page, limit, location, category, subcategory, filters]);

  const openSubCategory = (cat, sub) => {
    navigate("/shop", {
      state: { category: cat.slug, subcategory: sub.slug },
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <NavBar />

      <main className="flex-1 w-full mx-auto px-4 py-6 space-y-12">

        {/* IMAGE SLIDER */}
        <ImageSlider />

        {/* CATEGORY SECTION - HORIZONTAL SCROLL */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
            Explore Categories
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 pb-4">
            <button
              onClick={() => navigate("/shop")}
              className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg border transition bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 h-full w-full"
            >
              <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6 mb-0.5 text-blue-600" />
              <span className="text-[10px] sm:text-xs font-medium text-center leading-none">All</span>
            </button>
            {categories.map((cat) => {
              const Icon = categoryIcons[cat.name.toLowerCase()] || categoryIcons[cat.slug?.toLowerCase()] || DefaultCategoryIcon;
              return (
                <button
                  key={cat._id}
                  onClick={() => setOpenCategory(openCategory === cat._id ? null : cat._id)}
                  className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg border transition h-full w-full
                    ${openCategory === cat._id
                      ? "bg-blue-600 text-white border-blue-600 shadow-md"
                      : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 mb-0.5" />
                  <span className="text-[10px] sm:text-xs font-medium text-center leading-tight px-0.5 truncate w-full">{cat.name}</span>
                </button>
              );
            })}
          </div>

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
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-sm rounded-lg transition border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                    >
                      <SubIcon size={16} className="text-gray-500 dark:text-gray-400" />
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

        {/* POPULAR RETAILERS */}
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

        {/* FEATURED PRODUCTS - SLIDEABLE */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold">Featured Products</h2>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
              <button onClick={() => navigate("/shop")} className="text-blue-600 hover:underline text-sm font-semibold">View All</button>
            </div>
          </div>

          {loadingProducts ? (
            <div className="flex gap-6 overflow-hidden">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="min-w-[280px]">
                  <ProductSkeleton />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="flex gap-3 sm:gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory scroll-smooth">
              {products.map((p) => (
                <div key={p._id} className="min-w-[calc(50%-6px)] w-[calc(50%-6px)] sm:min-w-[280px] sm:w-[280px] snap-start">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400">No products found.</div>
          )}
        </section>

        {/* DYNAMIC DEALS SECTIONS */}
        {isBrowsingAll && (
          <div className="space-y-12">
            {categories.map((cat) => (
              <CategoryRow
                key={cat._id}
                title={`Deals in ${cat.name}`}
                categoryId={cat.slug}
              />
            ))}
          </div>
        )}


      </main>
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
