import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { CATEGORIES } from "../../constants/categories";
import ProductCard from "../../components/ProductCard";
import toast from "react-hot-toast";

export default function Shop() {
  const location = useLocation();
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(location.search);
  const initialQ = urlParams.get("q") || "";

  const [category, setCategory] = useState(location.state?.category || "");
  const [subcategory, setSubcategory] = useState(location.state?.subcategory || "");
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    q: initialQ,
    maxPrice: "",
    inStock: false,
  });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const selectedCategory = CATEGORIES.find(c => c.id === category);

  useEffect(() => {
    loadProducts();
  }, [category, subcategory, filters]);

  const loadProducts = async () => {
    try {
      const res = await api.get("/products", {
        params: {
          ...(filters.q && { q: filters.q }),
          ...(category && { category }),
          ...(subcategory && { subcategory }),
          ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
          ...(filters.inStock && { inStock: true }),
        },
      });

      if (!res.data.data.length) {
        // Only show "Product not available" when user has actually applied some filter/search,
        // not on every initial load.
        const hasActiveFilter =
          filters.q.trim().length >= 3 ||
          !!category ||
          !!subcategory ||
          !!filters.maxPrice ||
          filters.inStock;
        if (hasActiveFilter) {
          toast("Product not available");
        }
      }

      setProducts(res.data.data);
    } catch {
      toast.error("Failed to load products");
    }
  };

  return (
    <div className="p-6 space-y-6">

      {/* SEARCH BAR + INLINE CANVAS (always visible on /buyer/shop) */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-2">
        <input
          type="text"
          value={filters.q}
          onChange={(e) => {
            const value = e.target.value;
            setFilters((f) => ({ ...f, q: value }));

            const term = value.trim().toLowerCase();
            if (!term) {
              setSuggestions([]);
            } else {
              const productTitles = products
                .filter((p) => p.title?.toLowerCase().includes(term))
                .map((p) => p.title);

              const subTitles = [];
              CATEGORIES.forEach((c) => {
                c.subs.forEach((s) => {
                  if (s.title.toLowerCase().includes(term)) {
                    subTitles.push(s.title);
                  }
                });
              });

              const unique = Array.from(
                new Set([...subTitles, ...productTitles])
              );
              setSuggestions(unique.slice(0, 8));
            }
          }}
          placeholder="Search products or sub-category"
          className="input w-full"
        />

        {filters.q.trim() && suggestions.length > 0 && (
          <div className="w-full bg-white dark:bg-gray-900 border dark:border-gray-700 rounded p-2 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => {
                  // If suggestion matches a sub-category title, set category + subcategory filters.
                  let matchedSub = null;
                  let matchedCatId = "";
                  CATEGORIES.forEach((c) => {
                    c.subs.forEach((sub) => {
                      if (!matchedSub && sub.title === s) {
                        matchedSub = sub;
                        matchedCatId = c.id;
                      }
                    });
                  });

                  if (matchedSub) {
                    setCategory(matchedCatId);
                    setSubcategory(matchedSub.id);
                    setFilters((f) => ({ ...f, q: "" }));
                  } else {
                    setFilters((f) => ({ ...f, q: s }));
                  }

                  setTimeout(() => loadProducts(), 0);
                }}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* FILTER TOGGLE */}
      <button
        onClick={() => setFiltersOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded shadow text-sm"
        aria-expanded={filtersOpen}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M3 5.25A.75.75 0 0 1 3.75 4.5h16.5a.75.75 0 0 1 .53 1.28L15 11.56v6.69a.75.75 0 0 1-1.16.62l-3-2.1a.75.75 0 0 1-.32-.62v-4.59L3.22 5.78A.75.75 0 0 1 3 5.25Z" />
        </svg>
        <span className="font-semibold">Filters</span>
        <span className="text-xs text-gray-500 dark:text-gray-300">
          {filtersOpen ? "Hide" : "Show"}
        </span>
      </button>

      {/* FILTERS (collapsed by default) */}
      {filtersOpen && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow flex flex-wrap gap-4 items-center">
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setSubcategory("");
            }}
            className="input"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>

          <select
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            className="input"
            disabled={!selectedCategory}
          >
            <option value="">All Sub-Categories</option>
            {selectedCategory?.subs.map((s) => (
              <option key={s.id} value={s.id}>{s.title}</option>
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

      {/* PRODUCTS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
}


// // src/pages/buyer/Shop.jsx
// import { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import api from "../../services/api";
// import ProductCard from "../../components/ProductCard";
// import toast from "react-hot-toast";

// export default function Shop() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const category = location.state?.category;
//   const subcategory = location.state?.subcategory;

//   const [products, setProducts] = useState([]);
//   const [filters, setFilters] = useState({
//     maxPrice: "",
//     inStock: false,
//   });

//   useEffect(() => {
//     loadProducts();
//   }, [category, subcategory, filters]);

//   const loadProducts = async () => {
//     try {
//       const res = await api.get("/products", {
//         params: {
//           category,
//           subcategory,
//           ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
//           ...(filters.inStock && { inStock: true }),
//         },
//       });

//       if (!res.data.data.length) {
//         toast("Product not available");
//       }

//       setProducts(res.data.data);
//     } catch {
//       toast.error("Failed to load products");
//     }
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <h2 className="text-3xl font-bold capitalize">
//         {subcategory || category || "Shop"}
//       </h2>

//       {/* FILTERS – visible to all users */}
//       <div className="bg-white dark:bg-gray-800 p-4 rounded shadow flex gap-4">
//         <input
//           type="number"
//           placeholder="Max Price"
//           className="border p-2 rounded"
//           onChange={(e) =>
//             setFilters({ ...filters, maxPrice: e.target.value })
//           }
//         />

//         <label className="flex items-center gap-2">
//           <input
//             type="checkbox"
//             onChange={(e) =>
//               setFilters({ ...filters, inStock: e.target.checked })
//             }
//           />
//           In stock
//         </label>
//       </div>

//       {/* PRODUCTS */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//         {products.map((p) => (
//           <ProductCard key={p._id} product={p} />
//         ))}
//       </div>
//     </div>
//   );
// }
