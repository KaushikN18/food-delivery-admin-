import { useEffect, useMemo, useState } from "react";
import {
  FiSearch,
  FiEye,
  FiX,
  FiRefreshCw,
  FiShoppingBag,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiChevronDown,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";

const STORAGE_KEY = "foodie-admin-orders";

const initialOrders = [
  {
    id: "FD-1082",
    customer: "Arun Kumar",
    phone: "+91 98765 43210",
    restaurant: "Spice Garden",
    items: ["Chicken Biryani", "Butter Naan", "Coke"],
    amount: 850,
    date: "2026-10-24T13:20:00",
    status: "Pending",
    payment: "Paid",
    address: "Anna Nagar, Chennai",
    deliveryPartner: "Not assigned",
    refundRequested: false,
  },
  {
    id: "FD-1081",
    customer: "Priya Sharma",
    phone: "+91 98765 12345",
    restaurant: "Pizza Corner",
    items: ["Margherita Pizza", "Garlic Bread"],
    amount: 620,
    date: "2026-10-24T12:55:00",
    status: "Confirmed",
    payment: "Paid",
    address: "Velachery, Chennai",
    deliveryPartner: "Karthik",
    refundRequested: false,
  },
  {
    id: "FD-1080",
    customer: "Rahul Verma",
    phone: "+91 91234 56780",
    restaurant: "Burger House",
    items: ["Classic Burger", "French Fries"],
    amount: 450,
    date: "2026-10-24T12:30:00",
    status: "Active Delivery",
    payment: "Paid",
    address: "T. Nagar, Chennai",
    deliveryPartner: "Vijay",
    refundRequested: false,
  },
  {
    id: "FD-1079",
    customer: "Sneha Reddy",
    phone: "+91 99887 66554",
    restaurant: "Green Bowl",
    items: ["Veg Salad", "Fresh Juice"],
    amount: 380,
    date: "2026-10-24T11:45:00",
    status: "Delivered",
    payment: "Paid",
    address: "Adyar, Chennai",
    deliveryPartner: "Arun",
    refundRequested: false,
  },
  {
    id: "FD-1078",
    customer: "Vikram Singh",
    phone: "+91 98760 11223",
    restaurant: "Spice Garden",
    items: ["Paneer Biryani", "Lassi"],
    amount: 540,
    date: "2026-10-24T11:20:00",
    status: "Cancelled",
    payment: "Refunded",
    address: "Guindy, Chennai",
    deliveryPartner: "Not assigned",
    refundRequested: false,
  },
  {
    id: "FD-1077",
    customer: "Divya Mohan",
    phone: "+91 90000 12345",
    restaurant: "Pizza Corner",
    items: ["Farmhouse Pizza", "Cold Coffee"],
    amount: 720,
    date: "2026-10-24T10:50:00",
    status: "Pending",
    payment: "Paid",
    address: "Porur, Chennai",
    deliveryPartner: "Not assigned",
    refundRequested: true,
  },
  {
    id: "FD-1076",
    customer: "Kiran Raj",
    phone: "+91 91111 22222",
    restaurant: "Burger House",
    items: ["Double Cheese Burger"],
    amount: 320,
    date: "2026-10-24T10:15:00",
    status: "Delivered",
    payment: "Paid",
    address: "Tambaram, Chennai",
    deliveryPartner: "Manoj",
    refundRequested: false,
  },
  {
    id: "FD-1075",
    customer: "Meena Devi",
    phone: "+91 92222 33333",
    restaurant: "Green Bowl",
    items: ["Paneer Wrap", "Fruit Bowl"],
    amount: 410,
    date: "2026-10-24T09:40:00",
    status: "Confirmed",
    payment: "Paid",
    address: "Mylapore, Chennai",
    deliveryPartner: "Suresh",
    refundRequested: false,
  },
];

const filters = [
  "All Orders",
  "Pending",
  "Confirmed",
  "Active Delivery",
  "Delivered",
  "Cancelled",
];

const statusStyles = {
  Pending: "bg-amber-50 text-amber-700",
  Confirmed: "bg-blue-50 text-blue-700",
  "Active Delivery": "bg-purple-50 text-purple-700",
  Delivered: "bg-green-50 text-green-700",
  Cancelled: "bg-red-50 text-red-700",
};

const currency = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const formatDate = (date) =>
  new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

function getSavedOrders() {
  try {
    const savedOrders = localStorage.getItem(STORAGE_KEY);

    if (!savedOrders) return initialOrders;

    const parsedOrders = JSON.parse(savedOrders);

    if (!Array.isArray(parsedOrders)) return initialOrders;

    return parsedOrders;
  } catch {
    return initialOrders;
  }
}

function Orders() {
  const [orders, setOrders] = useState(getSavedOrders);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Orders");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [notice, setNotice] = useState("");

  // Save orders and notify Dashboard.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
      window.dispatchEvent(new Event("foodie-orders-updated"));
    } catch {
      setNotice("Unable to save changes in browser storage.");
    }
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        order.id.toLowerCase().includes(searchText) ||
        order.customer.toLowerCase().includes(searchText) ||
        order.restaurant.toLowerCase().includes(searchText);

      const matchesStatus =
        activeFilter === "All Orders" || order.status === activeFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, activeFilter]);

  const counts = useMemo(
    () => ({
      total: orders.length,
      pending: orders.filter((order) => order.status === "Pending").length,
      confirmed: orders.filter((order) => order.status === "Confirmed").length,
      delivery: orders.filter(
        (order) => order.status === "Active Delivery"
      ).length,
      delivered: orders.filter((order) => order.status === "Delivered").length,
      cancelled: orders.filter((order) => order.status === "Cancelled").length,
    }),
    [orders]
  );

  const updateStatus = (id, status) => {
    setOrders((current) =>
      current.map((order) => {
        if (order.id !== id) return order;

        return {
          ...order,
          status,
          deliveryPartner:
            status === "Active Delivery" &&
            order.deliveryPartner === "Not assigned"
              ? "Partner pending"
              : order.deliveryPartner,
        };
      })
    );

    setSelectedOrder((current) =>
      current?.id === id
        ? {
            ...current,
            status,
            deliveryPartner:
              status === "Active Delivery" &&
              current.deliveryPartner === "Not assigned"
                ? "Partner pending"
                : current.deliveryPartner,
          }
        : current
    );

    setNotice(`${id} status updated to ${status}.`);
  };

  const handleRefund = (id) => {
    setOrders((current) =>
      current.map((order) =>
        order.id === id
          ? {
              ...order,
              refundRequested: false,
              payment: "Refunded",
            }
          : order
      )
    );

    setSelectedOrder((current) =>
      current?.id === id
        ? {
            ...current,
            refundRequested: false,
            payment: "Refunded",
          }
        : current
    );

    setNotice(`Refund marked as processed for ${id}.`);
  };

  const resetSampleData = () => {
    const confirmed = window.confirm(
      "Reset all orders to the original sample data? Your saved order changes will be lost."
    );

    if (!confirmed) return;

    setOrders(initialOrders);
    setSearch("");
    setActiveFilter("All Orders");
    setSelectedOrder(null);
    setNotice("Sample orders have been reset.");
  };

  const summaryCards = [
    {
      label: "Total Orders",
      value: counts.total,
      icon: FiShoppingBag,
      color: "bg-orange-100 text-orange-600",
    },
    {
      label: "Pending Orders",
      value: counts.pending,
      icon: FiClock,
      color: "bg-amber-100 text-amber-600",
    },
    {
      label: "Confirmed",
      value: counts.confirmed,
      icon: FiCheckCircle,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Active Deliveries",
      value: counts.delivery,
      icon: FiTruck,
      color: "bg-purple-100 text-purple-600",
    },
  ];  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-gray-500">
            Overview / Order Management
          </p>

          <h1 className="mt-2 text-2xl font-extrabold text-gray-900 sm:text-3xl">
            Order Management
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Track, manage and update customer orders.
          </p>
        </div>

        <button
          onClick={resetSampleData}
          className="flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          <FiRefreshCw size={16} />
          Reset Sample Data
        </button>
      </div>

      {notice && (
        <div
          role="status"
          className="flex items-center justify-between gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
        >
          <span>{notice}</span>

          <button
            onClick={() => setNotice("")}
            aria-label="Dismiss notification"
          >
            <FiX size={18} />
          </button>
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.color}`}
                >
                  <Icon size={22} />
                </div>

                <span className="text-xs font-medium text-gray-400">
                  Saved orders
                </span>
              </div>

              <p className="mt-4 text-sm text-gray-500">{card.label}</p>

              <h2 className="mt-1 text-2xl font-extrabold text-gray-900">
                {card.value}
              </h2>
            </div>
          );
        })}
      </section>

      <div className="flex flex-wrap gap-3 text-sm">
        <span className="rounded-lg bg-green-50 px-3 py-2 font-medium text-green-700">
          Delivered: {counts.delivered}
        </span>

        <span className="rounded-lg bg-red-50 px-3 py-2 font-medium text-red-700">
          Cancelled: {counts.cancelled}
        </span>

        <span className="rounded-lg bg-amber-50 px-3 py-2 font-medium text-amber-700">
          Refund requests:{" "}
          {orders.filter((order) => order.refundRequested).length}
        </span>
      </div>

      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                All Orders
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Showing {filteredOrders.length} of {orders.length} orders
              </p>
            </div>

            <div className="relative w-full lg:max-w-sm">
              <FiSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search order, customer, restaurant..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
              />
            </div>
          </div>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                  activeFilter === filter
                    ? "bg-orange-500 text-white"
                    : "bg-gray-50 text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead className="bg-gray-50">
              <tr className="text-xs uppercase tracking-wide text-gray-500">
                <th className="px-5 py-4 font-semibold">Order ID</th>
                <th className="px-5 py-4 font-semibold">Customer</th>
                <th className="px-5 py-4 font-semibold">Restaurant</th>
                <th className="px-5 py-4 font-semibold">Amount</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold">Payment</th>
                <th className="px-5 py-4 font-semibold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="transition hover:bg-orange-50/30"
                >
                  <td className="whitespace-nowrap px-5 py-4">
                    <span className="font-bold text-gray-900">
                      #{order.id}
                    </span>

                    {order.refundRequested && (
                      <span className="mt-1 block text-xs font-semibold text-amber-600">
                        Refund requested
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <p className="whitespace-nowrap text-sm font-semibold text-gray-800">
                      {order.customer}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {formatDate(order.date)}
                    </p>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                    {order.restaurant}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-sm font-bold text-gray-900">
                    {currency(order.amount)}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${
                        statusStyles[order.status] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <span
                      className={`text-xs font-semibold ${
                        order.payment === "Refunded"
                          ? "text-purple-600"
                          : "text-green-600"
                      }`}
                    >
                      {order.payment}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setNotice("");
                      }}
                      aria-label={`View order ${order.id}`}
                      className="rounded-lg border border-gray-200 p-2.5 text-gray-600 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
                    >
                      <FiEye size={17} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-5 py-14 text-center">
                    <FiShoppingBag
                      className="mx-auto text-gray-300"
                      size={36}
                    />

                    <p className="mt-3 font-semibold text-gray-700">
                      No orders found
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Try another search or status filter.
                    </p>

                    <button
                      onClick={() => {
                        setSearch("");
                        setActiveFilter("All Orders");
                      }}
                      className="mt-3 text-sm font-bold text-orange-600"
                    >
                      Clear filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
            {selectedOrder && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-950/50 p-3 sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedOrder(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-modal-title"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-100 bg-white p-5 sm:px-6">
              <div>
                <p className="text-sm text-gray-500">Order details</p>

                <h2
                  id="order-modal-title"
                  className="mt-1 text-xl font-extrabold text-gray-900"
                >
                  #{selectedOrder.id}
                </h2>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                aria-label="Close order details"
                className="rounded-xl bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
              >
                <FiX size={21} />
              </button>
            </div>

            <div className="space-y-6 p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span
                  className={`rounded-full px-3 py-2 text-xs font-bold ${
                    statusStyles[selectedOrder.status] ||
                    "bg-gray-100 text-gray-700"
                  }`}
                >
                  {selectedOrder.status}
                </span>

                <span className="text-sm text-gray-500">
                  {formatDate(selectedOrder.date)}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Customer</p>

                  <p className="mt-2 font-bold text-gray-900">
                    {selectedOrder.customer}
                  </p>

                  <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                    <FiPhone size={14} />
                    {selectedOrder.phone}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Restaurant</p>

                  <p className="mt-2 font-bold text-gray-900">
                    {selectedOrder.restaurant}
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    Partner: {selectedOrder.deliveryPartner}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-900">Ordered items</h3>

                <div className="mt-3 divide-y divide-gray-100 rounded-xl border border-gray-100 px-4">
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={`${item}-${index}`}
                      className="flex items-center justify-between gap-3 py-3 text-sm"
                    >
                      <span className="text-gray-700">{item}</span>

                      <span className="text-gray-400">
                        Item {index + 1}
                      </span>
                    </div>
                  ))}

                  <div className="flex items-center justify-between py-4">
                    <span className="font-bold text-gray-900">
                      Total amount
                    </span>

                    <span className="text-lg font-extrabold text-orange-600">
                      {currency(selectedOrder.amount)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="flex items-center gap-2 text-sm font-bold text-gray-800">
                  <FiMapPin className="text-orange-500" />
                  Delivery address
                </p>

                <p className="mt-2 text-sm text-gray-600">
                  {selectedOrder.address}
                </p>
              </div>

              <div>
                <label
                  htmlFor="order-status"
                  className="mb-2 block text-sm font-bold text-gray-800"
                >
                  Update order status
                </label>

                <div className="relative">
                  <select
                    id="order-status"
                    value={selectedOrder.status}
                    onChange={(event) =>
                      updateStatus(selectedOrder.id, event.target.value)
                    }
                    className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  >
                    {filters
                      .filter((filter) => filter !== "All Orders")
                      .map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                  </select>

                  <FiChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
                </div>
              </div>

              {selectedOrder.refundRequested && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="font-bold text-amber-800">
                    Refund request pending
                  </p>

                  <p className="mt-1 text-sm text-amber-700">
                    Review this request before marking the refund as processed.
                  </p>

                  <button
                    onClick={() => handleRefund(selectedOrder.id)}
                    className="mt-3 rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-amber-700"
                  >
                    Mark Refund Processed
                  </button>
                </div>
              )}

              {selectedOrder.payment === "Refunded" && (
                <p className="rounded-xl bg-purple-50 p-3 text-sm font-semibold text-purple-700">
                  This order is marked as refunded in the sample data.
                </p>
              )}

              <p className="text-xs text-gray-500">
                Demo mode: order changes are saved in this browser only.
                Refund processing does not initiate a real payment.
              </p>

              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full rounded-xl bg-orange-500 px-4 py-3 font-bold text-white transition hover:bg-orange-600"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
          </div>
  );
}

export default Orders;