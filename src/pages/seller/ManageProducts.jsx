import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Pagination from "../../components/ui/Pagination";
import toast from "react-hot-toast";
import { Star } from "lucide-react";
import ProductSkeleton from "../../components/ui/preloaders/ProductSkeleton";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, [page]);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/products/seller/me", {
        params: { page, limit: 10 },
      });
      setProducts(data.data);
      setPages(data.pages);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;

    await api.delete(`/products/${id}`);
    toast.error("Product deleted!")
    load();
  };

  return (
    <div>
      <h2 className="dark:text-gray-100 text-3xl font-bold mb-6">Manage Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          [...Array(8)].map((_, i) => <ProductSkeleton key={i} />)
        ) : (
          products.map((p) => (
            <div
              key={p._id}
              className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:-translate-y-1"
            >
              {/* Image Container */}
              <div className="relative h-48 w-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                {p.images?.length > 0 ? (
                  <img
                    src={p.images[0]}
                    alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <span className="text-sm">No Image</span>
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${(p.stock ?? 0) > 0
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                    {(p.stock ?? 0) > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="mb-2">
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    {p.category}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1" title={p.title}>
                  {p.title}
                </h3>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    ₹{p.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Stock: {p.stock ?? 0}
                  </span>
                </div>

                {/* Rating Info */}
                <div className="flex items-center gap-1.5 mb-4 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-1.5 py-0.5 rounded text-xs font-bold">
                    {p.rating?.toFixed(1) || 0} <Star size={10} className="ml-0.5 fill-current" />
                  </div>
                  <span className="text-xs text-gray-400">({p.numReviews || 0} reviews)</span>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <Link
                    to={`/seller/edit-product/${p._id}`}
                    className="flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteProduct(p._id)}
                    className="flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Pagination page={page} pages={pages} onPageChange={setPage} />
    </div >
  );
}