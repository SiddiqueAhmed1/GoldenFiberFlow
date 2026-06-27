import { useEffect, useState } from "react";
import { useAuth } from "../Hooks/useAuth";
import { getSalesOrders } from "../Services/salesOrderService";
import { getSuppliers } from "../Services/supplierService";
import {
  ShoppingCart,
  Building2,
  TrendingUp,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const monthName = (iso) =>
  new Date(iso).toLocaleString("default", { month: "short" });

const buildMonthlyData = (orders) => {
  const map = {};
  orders.forEach((o) => {
    const m = monthName(o.createdAt);
    map[m] = (map[m] || 0) + 1;
  });
  return Object.entries(map)
    .slice(-6)
    .map(([month, count]) => ({ month, count }));
};

const PIE_COLORS = ["#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#8b5cf6"];

const StatCard = ({ icon: Icon, label, value, sub, color }) => (
  <div className="bg-white dark:bg-neutral-800/70 rounded-2xl border border-neutral-200 dark:border-neutral-700/50 p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
    <div
      className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}
    >
      <Icon size={20} className="text-white" />
    </div>
    <div className="min-w-0">
      <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
        {label}
      </p>
      <p className="text-2xl font-bold text-neutral-800 dark:text-white mt-0.5">
        {value}
      </p>
      {sub && (
        <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
          {sub}
        </p>
      )}
    </div>
  </div>
);

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 shadow-lg text-sm">
      <p className="font-semibold text-neutral-700 dark:text-neutral-200">
        {label}
      </p>
      <p className="text-amber-500 font-bold">
        {payload[0].value} sales orders
      </p>
    </div>
  );
};

const DashboardHome = () => {
  const { user } = useAuth();
  const [salesOrders, setSalesOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [orders, sups] = await Promise.all([
          getSalesOrders(),
          getSuppliers(),
        ]);
        setSalesOrders(orders || []);
        setSuppliers(sups || []);
      } catch (_) {
        /* silent */
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const total = salesOrders.length;
  const pending = salesOrders.filter((o) => o.status === "Pending").length;
  const inTransit = salesOrders.filter((o) => o.status === "In Transit").length;
  const delivered = salesOrders.filter((o) => o.status === "Delivered").length;
  const cancelled = salesOrders.filter((o) => o.status === "Cancelled").length;

  const monthlyData = buildMonthlyData(salesOrders);

  const pieData = [
    { name: "Pending", value: pending },
    { name: "In Transit", value: inTransit },
    { name: "Delivered", value: delivered },
    { name: "Cancelled", value: cancelled },
  ].filter((d) => d.value > 0);

  const recentOrders = [...salesOrders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const statusStyle = {
    Pending: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
    Confirmed: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
    "In Transit": "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    Delivered: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    Cancelled: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-96">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <section className="p-5 md:p-8 min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-white">
          {greeting()}, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-1 text-sm md:text-base">
          Here's what's happening with your sales orders today.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={ShoppingCart}
          label="Total Sales Orders"
          value={total}
          sub="All time"
          color="bg-gradient-to-br from-amber-400 to-yellow-600"
        />
        <StatCard
          icon={Clock}
          label="Pending"
          value={pending}
          sub="Awaiting confirmation"
          color="bg-gradient-to-br from-orange-400 to-orange-600"
        />
        <StatCard
          icon={Truck}
          label="In Transit"
          value={inTransit}
          sub="On the road"
          color="bg-gradient-to-br from-blue-500 to-blue-700"
        />
        <StatCard
          icon={CheckCircle2}
          label="Delivered"
          value={delivered}
          sub="Successfully done"
          color="bg-gradient-to-br from-emerald-400 to-green-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon={Building2}
          label="Active Suppliers"
          value={suppliers.filter((s) => s.status === "Active").length}
          sub={`${suppliers.length} total`}
          color="bg-gradient-to-br from-violet-500 to-purple-700"
        />
        <StatCard
          icon={AlertCircle}
          label="Cancelled"
          value={cancelled}
          sub="Requires attention"
          color="bg-gradient-to-br from-red-400 to-red-600"
        />
        <StatCard
          icon={TrendingUp}
          label="Delivery Rate"
          value={total ? `${Math.round((delivered / total) * 100)}%` : "0%"}
          sub="Success ratio"
          color="bg-gradient-to-br from-teal-400 to-cyan-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <div className="lg:col-span-2 bg-white dark:bg-neutral-800/70 rounded-2xl border border-neutral-200 dark:border-neutral-700/50 p-5 shadow-sm">
          <h2 className="text-base font-bold text-neutral-800 dark:text-white mb-1">
            Sales Order Trend
          </h2>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-5">
            Last 6 months
          </p>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart
                data={monthlyData}
                margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  className="dark:[stroke:#374151]"
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  fill="url(#goldGrad)"
                  dot={{ r: 4, fill: "#f59e0b", strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: "#f59e0b" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[220px] text-neutral-400 text-sm">
              No data yet
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-neutral-800/70 rounded-2xl border border-neutral-200 dark:border-neutral-700/50 p-5 shadow-sm">
          <h2 className="text-base font-bold text-neutral-800 dark:text-white mb-1">
            Status Breakdown
          </h2>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-3">
            All sales orders
          </p>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={230}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, n) => [`${v}`, n]} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[230px] text-neutral-400 text-sm">
              No data yet
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-800/70 rounded-2xl border border-neutral-200 dark:border-neutral-700/50 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-100 dark:border-neutral-700/50">
          <h2 className="text-base font-bold text-neutral-800 dark:text-white">
            Recent Sales Orders
          </h2>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
            Latest 5 records
          </p>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-12 text-neutral-400 dark:text-neutral-500 text-sm">
            No sales orders yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-50 dark:bg-neutral-700/30 text-neutral-500 dark:text-neutral-400 text-left">
                  <th className="px-5 py-3 font-medium">Order No</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr
                    key={o._id}
                    className="border-t border-neutral-100 dark:border-neutral-700/40 hover:bg-neutral-50 dark:hover:bg-neutral-700/20 transition"
                  >
                    <td className="px-5 py-3 font-mono text-xs font-semibold text-amber-600 dark:text-amber-400">
                      {o.orderNumber}
                    </td>
                    <td className="px-5 py-3 font-medium text-neutral-800 dark:text-neutral-100">
                      {o.customer?.name}
                    </td>
                    <td className="px-5 py-3 text-neutral-600 dark:text-neutral-300">
                      ৳ {o.totalAmount?.toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-neutral-400 dark:text-neutral-500">
                      {new Date(o.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle[o.status] || ""}`}
                      >
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default DashboardHome;
