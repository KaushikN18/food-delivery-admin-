
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
  FiSave,
  FiMail,
  FiPower,
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
    description: "I received a different item from the one I ordered.",
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
    description: "I cannot access my account after resetting my password.",
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
    description: "One item was missing from my delivery.",
    reply: "The issue has been reviewed and marked resolved.",
  },
];

const statusStyles = {
  Open: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "In Progress":
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  Resolved:
    "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
};

const priorityStyles = {
  High: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  Medium:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  Low: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
};

const buttonClass =
  "button-animate inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400";

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
  const [savedSettings, setSavedSettings] = useState({
    platformName: "Foodie Admin",
    supportEmail: "support@foodie.com",
    commission: "10",
    notifications: true,
    autoAssign: false,
    maintenance: false,
  });

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

  const openCount = tickets.filter((ticket) => ticket.status === "Open").length;
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
      status: selectedTicket.status === "Resolved"
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
      setNotice(
        "Enter a valid platform name, email, and commission from 0–100."
      );
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
      color:
        "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    },
    {
      label: "In Progress",
      value: progressCount,
      icon: FiClock,
      color:
        "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
    },
    {
      label: "Resolved",
      value: resolvedCount,
      icon: FiCheckCircle,
      color:
        "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400",
    },
    {
      label: "Total Tickets",
      value: tickets.length,
      icon: FiMessageSquare,
      color:
        "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
    },
  ];

  return (
    <div className="page-animate min-w-0 space-y-6">
      {/* Page heading */}
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Foodie Admin / Support
        </p>
        <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          Support, Reports &amp; Settings
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage customer support requests and platform preferences.
        </p>
      </div>

      {notice && !selectedTicket && (
        <div className="card-animate flex items-center justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-700 dark:border-blue-900 dark:bg-blue-900/20 dark:text-blue-300">
          <span>{notice}</span>
          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Dismiss"
            className="rounded-lg p-1 transition hover:bg-blue-100 dark:hover:bg-blue-900/40"
          >
            <FiX size={16} />
          </button>
        </div>
      )}

      {/* Statistics */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <article
              key={stat.label}
              style={{ animationDelay: `${index * 80}ms` }}
              className="card-animate hover-card group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-gray-900 transition-colors group-hover:text-orange-600 dark:text-white dark:group-hover:text-orange-400">
                    {stat.value}
                  </h2>
                </div>
                <div
                  className={`rounded-xl p-3 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110 ${stat.color}`}
                >
                  <Icon size={22} />
                </div>
              </div>
            </article>
          );
        })}
      </section>


      {/* Support Tickets */}
      <section className="card-animate overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 dark:border-gray-700 dark:bg-gray-900">
        <div className="flex flex-col gap-4 border-b border-gray-200 p-5 dark:border-gray-700 sm:p-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Support Tickets
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage customer queries and resolve issues.
              </p>
            </div>

            <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
              {filteredTickets.length} tickets
            </span>
          </div>

          {/* Search and filters */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tickets..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-800 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none transition-all focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none transition-all focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="All">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>
        </div>

        {/* Responsive table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-gray-50 dark:bg-gray-800/70">
              <tr className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                <th className="px-5 py-4">Ticket</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Subject</th>
                <th className="px-5 py-4">Priority</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket, index) => (
                  <tr
                    key={ticket.id}
                    style={{ animationDelay: `${index * 60}ms` }}
                    className="table-row-animate card-animate transition-colors"
                  >
                    <td className="whitespace-nowrap px-5 py-4">
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {ticket.id}
                      </span>
                      <p className="mt-1 text-xs text-gray-400">
                        {ticket.date}
                      </p>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <p className="font-medium text-gray-800 dark:text-gray-200">
                        {ticket.customer}
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {ticket.email}
                      </p>
                    </td>

                    <td className="max-w-[240px] px-5 py-4">
                      <p className="truncate font-medium text-gray-800 dark:text-gray-200">
                        {ticket.subject}
                      </p>
                      <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
                        {ticket.category}
                      </p>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          priorityStyles[ticket.priority] ||
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {ticket.priority}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          statusStyles[ticket.status] ||
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => openTicket(ticket)}
                        className="button-animate inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600 transition-all hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20"
                      >
                        <FiEye size={15} />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800">
                        <FiSearch size={22} />
                      </div>
                      <p className="font-semibold text-gray-800 dark:text-white">
                        No tickets found
                      </p>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Try changing your search or filter options.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSearch("");
                          setStatusFilter("All");
                          setPriorityFilter("All");
                        }}
                        className="button-animate mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Support Settings */}
      <section className="card-animate rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 dark:border-gray-700 dark:bg-gray-900 sm:p-6">
        <div className="mb-6 flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
            <FiSettings size={21} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Support Settings
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Configure your support platform preferences.
            </p>
          </div>
        </div>

        <form
          onSubmit={saveSettings}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Platform Name
              </label>
              <input
                type="text"
                value={settings.platformName}
                onChange={(e) =>
                  changeSetting("platformName", e.target.value)
                }
                placeholder="Enter platform name"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Support Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) =>
                    changeSetting("supportEmail", e.target.value)
                  }
                  placeholder="support@example.com"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-800 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Commission (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={settings.commission}
                onChange={(e) =>
                  changeSetting("commission", e.target.value)
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Set the platform commission from 0 to 100 percent.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              {
                key: "notifications",
                title: "Email Notifications",
                description: "Receive support updates by email.",
              },
              {
                key: "autoAssign",
                title: "Auto Assign Tickets",
                description: "Automatically assign incoming tickets.",
              },
              {
                key: "maintenance",
                title: "Maintenance Mode",
                description: "Temporarily restrict platform access.",
              },
            ].map((item, index) => (
              <div
                key={item.key}
                style={{ animationDelay: `${index * 80}ms` }}
                className="card-animate flex items-start justify-between gap-3 rounded-xl border border-gray-200 p-4 transition-all duration-300 hover:border-blue-300 dark:border-gray-700 dark:hover:border-blue-500/50"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={Boolean(settings[item.key])}
                  onClick={() =>
                    changeSetting(item.key, !settings[item.key])
                  }
                  className={`relative mt-1 h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${
                    settings[item.key] ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all duration-300 ${
                      settings[item.key] ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 border-t border-gray-100 pt-5 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {JSON.stringify(settings) !== JSON.stringify(savedSettings)
                ? "You have unsaved changes."
                : "All settings are saved."}
            </p>

            <button
              type="submit"
              className="button-animate inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700"
            >
              <FiSave size={16} />
              Save Settings
            </button>
          </div>
        </form>
      </section>

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <div
          className="overlay-animate fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => {
            setSelectedTicket(null);
            setReply("");
          }}
        >
          <div
            className="modal-animate max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="sticky top-0 z-10 flex items-start justify-between border-b border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  <FiMessageSquare size={21} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Ticket Details
                  </h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {selectedTicket.id}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedTicket(null);
                  setReply("");
                }}
                className="icon-animate rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
                aria-label="Close ticket details"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Modal content */}
            <div className="space-y-6 p-5 sm:p-6">
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      statusStyles[selectedTicket.status] ||
                      "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {selectedTicket.status}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      priorityStyles[selectedTicket.priority] ||
                      "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {selectedTicket.priority} Priority
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedTicket.subject}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                  {selectedTicket.description}
                </p>
              </div>

              {/* Customer details */}
              <div className="grid grid-cols-1 gap-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/70 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Customer
                  </p>
                  <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                    {selectedTicket.customer}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Email
                  </p>
                  <p className="mt-1 break-all font-semibold text-gray-900 dark:text-white">
                    {selectedTicket.email}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Category
                  </p>
                  <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                    {selectedTicket.category}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Created
                  </p>
                  <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                    {selectedTicket.date}
                  </p>
                </div>
              </div>

              {/* Change ticket status */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Update Ticket Status
                </label>

                <select
                  value={selectedTicket.status}
                  onChange={(e) => {
                    const newStatus = e.target.value;

                    updateTicket(selectedTicket.id, {
                      status: newStatus,
                    });
                  }}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              {/* Previous reply, if available */}
              {selectedTicket.reply && (
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-500/20 dark:bg-blue-500/10">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-blue-700 dark:text-blue-400">
                    Latest Support Reply
                  </p>
                  <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700 dark:text-gray-300">
                    {selectedTicket.reply}
                  </p>
                </div>
              )}

              {/* Reply form */}
              <form onSubmit={saveReply} className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Write a Reply
                </label>

                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  rows={4}
                  placeholder="Type your response to the customer..."
                  className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTicket(null);
                      setReply("");
                    }}
                    className="button-animate rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    Close
                  </button>

                  <button
                    type="submit"
                    className="button-animate inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700"
                  >
                    <FiMessageSquare size={16} />
                    Save Reply
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Support;

