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

// Category Row Component (Internal)
function CategoryRow({ title, categoryId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    setLoading(true);
    api.get("/products", {
      params: { category: categoryId, limit: 8 }
    })
      .then((res) => {
        setProducts(res.data.data);
      })
      .catch((err) => {
        console.error(`Failed to load ${title}`, err);
      })
      .finally(() => setLoading(false));
  }, [categoryId, title]);

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
          <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory scroll-smooth">
            {products.map((p) => (
              <div key={p._id} className="min-w-[280px] w-[280px] snap-start">
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
  const [sellers, setSellers] = useState([]);
  /* Pagination State */
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(8);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Fetch Sellers
  useEffect(() => {
    api.get("/seller/profile/list")
      .then((res) => setSellers(res.data))
      .catch((err) => console.error("Failed to load sellers", err));
  }, []);

  // Fetch Featured Products for Slider
  useEffect(() => {
    setLoadingProducts(true);
    api.get("/products", {
      params: { page, limit }
    })
      .then((res) => {
        setProducts(res.data.data);
        setTotalPages(res.data.pages);
      })
      .catch((err) => {
        console.error("Failed to load featured products", err);
      })
      .finally(() => setLoadingProducts(false));
  }, [page, limit]);

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

          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            <button
              onClick={() => navigate("/shop")}
              className="flex-shrink-0 px-6 py-3 rounded-full border transition whitespace-nowrap font-medium bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setOpenCategory(openCategory === cat._id ? null : cat._id)}
                className={`flex-shrink-0 px-6 py-3 rounded-full border transition whitespace-nowrap font-medium
                  ${openCategory === cat._id
                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Subcategories Expansion Panel */}
          {openCategory && (
            <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow border dark:border-gray-700 animate-fade-in-down">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                Subcategories
              </h3>
              <div className="flex flex-wrap gap-3">
                {categories.find(c => c._id === openCategory)?.subCategories?.map((sub) => (
                  <button
                    key={sub._id}
                    onClick={() => openSubCategory(categories.find(c => c._id === openCategory), sub)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-sm rounded-lg transition"
                  >
                    {sub.name}
                  </button>
                ))}
                {(!categories.find(c => c._id === openCategory)?.subCategories?.length) && (
                  <span className="text-gray-400 text-sm">No subcategories</span>
                )}
              </div>
            </div>
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
            <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory scroll-smooth">
              {products.map((p) => (
                <div key={p._id} className="min-w-[280px] w-[280px] snap-start">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400">No products found.</div>
          )}
        </section>

        {/* DYNAMIC DEALS SECTIONS */}
        <div className="space-y-12">
          {categories.map((cat) => (
            <CategoryRow
              key={cat._id}
              title={`Deals in ${cat.name}`}
              categoryId={cat.slug}
            />
          ))}
        </div>

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
