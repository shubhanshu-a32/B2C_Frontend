import { useEffect, useState } from "react";
import api from "../../services/api";
import useAuthStore from "../../store/authStore";

export default function BuyerDashboard() {
  const authUser = useAuthStore((s) => s.user);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data } = await api.get("/orders");
      let total = 0;
      data.data.forEach((o) => (total += o.totalAmount));
      setStats({
        totalOrders: data.data.length,
        totalSpent: total,
      });
    } catch (err) {
      // console.error(err);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">
        Welcome {authUser?.fullName || "Buyer"}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-6 bg-white shadow rounded-lg">
          <h3 className="dark:text-gray-600 text-xl font-semibold">Total Orders</h3>
          <p className="dark:text-gray-600 text-3xl font-bold mt-2">{stats.totalOrders}</p>
        </div>

        <div className="p-6 bg-white shadow rounded-lg">
          <h3 className="dark:text-gray-600 text-xl font-semibold">Total Spent</h3>
          <p className="dark:text-gray-600 text-3xl font-bold mt-2">₹{stats.totalSpent}</p>
        </div>
      </div>
    </div>
  );
}