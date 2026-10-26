
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
  Order:
    "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
  Payment:
    "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  Delivery:
    "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  Alert:
    "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400",
};

function Notifications() {
  const [notifications, setNotifications] = useState(getSavedNotifications);
  const [filter, setFilter] = useState("All");
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch {
      // Notifications remain available in current component state.
    }
  }, [notifications]);

  useEffect(() => {
    if (!message) return undefined;

    const timer = setTimeout(() => setMessage(""), 3000);
    return () => clearTimeout(timer);
  }, [message]);

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
    setMessage("Notification marked as read.");
  };

  const markAllAsRead = () => {
    if (unreadCount === 0) return;

    setNotifications((previous) =>
      previous.map((item) => ({ ...item, read: true }))
    );
    setMessage("All notifications marked as read.");
  };

  const deleteNotification = (id) => {
    setNotifications((previous) =>
      previous.filter((item) => item.id !== id)
    );
    setMessage("Notification deleted.");
  };

  const clearAll = () => {
    if (notifications.length === 0) return;

    if (!window.confirm("Clear all notifications? This cannot be undone.")) {
      return;
    }

    setNotifications([]);
    setMessage("All notifications cleared.");
  };

  const buttonClass =
    "button-animate inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="page-animate min-w-0 space-y-6">
      {/* Header */}
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
            Foodie Admin / Notifications
          </p>

          <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            Notifications Center
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Stay updated on orders, payments, and delivery activity.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className={`${buttonClass} border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-emerald-900/20`}
          >
            <FiCheckCircle
              size={17}
              className="transition-transform duration-200 group-hover:scale-110"
            />
            Mark all read
          </button>

          <button
            type="button"
            onClick={clearAll}
            disabled={notifications.length === 0}
            className={`${buttonClass} bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20`}
          >
            <FiTrash2 size={17} />
            Clear all
          </button>
        </div>
      </header>

      {/* Action feedback */}
      {message && (
        <div
          role="status"
          className="card-animate flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-300"
        >
          <FiCheckCircle size={18} className="shrink-0" />
          <span>{message}</span>

          <button
            type="button"
            onClick={() => setMessage("")}
            className="ml-auto rounded-lg p-1 transition-colors hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
            aria-label="Dismiss message"
          >
            ×
          </button>
        </div>
      )}

      {/* Statistics */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            label: "Total Notifications",
            value: notifications.length,
            icon: FiBell,
            color:
              "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
          },
          {
            label: "Unread",
            value: unreadCount,
            icon: FiBell,
            color:
              "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
          },
          {
            label: "Read",
            value: notifications.length - unreadCount,
            icon: FiCheckCircle,
            color:
              "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
          },
        ].map((stat, index) => {
          const Icon = stat.icon;

          return (
            <article
              key={stat.label}
              style={{ animationDelay: `${index * 90}ms` }}
              className="card-animate hover-card group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-gray-900 transition-colors duration-200 group-hover:text-orange-600 dark:text-white dark:group-hover:text-orange-400">
                    {stat.value}
                  </h2>
                </div>

                <div
                  className={`rounded-xl p-3 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110 ${stat.color}`}
                >
                  <Icon size={23} />
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* Notification list */}
      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-900">
        <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center dark:border-gray-700">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Recent Activity
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <FiFilter
              className="text-gray-400 transition-transform duration-200 hover:rotate-12"
              size={18}
            />

            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-all duration-200 hover:border-orange-300 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:focus:ring-orange-900/30"
            >
              <option value="All">All notifications</option>
              <option value="Unread">Unread only</option>
              <option value="Read">Read only</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {filteredNotifications.map((item, index) => {
            const Icon = notificationIcons[item.type] || FiBell;
            const colorClass =
              notificationColors[item.type] ||
              "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300";

            return (
              <article
                key={item.id}
                style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
                className={`card-animate group flex flex-col gap-4 border-l-4 p-5 transition-all duration-200 hover:bg-orange-50/70 sm:flex-row sm:items-start dark:hover:bg-gray-800/80 ${
                  !item.read
                    ? "border-l-orange-400 bg-orange-50/30 dark:bg-orange-500/5"
                    : "border-l-transparent"
                }`}
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110 ${colorClass}`}
                >
                  <Icon size={22} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-gray-900 transition-colors duration-200 group-hover:text-orange-600 dark:text-white dark:group-hover:text-orange-400">
                      {item.title}
                    </h3>

                    {!item.read && (
                      <span className="notification-pulse h-2 w-2 rounded-full bg-orange-500" />
                    )}

                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      {item.type}
                    </span>

                    {!item.read && (
                      <span className="rounded-full bg-orange-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-orange-700 dark:bg-orange-500/10 dark:text-orange-400">
                        New
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                    {item.message}
                  </p>

                  <p className="mt-2 text-xs text-gray-400">{item.time}</p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {!item.read && (
                    <button
                      type="button"
                      onClick={() => markAsRead(item.id)}
                      title="Mark as read"
                      aria-label={`Mark ${item.title} as read`}
                      className="button-animate rounded-lg border border-emerald-100 p-2 text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 dark:border-emerald-900 dark:text-emerald-400 dark:hover:bg-emerald-900/30"
                    >
                      <FiCheck size={18} />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => deleteNotification(item.id)}
                    title="Delete notification"
                    aria-label={`Delete ${item.title}`}
                    className="button-animate rounded-lg border border-red-100 p-2 text-red-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-900 dark:hover:bg-red-900/30"
                  >
                    <FiTrash2 size={17} />
                  </button>
                </div>
              </article>
            );
          })}

          {filteredNotifications.length === 0 && (
            <div className="card-animate px-5 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-transform duration-300 hover:scale-110 dark:bg-gray-800 dark:text-gray-500">
                <FiBell size={25} />
              </div>

              <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">
                No notifications found
              </h3>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                There are no notifications in this view.
              </p>

              {filter !== "All" && (
                <button
                  type="button"
                  onClick={() => setFilter("All")}
                  className={`${buttonClass} mt-4 bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600`}
                >
                  Show all notifications
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Notifications;
