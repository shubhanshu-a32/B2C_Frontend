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

// Copied CategoryRow from Landing.jsx for reuse
function CategoryRow({ title, categoryId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { location: geoLocation } = useGeoLocation();

  useEffect(() => {
    setLoading(true);
    const params = { category: categoryId, limit: 8 };
    if (geoLocation) {
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
        console.error(`Failed to load ${title}`, err);
      })
      .finally(() => setLoading(false));
  }, [categoryId, title, geoLocation]);

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
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
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
          <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory scroll-smooth">
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
  const [limit] = useState(12);

  const [filters, setFilters] = useState({
    q: initialQ,
    maxPrice: "",
    inStock: false,
  });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const [openCategory, setOpenCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);


  const selectedCategory = categories.find(c => c._id === category || c.slug === category);

  // Check if any filters are active (to hide the deal sections)
  const isBrowsingAll = !category && !subcategory && !initialQ && !filters.q && !filters.maxPrice && !filters.inStock;

  const handleSubCategoryClick = (cat, sub) => {
    setCategory(cat.slug);
    setSubcategory(sub.slug);
    setOpenCategory(null); // Close the panel
  };

  useEffect(() => {
    // Always sync with location state. If null/undefined, reset to empty (All Products).
    setCategory(location.state?.category || "");
    setSubcategory(location.state?.subcategory || "");
  }, [location.state]);

  useEffect(() => {
    // Reset page to 1 on filter change
    setPage(1);
  }, [category, subcategory, filters, geoLocation]);

  // Fetch Sellers
  useEffect(() => {
    api.get("/seller/profile/list")
      .then((res) => setSellers(res.data))
      .catch((err) => console.error("Failed to load sellers", err));
  }, []);

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      if (geoLocation) {
        params.pincode = geoLocation.pincode;
        params.area = geoLocation.area;
      }

      const res = await api.get("/products", { params });
      // Small delay to prevent flicker if fast? No, skeletons are fine.

      if (!res.data.data.length && page === 1) {
        const hasActiveFilter =
          filters.q.trim().length >= 3 ||
          !!category ||
          !!subcategory ||
          !!filters.maxPrice ||
          filters.inStock ||
          !!geoLocation; // Also notify if location filter returns nothing
        if (hasActiveFilter) toast("Product not available");
      }

      setProducts(res.data.data);
      setTotalPages(res.data.pages || 1);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoadingProducts(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-full mx-auto">
      {/* HERO SLIDER */}
      <div className="rounded-xl overflow-hidden shadow-lg">
        <ImageSlider />
      </div>

      {/* EXPLORE CATEGORIES - Copied from Landing */}
      <section>
        <h2 className="text-xl font-bold mb-4">
          Explore Categories
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 pb-4">
          <button
            onClick={() => {
              setCategory("");
              setSubcategory("");
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
                    onClick={() => {
                      setSubcategory(sub.slug);
                      setCategory(categories.find(c => c._id === openCategory).slug);
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
        className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded shadow text-sm border border-transparent dark:border-gray-700"
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
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow flex flex-wrap gap-4 items-center border border-transparent dark:border-gray-700">
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
              <option key={c._id} value={c.slug}>{c.name}</option> // Use slug as value for easier API matching
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
              <option key={s._id} value={s.slug}>{s.name}</option>
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

      {/* POPULAR RETAILERS (Moved from Bottom) */}
      {sellers.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Popular Retailers</h2>
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {sellers.map((s) => (
              <SellerCard key={s._id} seller={s} requireLogin={false} />
            ))}
          </div>
        </section>
      )}


      {/* PRODUCTS */}
      <div className="flex gap-3 sm:gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory scroll-smooth">
        {loadingProducts ? (
          [...Array(8)].map((_, i) => (
            <div key={i} className="min-w-[calc(50%-6px)] w-[calc(50%-6px)] sm:min-w-[280px] sm:w-[280px] snap-start">
              <ProductSkeleton />
            </div>
          ))
        ) : (
          products.map((p) => (
            <div key={p._id} className="min-w-[calc(50%-6px)] w-[calc(50%-6px)] sm:min-w-[280px] sm:w-[280px] snap-start">
              <ProductCard product={p} />
            </div>
          ))
        )}
      </div>

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
          <span className="text-gray-600 dark:text-gray-300 font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded bg-white dark:bg-gray-800 border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* DEAL SECTIONS - Only visible if no specific filters are applied */}
      {isBrowsingAll && (
        <div className="space-y-6 pt-12 border-t border-gray-200 dark:border-gray-700 pb-8 mb-8">
          {categories.map((cat) => (
            <CategoryRow
              key={cat._id}
              title={`Deals in ${cat.name}`}
              categoryId={cat.slug}
            />
          ))}
        </div>
      )}


    </div>
  );
}

const styles = `
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
`;

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

