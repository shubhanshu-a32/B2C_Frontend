import { useEffect, useState } from "react";
import api from "../../services/api";
import { ArrowDownTrayIcon, StarIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

export default function BuyerOrders() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    loadOrders();
  }, [page]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/orders", {
        params: { page, limit: 10 }
      });
      // The backend now returns standard pagination object: { data: [...], pages: N, ... }
      setOrders(data.data || []);
      setTotalPages(data.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // derived stats from current data (approximated for now as per dashboard logic)
  const totalOrdersCount = orders.length;
  const [stats, setStats] = useState({ totalOrders: 0, totalSpent: 0 });

  useEffect(() => {
    // Fetch stats from backend aggregation
    api.get("/orders/stats")
      .then(({ data }) => {
        setStats({
          totalOrders: data.totalOrders || 0,
          totalSpent: data.totalSpent || 0
        });
      })
      .catch(err => console.error("Failed to load stats", err));
  }, []);

  const statusColor = (status) => {
    switch (status) {
      case "PLACED": return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
      case "PACKED": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "SHIPPED": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      case "DELIVERED": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "CANCELLED": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const handleDownloadInvoice = async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}/invoice`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Failed to download invoice", err);
      // alert("Failed to download invoice");
      toast.error("Failed to download invoice");
    }
  };

  const openReviewModal = (product) => {
    setSelectedProduct(product);
    setReviewModalOpen(true);
  };

  return (
    <div className="max-w-full mx-auto space-y-8 p-6">
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <h2 className="text-3xl font-bold dark:text-gray-100">Your Orders</h2>

        {/* Stats Cards */}
        <div className="flex gap-4 w-full md:w-auto">
          <div className="flex-1 md:w-40 bg-white dark:bg-gray-800 p-4 rounded-xl shadow border dark:border-gray-700">
            <p className="text-xs text-gray-500 uppercase font-bold">Total Orders</p>
            <p className="text-2xl font-bold dark:text-white">{stats.totalOrders}</p>
          </div>
          <div className="flex-1 md:w-40 bg-white dark:bg-gray-800 p-4 rounded-xl shadow border dark:border-gray-700">
            <p className="text-xs text-gray-500 uppercase font-bold">Total Spent</p>
            <p className="text-2xl font-bold dark:text-white">₹{stats.totalSpent}</p>
          </div>
        </div>
      </div>

      {loading && orders.length === 0 ? (
        <div className="text-center py-12 text-gray-500">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow border border-transparent dark:border-gray-700">
          <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-transparent dark:border-gray-700 overflow-hidden transition hover:shadow-md">

              {/* Header */}
              <div className="bg-gray-50 dark:bg-gray-900 border-b dark:border-gray-700 p-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Order Placed</span>
                  <p className="text-sm font-semibold dark:text-gray-300">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Total</span>
                  <p className="text-sm font-semibold dark:text-gray-300">
                    ₹{order.totalAmount - (order.shippingCharge || 0)} + ₹{order.shippingCharge || 0} = ₹{order.totalAmount}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Order #</span>
                  <p className="text-sm font-mono dark:text-gray-300">{order._id.slice(-6).toUpperCase()}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusColor(order.orderStatus)}`}>
                  {order.orderStatus}
                </div>

                <button
                  onClick={() => handleDownloadInvoice(order._id)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                >
                  <ArrowDownTrayIcon className="w-4 h-4" />
                  Invoice
                </button>
              </div>

              {/* Items */}
              <div className="p-4 space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg shrink-0 overflow-hidden">
                      {item.product?.images?.[0] ? (
                        <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">{item.product?.title || "Unknown Product"}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                    </div>

                    {/* Review Button */}
                    <button
                      onClick={() => openReviewModal(item.product)}
                      className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      Give Review
                    </button>

                    <div className="font-semibold text-gray-900 dark:text-gray-100 w-20 text-right">
                      ₹{item.price}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-6">
          <button
            disabled={page <= 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="px-4 py-2 rounded bg-white dark:bg-gray-800 border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            className="px-4 py-2 rounded bg-white dark:bg-gray-800 border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Review Modal */}
      {reviewModalOpen && selectedProduct && (
        <ReviewModal
          product={selectedProduct}
          onClose={() => setReviewModalOpen(false)}
        />
      )}
    </div>
  );
}

function ReviewModal({ product, onClose }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/products/${product._id}/reviews`, { rating, comment });
      toast.success("Review submitted successfully!");
      onClose();
    } catch (err) {
      console.error("Review failed", err);
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative animate-fadeIn">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <XMarkIcon className="w-6 h-6" />
        </button>

        <div className="p-6">
          <h3 className="text-xl font-bold mb-4 dark:text-white">Write a Review</h3>
          <p className="text-sm text-gray-500 mb-6 truncate">{product.title}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    {star <= rating ? (
                      <StarIconSolid className="w-8 h-8 text-yellow-400" />
                    ) : (
                      <StarIcon className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">Your Thoughts</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="What did you like or dislike?"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}