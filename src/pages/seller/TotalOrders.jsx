import { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";

export default function TotalOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            // Assuming listOrdersByUser handles seller logic
            const res = await api.get("/orders?limit=100");
            setOrders(res.data.data || []);
        } catch (err) {
            console.error("Failed to fetch orders", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading orders...</div>;

    return (
        <div className="max-w-6xl mx-auto p-4 space-y-6 dark:text-gray-100">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Total Orders</h1>
                <Link to="/seller/dashboard" className="text-blue-600 hover:underline">
                    Back to Dashboard
                </Link>
            </div>

            {orders.length === 0 ? (
                <div className="p-8 text-center bg-white dark:bg-gray-800 rounded shadow">
                    No orders found.
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white dark:bg-gray-800 p-6 rounded shadow border dark:border-gray-700">
                            <div className="flex flex-col md:flex-row justify-between gap-4 mb-4 border-b dark:border-gray-700 pb-4">
                                <div>
                                    <div className="text-sm text-gray-500">Order ID</div>
                                    <div className="font-mono font-bold text-sm">{order._id}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Date</div>
                                    <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Status</div>
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${order.orderStatus === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                            order.orderStatus === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {order.orderStatus}
                                    </span>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Total Amount</div>
                                    <div className="font-bold">₹{order.totalAmount}</div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Buyer Details */}
                                <div>
                                    <h3 className="font-semibold mb-2 text-lg">Customer Details</h3>
                                    <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                        <p><span className="font-semibold">Name:</span> {order.buyer?.fullName || "Guest"}</p>
                                        <p><span className="font-semibold">Mobile:</span> {order.buyer?.mobile || "N/A"}</p>
                                        <p><span className="font-semibold">Address:</span></p>
                                        <p className="pl-2 border-l-2 border-gray-300">{order.address?.fullAddress || "No address provided"}</p>
                                    </div>
                                </div>

                                {/* Items */}
                                <div>
                                    <h3 className="font-semibold mb-2 text-lg">Items Ordered</h3>
                                    <ul className="space-y-2">
                                        {order.items.map((item, idx) => (
                                            <li key={idx} className="flex items-center gap-3 text-sm">
                                                <span className="font-bold text-gray-500">x{item.quantity}</span>
                                                <span>{item.product?.title || "Unknown Product"}</span>
                                                <span className="text-gray-500 ml-auto">₹{item.price * item.quantity}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
