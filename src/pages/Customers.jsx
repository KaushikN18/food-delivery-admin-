
import { useEffect, useMemo, useState } from "react";
import {
  FiSearch,
  FiPlus,
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiShoppingBag,
  FiEye,
  FiX,
  FiPhone,
  FiMail,
  FiMapPin,
  FiCalendar,
  FiDollarSign,
  FiShield,
} from "react-icons/fi";

const STORAGE_KEY = "foodie-admin-customers";

const initialCustomers = [
  {
    id: "CUS-1001",
    name: "Arun Kumar",
    email: "arun.kumar@example.com",
    phone: "+91 98765 43210",
    address: "Anna Nagar, Chennai",
    orders: 24,
    spent: 12450,
    status: "Active",
    joined: "2026-08-12",
  },
  {
    id: "CUS-1002",
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    phone: "+91 98765 12340",
    address: "Adyar, Chennai",
    orders: 18,
    spent: 8750,
    status: "Active",
    joined: "2026-08-20",
  },
  {
    id: "CUS-1003",
    name: "Rahul Verma",
    email: "rahul.verma@example.com",
    phone: "+91 91234 56780",
    address: "Velachery, Chennai",
    orders: 9,
    spent: 4200,
    status: "Blocked",
    joined: "2026-09-01",
  },
  {
    id: "CUS-1004",
    name: "Sneha Reddy",
    email: "sneha.reddy@example.com",
    phone: "+91 99887 76655",
    address: "T. Nagar, Chennai",
    orders: 32,
    spent: 18600,
    status: "Active",
    joined: "2026-07-15",
  },
  {
    id: "CUS-1005",
    name: "Karthik Raj",
    email: "karthik.raj@example.com",
    phone: "+91 90909 80808",
    address: "Tambaram, Chennai",
    orders: 5,
    spent: 2100,
    status: "Active",
    joined: "2026-09-18",
  },
  {
    id: "CUS-1006",
    name: "Divya Nair",
    email: "divya.nair@example.com",
    phone: "+91 93456 78901",
    address: "OMR, Chennai",
    orders: 14,
    spent: 6900,
    status: "Blocked",
    joined: "2026-09-22",
  },
];

function getSavedCustomers() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return initialCustomers;

    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : initialCustomers;
  } catch {
    return initialCustomers;
  }
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

function Customers() {
  const [customers, setCustomers] = useState(getSavedCustomers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
    } catch {
      setNotice("Unable to save changes in browser storage.");
    }
  }, [customers]);

  useEffect(() => {
    if (!notice) return undefined;

    const timer = setTimeout(() => setNotice(""), 3500);
    return () => clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowAddModal(false);
        setSelectedCustomer(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const stats = useMemo(
    () => ({
      total: customers.length,
      active: customers.filter((customer) => customer.status === "Active")
        .length,
      blocked: customers.filter((customer) => customer.status === "Blocked")
        .length,
      orders: customers.reduce(
        (total, customer) => total + Number(customer.orders || 0),
        0
      ),
    }),
    [customers]
  );

  const filteredCustomers = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return customers.filter((customer) => {
      const matchesSearch = [
        customer.name,
        customer.email,
        customer.phone,
        customer.id,
      ].some((value) => String(value || "").toLowerCase().includes(searchText));

      const matchesStatus =
        statusFilter === "All" || customer.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [customers, search, statusFilter]);

  const handleAddCustomer = (event) => {
    event.preventDefault();

    const newCustomer = {
      id: `CUS-${Date.now().toString().slice(-6)}`,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      orders: 0,
      spent: 0,
      status: "Active",
      joined: new Date().toISOString().slice(0, 10),
    };

    setCustomers((previous) => [newCustomer, ...previous]);
    setForm({ name: "", email: "", phone: "", address: "" });
    setShowAddModal(false);
    setSearch("");
    setStatusFilter("All");
    setNotice("Customer added successfully.");
  };

  const toggleCustomerStatus = (id) => {
    const customer = customers.find((item) => item.id === id);
    if (!customer) return;

    const nextStatus = customer.status === "Active" ? "Blocked" : "Active";

    setCustomers((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, status: nextStatus } : item
      )
    );

    setSelectedCustomer((previous) =>
      previous?.id === id ? { ...previous, status: nextStatus } : previous
    );

    setNotice(
      `${customer.name} has been ${nextStatus === "Blocked" ? "blocked" : "activated"}.`
    );
  };

  const cardClass =
    "card-animate hover-card rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900";

  const buttonClass =
    "button-animate inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400";

  const statsCards = [
    {
      label: "Total Customers",
      value: stats.total,
      icon: FiUsers,
      color: "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
    },
    {
      label: "Active Customers",
      value: stats.active,
      icon: FiUserCheck,
      color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    },
    {
      label: "Blocked Customers",
      value: stats.blocked,
      icon: FiUserX,
      color: "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400",
    },
    {
      label: "Total Orders",
      value: stats.orders,
      icon: FiShoppingBag,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    },
  ];

  return (
    <div className="page-animate min-w-0 space-y-6">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
            Foodie Admin / Customers
          </p>

          <h1 className="mt-1 text-2xl font-extrabold text-slate-800 dark:text-white sm:text-3xl">
            Customers
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-gray-400">
            Manage customer profiles and monitor their activity.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className={`${buttonClass} w-fit bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-600`}
        >
          <FiPlus size={18} />
          Add Customer
        </button>
      </div>

      {/* Notification */}
      {notice && (
        <div
          role="status"
          className="card-animate flex items-center justify-between gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300"
        >
          <span>{notice}</span>
          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Dismiss notification"
            className="rounded-lg p-1 hover:bg-green-100 dark:hover:bg-green-900"
          >
            <FiX size={18} />
          </button>
        </div>
      )}

      {/* Summary cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              style={{ animationDelay: `${index * 80}ms` }}
              className={cardClass}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-500 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <h2 className="mt-3 text-2xl font-extrabold text-slate-800 dark:text-white">
                    {stat.value.toLocaleString("en-IN")}
                  </h2>
                </div>

                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 hover:scale-110 ${stat.color}`}
                >
                  <Icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Customer directory */}
      <section className="card-animate overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-900">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 md:flex-row md:items-center md:justify-between dark:border-gray-700">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">
              Customer Directory
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
              {filteredCustomers.length} customers found
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <FiSearch
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search customers..."
                aria-label="Search customers"
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 sm:w-64 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter customers by status"
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all duration-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-slate-50 dark:bg-gray-800">
              <tr className="text-xs uppercase tracking-wide text-slate-500 dark:text-gray-400">
                <th className="px-5 py-4 font-semibold">Customer</th>
                <th className="px-5 py-4 font-semibold">Contact</th>
                <th className="px-5 py-4 font-semibold">Orders</th>
                <th className="px-5 py-4 font-semibold">Total Spent</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-gray-700">
              {filteredCustomers.map((customer, index) => (
                <tr
                  key={customer.id}
                  style={{ animationDelay: `${Math.min(index * 35, 210)}ms` }}
                  className="table-row-animate transition-colors duration-200 hover:bg-orange-50/70 dark:hover:bg-gray-800"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-600 transition-transform duration-300 hover:scale-110 dark:bg-orange-500/10 dark:text-orange-400">
                        {customer.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>

                      <div>
                        <p className="font-semibold text-slate-800 dark:text-white">
                          {customer.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {customer.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm text-slate-700 dark:text-gray-300">
                      {customer.email}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {customer.phone}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm font-semibold text-slate-700 dark:text-gray-300">
                    {customer.orders}
                  </td>

                  <td className="px-5 py-4 text-sm font-semibold text-slate-700 dark:text-gray-300">
                    {formatCurrency(customer.spent)}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                        customer.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                          : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        title="View details"
                        aria-label={`View ${customer.name}`}
                        onClick={() => setSelectedCustomer(customer)}
                        className={`${buttonClass} border border-slate-200 p-2 text-slate-500 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800`}
                      >
                        <FiEye size={17} />
                      </button>

                      <button
                        type="button"
                        title={
                          customer.status === "Active"
                            ? "Block customer"
                            : "Activate customer"
                        }
                        aria-label={
                          customer.status === "Active"
                            ? `Block ${customer.name}`
                            : `Activate ${customer.name}`
                        }
                        onClick={() => toggleCustomerStatus(customer.id)}
                        className={`${buttonClass} border p-2 ${
                          customer.status === "Active"
                            ? "border-red-100 text-red-500 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/40"
                            : "border-emerald-100 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-900 dark:hover:bg-emerald-950/40"
                        }`}
                      >
                        <FiShield size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-12 text-center text-sm text-slate-500 dark:text-gray-400"
                  >
                    <FiUsers className="mx-auto mb-3 text-slate-300" size={30} />
                    <p className="font-semibold">No customers found.</p>
                    <p className="mt-1">
                      Try changing your search or filter.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearch("");
                        setStatusFilter("All");
                      }}
                      className="mt-3 font-semibold text-orange-600 hover:text-orange-700"
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

      {/* Add Customer modal */}
      {showAddModal && (
        <div
          className="overlay-animate fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowAddModal(false);
          }}
        >
          <div className="modal-animate my-auto max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                  Add Customer
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                  Enter the new customer's details.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                aria-label="Close add customer form"
                className="rounded-lg p-2 text-slate-500 transition-all duration-200 hover:rotate-90 hover:bg-slate-100 dark:hover:bg-gray-800"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-gray-300">
                  Full Name
                </label>
                <input
                  required
                  minLength={2}
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  placeholder="Enter full name"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition-all duration-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-gray-300">
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm({ ...form, email: event.target.value })
                  }
                  placeholder="customer@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition-all duration-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-gray-300">
                  Phone Number
                </label>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(event) =>
                    setForm({ ...form, phone: event.target.value })
                  }
                  placeholder="+91 98765 43210"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition-all duration-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-gray-300">
                  Address
                </label>
                <input
                  required
                  value={form.address}
                  onChange={(event) =>
                    setForm({ ...form, address: event.target.value })
                  }
                  placeholder="Area, city"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition-all duration-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className={`${buttonClass} flex-1 border border-slate-200 px-4 py-3 font-semibold text-slate-600 hover:bg-slate-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800`}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className={`${buttonClass} flex-1 bg-orange-500 px-4 py-3 font-semibold text-white hover:bg-orange-600`}
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer profile modal */}
      {selectedCustomer && (
        <div
          className="overlay-animate fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedCustomer(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="customer-profile-title"
            className="modal-animate my-auto max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-900"
          >
            <div className="mb-6 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                  Customer Profile
                </p>
                <h2
                  id="customer-profile-title"
                  className="mt-1 text-xl font-bold text-slate-800 dark:text-white"
                >
                  {selectedCustomer.name}
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                  {selectedCustomer.id}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                aria-label="Close customer profile"
                className="rounded-lg p-2 text-slate-500 transition-all duration-200 hover:rotate-90 hover:bg-slate-100 dark:hover:bg-gray-800"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="mb-6 flex items-center gap-4 rounded-xl bg-orange-50 p-4 transition-all duration-300 hover:bg-orange-100 dark:bg-orange-500/10 dark:hover:bg-orange-500/15">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-orange-100 text-lg font-bold text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">
                {selectedCustomer.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>

              <div className="min-w-0">
                <p className="font-semibold text-slate-800 dark:text-white">
                  {selectedCustomer.name}
                </p>
                <span
                  className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    selectedCustomer.status === "Active"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                      : "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                  }`}
                >
                  {selectedCustomer.status}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  label: "Email",
                  value: selectedCustomer.email,
                  icon: FiMail,
                },
                {
                  label: "Phone",
                  value: selectedCustomer.phone,
                  icon: FiPhone,
                },
                {
                  label: "Address",
                  value: selectedCustomer.address || "No address provided",
                  icon: FiMapPin,
                },
                {
                  label: "Joined On",
                  value: selectedCustomer.joined,
                  icon: FiCalendar,
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="flex items-start gap-3 rounded-lg p-2 transition-colors duration-200 hover:bg-orange-50 dark:hover:bg-gray-800"
                  >
                    <Icon className="mt-1 shrink-0 text-orange-500" />

                    <div className="min-w-0">
                      <p className="text-xs text-slate-400">{item.label}</p>
                      <p className="break-words text-sm text-slate-700 dark:text-gray-300">
                        {item.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:bg-gray-800">
                <FiShoppingBag className="mb-2 text-orange-500" size={20} />
                <p className="text-xs text-slate-500 dark:text-gray-400">
                  Total Orders
                </p>
                <p className="mt-1 text-xl font-bold text-slate-800 dark:text-white">
                  {selectedCustomer.orders}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:bg-gray-800">
                <FiDollarSign className="mb-2 text-emerald-600" size={20} />
                <p className="text-xs text-slate-500 dark:text-gray-400">
                  Total Spent
                </p>
                <p className="mt-1 text-xl font-bold text-slate-800 dark:text-white">
                  {formatCurrency(selectedCustomer.spent)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => toggleCustomerStatus(selectedCustomer.id)}
              className={`${buttonClass} mt-6 w-full py-3 font-semibold ${
                selectedCustomer.status === "Active"
                  ? "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
              }`}
            >
              <FiShield size={17} />
              {selectedCustomer.status === "Active"
                ? "Block Customer"
                : "Activate Customer"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customers;
