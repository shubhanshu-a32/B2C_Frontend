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

// Category Row Component (Internal)
function CategoryRow({ title, categoryId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { location: geoLocation } = useGeoLocation();

  useEffect(() => {
    setLoading(true);
    const params = { category: categoryId, limit: 8 };
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

  if (!loading && products.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4 px-4 md:px-6">
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
        <div className="flex gap-6 overflow-hidden px-4 md:px-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="min-w-[280px]">
              <ProductSkeleton />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="flex gap-6 overflow-x-auto pb-6 px-4 md:px-6 scrollbar-hide snap-x snap-mandatory scroll-smooth">
            {products.map((p) => (
              <div key={p._id} className="min-w-[calc(50%-6px)] w-[calc(50%-6px)] sm:min-w-[280px] sm:w-[280px] snap-start">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <button
              onClick={() => navigate("/shop", { state: { category: categoryId } })}
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

  // Mobile Filter Drawer State
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Desktop Filter Toggle (kept for backward compatibility, but effectively always visible on desktop usually)
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [openCategory, setOpenCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const selectedCategory = categories.find(c => c._id === category || c.slug === category);

  // Check if any filters are active
  const isBrowsingAll = !category && !subcategory && !initialQ && !filters.q && !filters.maxPrice && !filters.inStock;

  useEffect(() => {
    // Always sync with location state. If null/undefined, reset to empty.
    setCategory(location.state?.category || "");
    setSubcategory(location.state?.subcategory || "");
  }, [location.state]);

  useEffect(() => {
    setPage(1);
  }, [category, subcategory, filters, geoLocation]);

  // Fetch Sellers
  useEffect(() => {
    const sellerParams = {};
    if (geoLocation && geoLocation.area !== "Katni") {
      sellerParams.pincode = geoLocation.pincode;
      sellerParams.area = geoLocation.area;
    }
    api.get("/seller/profile/list", { params: sellerParams })
      .then((res) => setSellers(res.data))
      .catch(() => { });
  }, [geoLocation]);

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

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 pb-4 px-4 md:px-6">
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
                  <Icon className="w-8 h-8 sm:w-10 sm:h-10 mb-0.5" />
                  <span className="text-[10px] sm:text-xs font-medium text-center leading-tight px-0.5 truncate w-full">{cat.name}</span>
                </button>
              );
            })}
          </div>

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
                        setSubcategory(sub.slug);
                        setCategory(categories.find(c => c._id === openCategory).slug);
                        setOpenCategory(null);
                        setMobileFiltersOpen(false); // Close mobile drawer if open
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

        {/* POPULAR RETAILERS */}
        {sellers.length > 0 && (
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
              title="Deals in Food-Grocery"
              categoryId={categories.find(c => c.name === "Food-Grocery" || c.slug === "food-grocery").slug}
            />
          </div>
        )}

        {/* DEALS IN VEGETABLES */}
        {isBrowsingAll && categories.find(c => c.name === "Vegetable and Fruits" || c.slug === "vegetable-and-fruits") && (
          <div className="mb-8">
            <CategoryRow
              title="Deals in Vegetable and Fruits"
              categoryId={categories.find(c => c.name === "Vegetable and Fruits" || c.slug === "vegetable-and-fruits").slug}
            />
          </div>
        )}

        {/* ALL PRODUCTS GRID */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold mb-4 px-4 md:px-6">All Products</h2>
          <div className="flex gap-3 sm:gap-6 overflow-x-auto pb-6 px-4 md:px-6 scrollbar-hide snap-x snap-mandatory scroll-smooth">
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
                  title={`Deals in ${cat.name}`}
                  categoryId={cat.slug}
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
