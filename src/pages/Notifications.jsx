
import { useEffect, useMemo, useState } from "react";
import {
  FiBell,
  FiShoppingBag,
  FiDollarSign,
  FiTruck,
  FiAlertCircle,
  FiCheck,
  FiCheckCircle,
  FiTrash2,
  FiFilter,
} from "react-icons/fi";

const STORAGE_KEY = "foodie-admin-notifications";

const initialNotifications = [
  {
    id: 1,
    title: "New order received",
    message: "Order #FD-1088 has been placed and is waiting for confirmation.",
    type: "Order",
    time: "2 minutes ago",
    read: false,
  },
  {
    id: 2,
    title: "Payment successful",
    message: "Payment of ₹1,250 for order #FD-1087 was completed successfully.",
    type: "Payment",
    time: "15 minutes ago",
    read: false,
  },
  {
    id: 3,
    title: "Delivery partner assigned",
    message: "Ravi Kumar has been assigned to order #FD-1085.",
    type: "Delivery",
    time: "35 minutes ago",
    read: false,
  },
  {
    id: 4,
    title: "Restaurant approval pending",
    message: "Green Bowl is waiting for restaurant verification.",
    type: "Alert",
    time: "1 hour ago",
    read: true,
  },
  {
    id: 5,
    title: "Refund request received",
    message: "A refund request for order #FD-1079 needs your attention.",
    type: "Payment",
    time: "2 hours ago",
    read: true,
  },
  {
    id: 6,
    title: "Order delivered",
    message: "Order #FD-1075 has been marked as delivered.",
    type: "Order",
    time: "3 hours ago",
    read: true,
  },
];

function getSavedNotifications() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialNotifications;
  } catch {
    return initialNotifications;
  }
}

const notificationIcons = {
  Order: FiShoppingBag,
  Payment: FiDollarSign,
  Delivery: FiTruck,
  Alert: FiAlertCircle,
};

const notificationColors = {
  Order: "bg-orange-100 text-orange-600",
  Payment: "bg-emerald-100 text-emerald-600",
  Delivery: "bg-blue-100 text-blue-600",
  Alert: "bg-red-100 text-red-600",
};

function Notifications() {
  const [notifications, setNotifications] = useState(getSavedNotifications);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications]
  );

  const filteredNotifications = useMemo(() => {
    if (filter === "Unread") {
      return notifications.filter((item) => !item.read);
    }

    if (filter === "Read") {
      return notifications.filter((item) => item.read);
    }

    return notifications;
  }, [notifications, filter]);

  const markAsRead = (id) => {
    setNotifications((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, read: true } : item
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((previous) =>
      previous.map((item) => ({ ...item, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((previous) =>
      previous.filter((item) => item.id !== id)
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-orange-600">
            Foodie Admin / Notifications
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-800 sm:text-3xl">
            Notifications Center
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Stay updated on orders, payments, and delivery activity.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiCheckCircle size={17} />
            Mark all read
          </button>

          <button
            onClick={clearAll}
            disabled={notifications.length === 0}
            className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiTrash2 size={17} />
            Clear all
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Notifications</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-800">
                {notifications.length}
              </h2>
            </div>
            <div className="rounded-xl bg-orange-100 p-3 text-orange-600">
              <FiBell size={23} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Unread</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-800">
                {unreadCount}
              </h2>
            </div>
            <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
              <FiBell size={23} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Read</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-800">
                {notifications.length - unreadCount}
              </h2>
            </div>
            <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600">
              <FiCheckCircle size={23} />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Recent Activity
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <FiFilter className="text-slate-400" />
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400"
            >
              <option value="All">All notifications</option>
              <option value="Unread">Unread only</option>
              <option value="Read">Read only</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredNotifications.map((item) => {
            const Icon = notificationIcons[item.type] || FiBell;
            const colorClass =
              notificationColors[item.type] ||
              "bg-slate-100 text-slate-600";

            return (
              <div
                key={item.id}
                className={`flex flex-col gap-4 p-5 transition hover:bg-slate-50 sm:flex-row sm:items-start ${
                  !item.read ? "bg-orange-50/40" : ""
                }`}
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${colorClass}`}
                >
                  <Icon size={22} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-slate-800">
                      {item.title}
                    </h3>
                    {!item.read && (
                      <span className="h-2 w-2 rounded-full bg-orange-500" />
                    )}
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      {item.type}
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.message}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">{item.time}</p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {!item.read && (
                    <button
                      onClick={() => markAsRead(item.id)}
                      title="Mark as read"
                      className="rounded-lg border border-emerald-100 p-2 text-emerald-600 transition hover:bg-emerald-50"
                    >
                      <FiCheck size={18} />
                    </button>
                  )}

                  <button
                    onClick={() => deleteNotification(item.id)}
                    title="Delete notification"
                    className="rounded-lg border border-red-100 p-2 text-red-500 transition hover:bg-red-50"
                  >
                    <FiTrash2 size={17} />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredNotifications.length === 0 && (
            <div className="px-5 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <FiBell size={25} />
              </div>
              <h3 className="mt-4 font-semibold text-slate-800">
                No notifications found
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                There are no notifications in this view.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notifications;
