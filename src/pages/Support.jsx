
import { useMemo, useState } from "react";
import {
  FiHeadphones,
  FiSearch,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiEye,
  FiX,
  FiMessageSquare,
  FiSettings,
  FiBarChart2,
  FiSave,
} from "react-icons/fi";

const initialTickets = [
  {
    id: "TKT-1001",
    customer: "Arun Kumar",
    email: "arun@gmail.com",
    subject: "Order not delivered",
    category: "Delivery",
    priority: "High",
    status: "Open",
    date: "2026-10-25",
    description:
      "My order shows delivered, but I have not received the food. Please investigate.",
    reply: "",
  },
  {
    id: "TKT-1002",
    customer: "Priya Sharma",
    email: "priya@gmail.com",
    subject: "Refund not received",
    category: "Payment",
    priority: "High",
    status: "In Progress",
    date: "2026-10-24",
    description:
      "My cancelled order was marked as refunded, but the money has not arrived in my account.",
    reply: "We are checking the refund status with the payment provider.",
  },
  {
    id: "TKT-1003",
    customer: "Rahul Raj",
    email: "rahul@gmail.com",
    subject: "Wrong item received",
    category: "Order",
    priority: "Medium",
    status: "Open",
    date: "2026-10-24",
    description:
      "I received a different item from the one I ordered.",
    reply: "",
  },
  {
    id: "TKT-1004",
    customer: "Divya S",
    email: "divya@gmail.com",
    subject: "Unable to apply coupon",
    category: "Promotions",
    priority: "Low",
    status: "Resolved",
    date: "2026-10-23",
    description:
      "The discount code was not working when I tried to place my order.",
    reply: "The coupon eligibility was explained to the customer.",
  },
  {
    id: "TKT-1005",
    customer: "Karthik M",
    email: "karthik@gmail.com",
    subject: "Account access problem",
    category: "Account",
    priority: "Medium",
    status: "In Progress",
    date: "2026-10-22",
    description:
      "I cannot access my account after resetting my password.",
    reply: "",
  },
  {
    id: "TKT-1006",
    customer: "Sneha R",
    email: "sneha@gmail.com",
    subject: "Missing item in order",
    category: "Order",
    priority: "Low",
    status: "Resolved",
    date: "2026-10-21",
    description:
      "One item was missing from my delivery.",
    reply: "The issue has been reviewed and marked resolved.",
  },
];

const statusStyles = {
  Open: "bg-blue-100 text-blue-700",
  "In Progress": "bg-amber-100 text-amber-700",
  Resolved: "bg-green-100 text-green-700",
};

const priorityStyles = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-orange-100 text-orange-700",
  Low: "bg-gray-100 text-gray-600",
};

function Support() {
  const [tickets, setTickets] = useState(initialTickets);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [reply, setReply] = useState("");
  const [notice, setNotice] = useState("");

  const [settings, setSettings] = useState({
    platformName: "Foodie Admin",
    supportEmail: "support@foodie.com",
    commission: "10",
    notifications: true,
    autoAssign: false,
    maintenance: false,
  });

  const [savedSettings, setSavedSettings] = useState(settings);

  const filteredTickets = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tickets.filter((ticket) => {
      const matchesSearch =
        ticket.id.toLowerCase().includes(query) ||
        ticket.customer.toLowerCase().includes(query) ||
        ticket.subject.toLowerCase().includes(query) ||
        ticket.email.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || ticket.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" || ticket.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tickets, search, statusFilter, priorityFilter]);

  const openCount = tickets.filter(
    (ticket) => ticket.status === "Open"
  ).length;

  const progressCount = tickets.filter(
    (ticket) => ticket.status === "In Progress"
  ).length;

  const resolvedCount = tickets.filter(
    (ticket) => ticket.status === "Resolved"
  ).length;

  const updateTicket = (id, updates) => {
    setTickets((current) =>
      current.map((ticket) =>
        ticket.id === id ? { ...ticket, ...updates } : ticket
      )
    );

    setSelectedTicket((current) =>
      current?.id === id ? { ...current, ...updates } : current
    );
  };

  const openTicket = (ticket) => {
    setSelectedTicket(ticket);
    setReply(ticket.reply || "");
    setNotice("");
  };

  const saveReply = () => {
    if (!selectedTicket) return;

    if (!reply.trim()) {
      setNotice("Please enter a reply before saving.");
      return;
    }

    updateTicket(selectedTicket.id, {
      reply: reply.trim(),
      status:
        selectedTicket.status === "Resolved"
          ? "Resolved"
          : "In Progress",
    });

    setNotice("Reply saved and ticket updated.");
  };

  const saveSettings = (event) => {
    event.preventDefault();

    const commission = Number(settings.commission);

    if (
      !settings.platformName.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.supportEmail) ||
      !Number.isFinite(commission) ||
      commission < 0 ||
      commission > 100
    ) {
      setNotice("Enter a valid platform name, email, and commission from 0–100.");
      return;
    }

    setSavedSettings({ ...settings });
    setNotice("Settings saved for this session.");
  };

  const changeSetting = (event) => {
    const { name, value, type, checked } = event.target;

    setSettings((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const stats = [
    {
      label: "Open Tickets",
      value: openCount,
      icon: FiAlertCircle,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "In Progress",
      value: progressCount,
      icon: FiClock,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Resolved",
      value: resolvedCount,
      icon: FiCheckCircle,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Total Tickets",
      value: tickets.length,
      icon: FiMessageSquare,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Support, Reports & Settings
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage customer support requests and platform preferences.
        </p>
      </div>

      {notice && !selectedTicket && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-700">
          {notice}
          <button onClick={() => setNotice("")} aria-label="Dismiss">
            <FiX size={16} />
          </button>
        </div>
      )}

      {/* Support statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <h2 className="mt-2 text-2xl font-bold text-gray-900">
                    {stat.value}
                  </h2>
                </div>
                <div className={`rounded-xl p-3 ${stat.color}`}>
                  <Icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Support ticket list */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-5">
          <h2 className="font-bold text-gray-900">Support Tickets</h2>
          <p className="mt-1 text-sm text-gray-500">
            Review and respond to customer issues.
          </p>
        </div>

        <div className="flex flex-col gap-3 p-4 lg:flex-row">
          <div className="relative flex-1">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search ticket, customer or subject..."
              className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400"
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Ticket</th>
                <th className="px-5 py-4 font-semibold">Customer</th>
                <th className="px-5 py-4 font-semibold">Priority</th>
                <th className="px-5 py-4 font-semibold">Date</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-right font-semibold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredTickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="transition hover:bg-orange-50/30"
                >
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-900">
                      {ticket.subject}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {ticket.id} · {ticket.category}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-gray-800">
                      {ticket.customer}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {ticket.email}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityStyles[ticket.priority]}`}
                    >
                      {ticket.priority}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {new Date(`${ticket.date}T00:00:00`).toLocaleDateString(
                      "en-IN"
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[ticket.status]}`}
                    >
                      {ticket.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end">
                      <button
                        onClick={() => openTicket(ticket)}
                        className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-100"
                      >
                        <FiEye size={15} />
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredTickets.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-5 py-12 text-center">
                    <FiHeadphones
                      className="mx-auto text-gray-300"
                      size={32}
                    />
                    <p className="mt-3 font-semibold text-gray-700">
                      No tickets found
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Try changing the search or filters.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin settings */}
      <form
        onSubmit={saveSettings}
        className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
            <FiSettings size={22} />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">Platform Settings</h2>
            <p className="mt-1 text-sm text-gray-500">
              Configure general platform preferences.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-gray-700">
            Platform Name
            <input
              name="platformName"
              value={settings.platformName}
              onChange={changeSetting}
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-400"
            />
          </label>

          <label className="space-y-2 text-sm font-medium text-gray-700">
            Support Email
            <input
              name="supportEmail"
              type="email"
              value={settings.supportEmail}
              onChange={changeSetting}
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-400"
            />
          </label>

          <label className="space-y-2 text-sm font-medium text-gray-700">
            Default Platform Commission (%)
            <input
              name="commission"
              type="number"
              min="0"
              max="100"
              value={settings.commission}
              onChange={changeSetting}
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-400"
            />
          </label>
        </div>

        <div className="mt-6 space-y-4 border-t border-gray-100 pt-5">
          {[
            {
              name: "notifications",
              title: "Email Notifications",
              description: "Enable platform notification preferences.",
            },
            {
              name: "autoAssign",
              title: "Automatic Delivery Assignment",
              description: "Enable the preference for automatic driver assignment.",
            },
            {
              name: "maintenance",
              title: "Maintenance Mode",
              description: "Set the maintenance-mode preference for the platform.",
            },
          ].map((item) => (
            <label
              key={item.name}
              className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-gray-100 p-4 transition hover:bg-gray-50"
            >
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {item.title}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {item.description}
                </p>
              </div>

              <input
                type="checkbox"
                name={item.name}
                checked={settings[item.name]}
                onChange={changeSetting}
                className="h-5 w-5 accent-orange-500"
              />
            </label>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-gray-500">
            {JSON.stringify(settings) === JSON.stringify(savedSettings)
              ? "No unsaved changes."
              : "You have unsaved changes."}
          </p>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            <FiSave size={17} />
            Save Settings
          </button>
        </div>
      </form>

      {/* Ticket details modal */}
      {selectedTicket && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 p-4"
          onClick={() => setSelectedTicket(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 p-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Ticket Details
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedTicket.id}
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedTicket(null);
                  setNotice("");
                }}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close ticket"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedTicket.subject}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {selectedTicket.customer} · {selectedTicket.email}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase text-gray-500">
                  Customer message
                </p>
                <p className="mt-2 text-sm leading-6 text-gray-700">
                  {selectedTicket.description}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-gray-700">
                  Ticket Status
                  <select
                    value={selectedTicket.status}
                    onChange={(event) =>
                      updateTicket(selectedTicket.id, {
                        status: event.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 outline-none focus:border-orange-400"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </label>

                <div>
                  <p className="mb-2 text-sm font-medium text-gray-700">
                    Priority
                  </p>
                  <span
                    className={`inline-block rounded-full px-3 py-2 text-xs font-semibold ${priorityStyles[selectedTicket.priority]}`}
                  >
                    {selectedTicket.priority}
                  </span>
                </div>
              </div>

              <label className="block space-y-2 text-sm font-medium text-gray-700">
                Support Reply / Internal Note
                <textarea
                  value={reply}
                  onChange={(event) => {
                    setReply(event.target.value);
                    setNotice("");
                  }}
                  rows={4}
                  placeholder="Write your reply or internal note..."
                  className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-400"
                />
              </label>

              {notice && (
                <p className="rounded-xl bg-blue-50 p-3 text-sm text-blue-700">
                  {notice}
                </p>
              )}

              <button
                onClick={saveReply}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600"
              >
                <FiMessageSquare size={17} />
                Save Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Support;
