import { useEffect, useState } from "react";
import api from "../../services/api";
import useAuthStore from "../../store/authStore";
import { Link } from "react-router-dom";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  ResponsiveContainer
} from "recharts";

export default function SellerDashboard() {
  const { user } = useAuthStore();

  const [summary, setSummary] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    productsCount: 0,
  });

  const [graph, setGraph] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const summaryRes = await api.get("/seller/analytics/summary");
      setSummary(summaryRes.data);

      const graphRes = await api.get("/seller/analytics/graph");
      setGraph(graphRes.data);

      const topRes = await api.get("/seller/analytics/top-products");
      setTopProducts(topRes.data);
    } catch (err) {
      console.error("Error loading dashboard:", err);
    }
  };

  return (
    <div className="dark:text-gray-600 space-y-8">
      {/* Greeting */}
      <div>
        <h2 className="text-gray-100 text-3xl font-bold">
          Welcome {user?.shopName || "Seller"}
        </h2>
        <p className="text-gray-100 text-sm">
          Owner: {user?.ownerName || ""}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="dark:text-gray-700 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link to="/seller/dashboard/total-orders" className="p-6 bg-white rounded shadow hover:shadow-md transition cursor-pointer block">
          <div className=" text-gray-500">Total Orders</div>
          <div className="text-3xl font-bold">{summary.totalOrders}</div>
        </Link>

        <div className="p-6 bg-white rounded shadow">
          <div className="text-gray-500">Total Revenue</div>
          <div className="text-3xl font-bold">₹{summary.totalRevenue}</div>
        </div>

        <div className="p-6 bg-white rounded shadow">
          <div className="text-gray-500">Products Listed</div>
          <div className="text-3xl font-bold">{summary.productsCount}</div>
        </div>
      </div>

      {/* Sales Line Graph */}
      <div className="p-6 bg-white rounded shadow">
        <h3 className="font-semibold mb-2">Sales Over Time</h3>
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={graph}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#2563eb" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products Bar Graph */}
      <div className="p-6 bg-white rounded shadow">
        <h3 className="font-semibold mb-2">Top Products</h3>
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sold" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}