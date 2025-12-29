import useAuthStore from "../store/authStore";
import useCategoryStore from "../store/categoryStore"; // Import store
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

export default function CategoriesDrawer({ open, setOpen }) {
  const [expanded, setExpanded] = useState(null);
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  if (!open) return null;

  const goToShop = async (category, subcategory) => {
    try {
      // Check if products exist for this sub-category using the API

      const res = await api.get("/products", {
        params: { category: category?.slug || category, subcategory: subcategory?.slug || subcategory, limit: 1 }
      });

      if (!res.data.data || res.data.data.length === 0) {
        toast.error("No product available");
        // Still navigate? The original code returned.
        return;
      }

      const path = user && user.role === "buyer" ? "/buyer/shop" : "/shop";
      navigate(path, {
        state: { category: category?.slug, subcategory: subcategory?.slug },
      });
      setOpen(false);
    } catch (err) {
      console.error("Product check failed", err);
      toast.error("Could not verify product availability");
    }
  };

  return (
    <div className="fixed inset-0 z-40">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => setOpen(false)}
      />

      {/* Drawer */}
      <aside className="absolute left-0 top-[73px] bottom-0 w-80 bg-white dark:bg-gray-900 shadow-xl p-4 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            All Categories
          </h3>
          <button
            onClick={() => setOpen(false)}
            className="text-xl text-gray-600 dark:text-gray-300"
          >
            ✕
          </button>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="border-b border-gray-200 dark:border-gray-700 pb-3"
            >
              <button
                onClick={() =>
                  setExpanded(expanded === cat._id ? null : cat._id)
                }
                className="w-full flex items-center justify-between py-2 px-3"
              >
                <span className="font-bold uppercase tracking-wide">
                  {cat.name}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {expanded === cat._id ? "−" : "+"}
                </span>
              </button>

              {/* Subcategories */}
              {expanded === cat._id && (
                <div className="mt-2 pl-6 space-y-1">
                  {cat.subCategories && cat.subCategories.length > 0 ? (
                    cat.subCategories.map((sub) => (
                      <button
                        key={sub._id}
                        onClick={() => goToShop(cat, sub)}
                        className="block w-full text-left py-1 text-gray-700 dark:text-gray-300 hover:text-blue-600"
                      >
                        {sub.name}
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 italic">No subcategories</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
