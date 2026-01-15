import { useEffect, useState } from "react";
import api from "../../services/api";
import useAuthStore from "../../store/authStore";
import { Link } from "react-router-dom";
import { ShoppingBag, TrendingUp, Package, DollarSign } from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";



const COMMAS = (x) => x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

export default function SellerDashboard() {
  const { user } = useAuthStore();

  const [summary, setSummary] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    productsCount: 0,
  });

  const [graph, setGraph] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [categorySales, setCategorySales] = useState([]);

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

      const catRes = await api.get("/seller/analytics/category-sales");
      setCategorySales(catRes.data);

    } catch (err) {
      // console.error("Error loading dashboard:", err);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, to }) => {
    const Wrapper = to ? Link : "div";
    return (
      <Wrapper
        to={to}
        className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300"
      >
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${color} bg-opacity-10 dark:bg-opacity-20`}>
            <Icon size={24} className={color.replace('bg-', 'text-')} />
          </div>
          {to && <span className="text-xs text-gray-400 hover:text-blue-500">View All &rarr;</span>}
        </div>
        <h3 className="text-gray-500 dark:text-gray-400 font-medium text-sm">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
      </Wrapper>
    );
  };

  return (
    <div className="max-w-full mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Welcome back, <span className="font-semibold text-blue-600">{user?.shopName}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/seller/add-product" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            + Add Product
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Total Orders"
          value={COMMAS(summary.totalOrders)}
          icon={ShoppingBag}
          color="bg-blue-500 text-blue-600"
          to="/seller/dashboard/total-orders"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${COMMAS(summary.totalRevenue)}`}
          icon={DollarSign}
          color="bg-green-500 text-green-600"
        />
        <StatCard
          title="Active Products"
          value={summary.productsCount}
          icon={Package}
          color="bg-purple-500 text-purple-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Sales Trend */}
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-500" />
            Sales Performance
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={graph}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563EB"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#2563EB', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Top Selling Products</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E7EB" />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="title"
                  type="category"
                  width={100}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="sold" fill="#10B981" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution (New) */}
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Category Distribution</h3>
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categorySales}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="name"
                >
                  {categorySales.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  verticalAlign="bottom"
                  wrapperStyle={{ paddingTop: "20px" }}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}