
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
    return saved ? JSON.parse(saved) : initialCustomers;
  } catch {
    return initialCustomers;
  }
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function Customers() {
  const [customers, setCustomers] = useState(getSavedCustomers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
  }, [customers]);

  const stats = useMemo(() => {
    return {
      total: customers.length,
      active: customers.filter((customer) => customer.status === "Active")
        .length,
      blocked: customers.filter((customer) => customer.status === "Blocked")
        .length,
      orders: customers.reduce(
        (total, customer) => total + Number(customer.orders || 0),
        0
      ),
    };
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        customer.name.toLowerCase().includes(searchText) ||
        customer.email.toLowerCase().includes(searchText) ||
        customer.phone.toLowerCase().includes(searchText) ||
        customer.id.toLowerCase().includes(searchText);

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
  };

  const toggleCustomerStatus = (id) => {
    setCustomers((previous) =>
      previous.map((customer) =>
        customer.id === id
          ? {
              ...customer,
              status: customer.status === "Active" ? "Blocked" : "Active",
            }
          : customer
      )
    );

    setSelectedCustomer((previous) =>
      previous?.id === id
        ? {
            ...previous,
            status: previous.status === "Active" ? "Blocked" : "Active",
          }
        : previous
    );
  };

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-orange-600">
            Foodie Admin / Customers
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-800 sm:text-3xl">
            Customers
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage customer profiles and monitor their activity.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
        >
          <FiPlus size={18} />
          Add Customer
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total Customers",
            value: stats.total,
            icon: FiUsers,
            color: "bg-orange-100 text-orange-600",
          },
          {
            label: "Active Customers",
            value: stats.active,
            icon: FiUserCheck,
            color: "bg-emerald-100 text-emerald-600",
          },
          {
            label: "Blocked Customers",
            value: stats.blocked,
            icon: FiUserX,
            color: "bg-red-100 text-red-600",
          },
          {
            label: "Total Orders",
            value: stats.orders,
            icon: FiShoppingBag,
            color: "bg-blue-100 text-blue-600",
          },
        ].map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <h2 className="mt-3 text-2xl font-bold text-slate-800">
                    {stat.value.toLocaleString("en-IN")}
                  </h2>
                </div>
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}
                >
                  <Icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Customer Directory
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {filteredCustomers.length} customers found
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <FiSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search customers..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100 sm:w-64"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-slate-50">
              <tr className="text-xs uppercase tracking-wide text-slate-500">
                <th className="px-5 py-4 font-semibold">Customer</th>
                <th className="px-5 py-4 font-semibold">Contact</th>
                <th className="px-5 py-4 font-semibold">Orders</th>
                <th className="px-5 py-4 font-semibold">Total Spent</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="transition hover:bg-slate-50"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-600">
                        {customer.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">
                          {customer.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {customer.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm text-slate-700">{customer.email}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {customer.phone}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                    {customer.orders}
                  </td>

                  <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                    {formatCurrency(customer.spent)}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        customer.status === "Active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        title="View details"
                        onClick={() => setSelectedCustomer(customer)}
                        className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
                      >
                        <FiEye size={17} />
                      </button>

                      <button
                        title={
                          customer.status === "Active"
                            ? "Block customer"
                            : "Activate customer"
                        }
                        onClick={() => toggleCustomerStatus(customer.id)}
                        className={`rounded-lg border p-2 transition ${
                          customer.status === "Active"
                            ? "border-red-100 text-red-500 hover:bg-red-50"
                            : "border-emerald-100 text-emerald-600 hover:bg-emerald-50"
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
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    No customers found. Try changing your search or filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4">
          <div className="my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Add Customer
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Enter the new customer's details.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
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
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
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
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
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
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Address
                </label>
                <input
                  required
                  value={form.address}
                  onChange={(event) =>
                    setForm({ ...form, address: event.target.value })
                  }
                  placeholder="Area, city"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600"
              >
                Save Customer
              </button>
            </form>
          </div>
        </div>
      )}

      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4">
          <div className="my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">
                  Customer Profile
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-800">
                  {selectedCustomer.name}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedCustomer.id}
                </p>
              </div>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="mb-6 flex items-center gap-4 rounded-xl bg-orange-50 p-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-lg font-bold text-orange-600">
                {selectedCustomer.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-slate-800">
                  {selectedCustomer.name}
                </p>
                <span
                  className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    selectedCustomer.status === "Active"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {selectedCustomer.status}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FiMail className="mt-1 text-orange-500" />
                <div>
                  <p className="text-xs text-slate-400">Email</p>
                  <p className="break-all text-sm text-slate-700">
                    {selectedCustomer.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FiPhone className="mt-1 text-orange-500" />
                <div>
                  <p className="text-xs text-slate-400">Phone</p>
                  <p className="text-sm text-slate-700">
                    {selectedCustomer.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FiMapPin className="mt-1 text-orange-500" />
                <div>
                  <p className="text-xs text-slate-400">Address</p>
                  <p className="text-sm text-slate-700">
                    {selectedCustomer.address || "No address provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FiCalendar className="mt-1 text-orange-500" />
                <div>
                  <p className="text-xs text-slate-400">Joined On</p>
                  <p className="text-sm text-slate-700">
                    {selectedCustomer.joined}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <FiShoppingBag className="mb-2 text-orange-500" size={20} />
                <p className="text-xs text-slate-500">Total Orders</p>
                <p className="mt-1 text-xl font-bold text-slate-800">
                  {selectedCustomer.orders}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <FiDollarSign className="mb-2 text-emerald-600" size={20} />
                <p className="text-xs text-slate-500">Total Spent</p>
                <p className="mt-1 text-xl font-bold text-slate-800">
                  {formatCurrency(selectedCustomer.spent)}
                </p>
              </div>
            </div>

            <button
              onClick={() => toggleCustomerStatus(selectedCustomer.id)}
              className={`mt-6 w-full rounded-xl py-3 font-semibold transition ${
                selectedCustomer.status === "Active"
                  ? "bg-red-50 text-red-600 hover:bg-red-100"
                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              }`}
            >
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
