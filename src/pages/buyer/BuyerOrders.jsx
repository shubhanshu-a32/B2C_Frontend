import { useEffect, useState } from "react";
import api from "../../services/api";

export default function BuyerOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const { data } = await api.get("/orders");
    setOrders(data.data);
  };

  return (
    <div>
      <h2 className="dark:text-gray-200 text-3xl font-bold mb-6">Your Orders</h2>

      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o._id} className="dark:text-gray-900 bg-white p-4 rounded-lg shadow">
            <p className="font-semibold">Order #{o._id}</p>
            <p>Status: {o.status}</p>
            <p>Total: ₹{o.totalAmount}</p>
          </div>
        ))}
      </div>
    </div>
  );
}