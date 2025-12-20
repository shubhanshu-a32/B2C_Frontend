import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Pagination from "../../components/ui/Pagination";
import toast from "react-hot-toast";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    load();
  }, [page]);

  const load = async () => {
    const { data } = await api.get("/products", {
      params: { page, limit: 10 },
    });
    setProducts(data.data);
    setPages(data.pages);
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

      <div className="space-y-4">
        {products.map((p) => (
          <div
            key={p._id}
            className="bg-white dark:bg-gray-800 p-4 shadow rounded flex justify-between items-center"
          >
            <div>
              <p className="dark:text-white font-semibold text-lg">{p.title}</p>
              <p className="dark:text-gray-400 text-gray-600">{p.category}</p>
              <p className="dark:text-white font-bold">₹{p.price}</p>
              <p className="dark:text-gray-400 text-sm text-gray-700">Stock left: {p.stock ?? 0}</p>
            </div>

            <div className="flex gap-3">
              <Link
                to={`/seller/edit-product/${p._id}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Edit
              </Link>

              <button
                onClick={() => deleteProduct(p._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <Pagination page={page} pages={pages} onPageChange={setPage} />
    </div>
  );
}