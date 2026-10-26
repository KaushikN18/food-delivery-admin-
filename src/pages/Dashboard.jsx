import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiShoppingBag,
  FiDollarSign,
  FiUsers,
  FiTruck,
  FiArrowUpRight,
  FiArrowDownRight,
  FiClock,
  FiCheckCircle,
  FiPackage,
  FiCoffee,
  FiRefreshCw,
  FiEye,
  FiAlertCircle,
} from "react-icons/fi";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

const ORDER_STORAGE_KEY = "foodie-admin-orders";

const initialOrders = [
  {
    id: "FD-1088",
    customer: "Arun Kumar",
    restaurant: "Spice Garden",
    amount: 850,
    status: "Pending",
    time: "10:42 AM",
  },
  {
    id: "FD-1087",
    customer: "Priya Sharma",
    restaurant: "Pizza Corner",
    amount: 1250,
    status: "Confirmed",
    time: "10:35 AM",
  },
  {
    id: "FD-1086",
    customer: "Rahul Verma",
    restaurant: "Green Bowl",
    amount: 620,
    status: "Active Delivery",
    time: "10:20 AM",
  },
  {
    id: "FD-1085",
    customer: "Sneha Reddy",
    restaurant: "Burger House",
    amount: 480,
    status: "Delivered",
    time: "10:05 AM",
  },
  {
    id: "FD-1084",
    customer: "Karthik Raj",
    restaurant: "Royal Dosa House",
    amount: 350,
    status: "Cancelled",
    time: "09:48 AM",
  },
];

const salesData = [
  { day: "Mon", revenue: 12000, orders: 180 },
  { day: "Tue", revenue: 18000, orders: 240 },
  { day: "Wed", revenue: 15000, orders: 210 },
  { day: "Thu", revenue: 24000, orders: 310 },
  { day: "Fri", revenue: 21000, orders: 280 },
  { day: "Sat", revenue: 32000, orders: 420 },
  { day: "Sun", revenue: 28000, orders: 380 },
];

const peakHours = [
  { time: "9 AM", orders: 35 },
  { time: "11 AM", orders: 70 },
  { time: "1 PM", orders: 125 },
  { time: "3 PM", orders: 65 },
  { time: "6 PM", orders: 110 },
  { time: "8 PM", orders: 155 },
  { time: "10 PM", orders: 85 },
];

const activities = [
  {
    title: "New order received",
    detail: "Order #FD-1088 · ₹850",
    time: "2 min ago",
    icon: FiShoppingBag,
    color: "text-orange-600 bg-orange-100",
  },
  {
    title: "Restaurant approved",
    detail: "Spice Garden",
    time: "15 min ago",
    icon: FiCheckCircle,
    color: "text-green-600 bg-green-100",
  },
  {
    title: "Delivery completed",
    detail: "Order #FD-1076",
    time: "28 min ago",
    icon: FiTruck,
    color: "text-blue-600 bg-blue-100",
  },
  {
    title: "Refund requested",
    detail: "Order #FD-1069 · ₹420",
    time: "40 min ago",
    icon: FiClock,
    color: "text-purple-600 bg-purple-100",
  },
];

function getSavedOrders() {
  try {
    const saved = localStorage.getItem(ORDER_STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : initialOrders;
    }

    return initialOrders;
  } catch {
    return initialOrders;
  }
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
}

function normalizeStatus(status) {
  const value = String(status || "").toLowerCase().trim();

  if (["confirmed", "preparing", "accepted"].includes(value)) {
    return "preparing";
  }

  if (
    [
      "active delivery",
      "out for delivery",
      "in transit",
      "picked up",
    ].includes(value)
  ) {
    return "delivery";
  }

  if (["delivered", "completed"].includes(value)) {
    return "delivered";
  }

  if (["cancelled", "canceled", "rejected"].includes(value)) {
    return "cancelled";
  }

  if (["refunded"].includes(value)) {
    return "refunded";
  }

  return "pending";
}

function getStatusClass(status) {
  const normalized = normalizeStatus(status);

  if (normalized === "delivered") {
    return "bg-green-50 text-green-700";
  }

  if (normalized === "preparing") {
    return "bg-blue-50 text-blue-700";
  }

  if (normalized === "delivery") {
    return "bg-purple-50 text-purple-700";
  }

  if (normalized === "cancelled" || normalized === "refunded") {
    return "bg-red-50 text-red-600";
  }

  return "bg-orange-50 text-orange-700";
}

function Dashboard() {
  const [orders, setOrders] = useState(getSavedOrders);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [orderFilter, setOrderFilter] = useState("All");

  useEffect(() => {
    const syncOrders = () => {
      setOrders(getSavedOrders());
      setLastUpdated(new Date());
    };

    window.addEventListener("focus", syncOrders);
    window.addEventListener("foodie-orders-updated", syncOrders);
    window.addEventListener("storage", syncOrders);

    return () => {
      window.removeEventListener("focus", syncOrders);
      window.removeEventListener("foodie-orders-updated", syncOrders);
      window.removeEventListener("storage", syncOrders);
    };
  }, []);

  const orderStats = useMemo(() => {
    const countStatus = (status) =>
      orders.filter(
        (order) => normalizeStatus(order.status) === status
      ).length;

    const revenue = orders
      .filter(
        (order) =>
          !["cancelled", "refunded"].includes(
            normalizeStatus(order.status)
          )
      )
      .reduce(
        (total, order) =>
          total +
          Number(order.amount ?? order.total ?? order.totalAmount ?? 0),
        0
      );

    return {
      total: orders.length,
      pending: countStatus("pending"),
      preparing: countStatus("preparing"),
      delivery: countStatus("delivery"),
      delivered: countStatus("delivered"),
      cancelled: countStatus("cancelled"),
      revenue,
      activeCustomers: new Set(
        orders
          .map((order) => order.customer || order.customerName)
          .filter(Boolean)
      ).size,
      activeDeliveries: countStatus("delivery"),
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const result =
      orderFilter === "All"
        ? orders
        : orders.filter(
            (order) => normalizeStatus(order.status) === orderFilter
          );

    return result.slice(0, 6);
  }, [orders, orderFilter]);

  const stats = [
    {
      title: "Total Orders",
      value: orderStats.total.toLocaleString("en-IN"),
      change: "+12.8%",
      positive: true,
      icon: FiShoppingBag,
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(orderStats.revenue),
      change: "+8.2%",
      positive: true,
      icon: FiDollarSign,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Active Customers",
      value: orderStats.activeCustomers.toLocaleString("en-IN"),
      change: "+15.3%",
      positive: true,
      icon: FiUsers,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Active Deliveries",
      value: orderStats.activeDeliveries.toLocaleString("en-IN"),
      change: "-2.4%",
      positive: false,
      icon: FiTruck,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  const quickActions = [
    {
      title: "Manage Orders",
      description: "Review and update orders",
      icon: FiShoppingBag,
      path: "/orders",
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Add Restaurant",
      description: "Manage restaurant listings",
      icon: FiCoffee,
      path: "/restaurants",
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Delivery Partners",
      description: "Manage your delivery team",
      icon: FiTruck,
      path: "/delivery-partners",
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "View Customers",
      description: "Review customer accounts",
      icon: FiUsers,
      path: "/customers",
      color: "bg-green-100 text-green-600",
    },
  ];

  const refreshDashboard = () => {
    setOrders(getSavedOrders());
    setLastUpdated(new Date());
  };
    return (
    <div className="space-y-7">
      {/* Dashboard Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-gray-500">Overview / Dashboard</p>

          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            Dashboard Overview
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Welcome back! Here's what's happening today.
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Last refreshed: {lastUpdated.toLocaleTimeString("en-IN")}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={refreshDashboard}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
          >
            <FiRefreshCw size={17} />
            Refresh
          </button>

          <button
            onClick={() => window.print()}
            className="w-fit rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-100 transition hover:bg-orange-600"
          >
            Generate Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const ChangeIcon = stat.positive
            ? FiArrowUpRight
            : FiArrowDownRight;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}
                >
                  <Icon size={23} />
                </div>

                <span
                  className={`flex items-center gap-1 text-xs font-bold ${
                    stat.positive ? "text-green-600" : "text-red-500"
                  }`}
                >
                  <ChangeIcon size={15} />
                  {stat.change}
                </span>
              </div>

              <p className="mt-5 text-sm font-medium text-gray-500">
                {stat.title}
              </p>

              <h2 className="mt-1 text-2xl font-extrabold text-gray-900">
                {stat.value}
              </h2>

              <p className="mt-2 text-xs text-gray-400">
                Based on saved demo orders
              </p>
            </div>
          );
        })}
      </section>

      {/* Live Order Overview */}
      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">
              Live Order Overview
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Counts calculated from your saved orders
            </p>
          </div>

          <Link
            to="/orders"
            className="text-sm font-bold text-orange-600 hover:text-orange-700"
          >
            Manage orders →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          {[
            {
              label: "Total Orders",
              value: orderStats.total,
              icon: FiShoppingBag,
              color: "bg-orange-100 text-orange-600",
            },
            {
              label: "Pending",
              value: orderStats.pending,
              icon: FiClock,
              color: "bg-yellow-100 text-yellow-700",
            },
            {
              label: "Confirmed / Preparing",
              value: orderStats.preparing,
              icon: FiCoffee,
              color: "bg-blue-100 text-blue-600",
            },
            {
              label: "Out for Delivery",
              value: orderStats.delivery,
              icon: FiTruck,
              color: "bg-purple-100 text-purple-600",
            },
            {
              label: "Delivered",
              value: orderStats.delivered,
              icon: FiCheckCircle,
              color: "bg-green-100 text-green-600",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.color}`}
                  >
                    <Icon size={20} />
                  </div>

                  <span className="text-2xl font-extrabold text-gray-900">
                    {item.value}
                  </span>
                </div>

                <p className="mt-4 text-xs font-medium text-gray-500 sm:text-sm">
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-extrabold text-gray-900">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Jump directly to important management pages.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.path}
                to={action.path}
                className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${action.color}`}
                >
                  <Icon size={22} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-gray-800">
                    {action.title}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    {action.description}
                  </p>
                </div>

                <FiArrowUpRight
                  className="shrink-0 text-gray-400 transition group-hover:text-orange-500"
                  size={18}
                />
              </Link>
            );
          })}
        </div>
      </section>
            {/* Revenue Analytics and Peak Hours */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="min-w-0 rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 xl:col-span-2">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Revenue Analytics
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Weekly sample revenue performance
              </p>
            </div>

            <span className="rounded-lg bg-orange-50 px-3 py-2 text-xs font-bold text-orange-600">
              This week
            </span>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient
                    id="revenueFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#f97316"
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="95%"
                      stopColor="#f97316"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid stroke="#f1f5f9" vertical={false} />

                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  tickFormatter={(value) => `${value / 1000}k`}
                />

                <Tooltip
                  formatter={(value) => [formatCurrency(value), "Revenue"]}
                />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#f97316"
                  strokeWidth={3}
                  fill="url(#revenueFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="min-w-0 rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
          <h2 className="text-lg font-bold text-gray-900">Peak Hours</h2>

          <p className="mt-1 text-sm text-gray-500">
            Sample orders by time of day
          </p>

          <div className="mt-5 h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peakHours}>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />

                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                />

                <YAxis hide />

                <Tooltip />

                <Bar
                  dataKey="orders"
                  fill="#fb923c"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Recent Orders */}
      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center sm:p-6">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">
              Recent Orders
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Latest orders and their current statuses
            </p>
          </div>

          <Link
            to="/orders"
            className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700"
          >
            <FiEye size={17} />
            View all orders
          </Link>
        </div>

        <div className="flex flex-wrap gap-2 px-5 pb-4 sm:px-6">
          {[
            { label: "All", value: "All" },
            { label: "Pending", value: "pending" },
            { label: "Confirmed / Preparing", value: "preparing" },
            { label: "Active Delivery", value: "delivery" },
            { label: "Delivered", value: "delivered" },
            { label: "Cancelled", value: "cancelled" },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setOrderFilter(filter.value)}
              className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                orderFilter === filter.value
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-600"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead className="bg-gray-50">
              <tr className="text-xs uppercase tracking-wider text-gray-500">
                <th className="px-5 py-4 font-semibold sm:px-6">Order ID</th>
                <th className="px-5 py-4 font-semibold">Customer</th>
                <th className="px-5 py-4 font-semibold">Restaurant</th>
                <th className="px-5 py-4 font-semibold">Amount</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold">Time</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="transition hover:bg-gray-50"
                >
                  <td className="px-5 py-4 sm:px-6">
                    <Link
                      to="/orders"
                      className="text-sm font-bold text-orange-600 hover:text-orange-700"
                    >
                      #{order.id}
                    </Link>
                  </td>

                  <td className="px-5 py-4 text-sm font-medium text-gray-800">
                    {order.customer || order.customerName || "Customer"}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {order.restaurant || order.restaurantName || "Restaurant"}
                  </td>

                  <td className="px-5 py-4 text-sm font-bold text-gray-800">
                    {formatCurrency(
                      order.amount ?? order.total ?? order.totalAmount
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClass(
                        order.status
                      )}`}
                    >
                      {order.status || "Pending"}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-xs text-gray-500">
                    {order.time || order.createdAt || order.date || "—"}
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-12 text-center text-sm text-gray-500"
                  >
                    <FiPackage
                      className="mx-auto mb-3 text-gray-300"
                      size={28}
                    />

                    No orders found for this status.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-gray-100 px-5 py-4 sm:px-6">
          <p className="text-xs text-gray-500">
            Showing {filteredOrders.length} of {orders.length} orders
          </p>

          <Link
            to="/orders"
            className="text-sm font-bold text-orange-600 hover:text-orange-700"
          >
            Manage orders →
          </Link>
        </div>
      </section>
            {/* Recent Activities */}
      <section className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Recent Activities
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Latest platform updates
            </p>
          </div>

          <Link
            to="/notifications"
            className="text-sm font-bold text-orange-600 hover:text-orange-700"
          >
            View all
          </Link>
        </div>

        <div className="divide-y divide-gray-100">
          {activities.map((activity) => {
            const Icon = activity.icon;

            return (
              <div
                key={activity.title}
                className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${activity.color}`}
                >
                  <Icon size={20} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-gray-800">
                    {activity.title}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {activity.detail}
                  </p>
                </div>

                <span className="shrink-0 text-xs text-gray-400">
                  {activity.time}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Attention Required */}
      {(orderStats.pending > 0 || orderStats.cancelled > 0) && (
        <section className="rounded-2xl border border-orange-100 bg-orange-50 p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-white p-3 text-orange-600">
              <FiAlertCircle size={22} />
            </div>

            <div className="flex-1">
              <h2 className="font-bold text-gray-900">
                Attention Required
              </h2>

              <p className="mt-1 text-sm leading-6 text-gray-600">
                You have {orderStats.pending} pending order
                {orderStats.pending !== 1 ? "s" : ""}
                {orderStats.cancelled > 0
                  ? ` and ${orderStats.cancelled} cancelled order${
                      orderStats.cancelled !== 1 ? "s" : ""
                    }`
                  : ""}
                . Review them to keep operations running smoothly.
              </p>

              <Link
                to="/orders"
                className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700"
              >
                Review orders <FiArrowUpRight size={17} />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default Dashboard;