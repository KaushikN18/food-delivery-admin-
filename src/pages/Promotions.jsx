
import { useEffect, useMemo, useState } from "react";
import {
  FiTag,
  FiPlus,
  FiSearch,
  FiPercent,
  FiCalendar,
  FiUsers,
  FiX,
  FiTrash2,
  FiPower,
  FiGift,
  FiCheckCircle,
} from "react-icons/fi";

const initialPromotions = [
  {
    id: 1,
    code: "WELCOME50",
    title: "Welcome Offer",
    type: "Percentage",
    discount: 50,
    minimumOrder: 199,
    maxDiscount: 100,
    usageLimit: 500,
    used: 128,
    startDate: "2026-10-01",
    expiryDate: "2026-12-31",
    status: "Active",
  },
  {
    id: 2,
    code: "FLAT100",
    title: "Flat ₹100 Off",
    type: "Fixed",
    discount: 100,
    minimumOrder: 499,
    maxDiscount: 100,
    usageLimit: 300,
    used: 94,
    startDate: "2026-10-01",
    expiryDate: "2026-11-30",
    status: "Active",
  },
  {
    id: 3,
    code: "WEEKEND20",
    title: "Weekend Special",
    type: "Percentage",
    discount: 20,
    minimumOrder: 299,
    maxDiscount: 150,
    usageLimit: 200,
    used: 200,
    startDate: "2026-09-01",
    expiryDate: "2026-10-31",
    status: "Inactive",
  },
  {
    id: 4,
    code: "FREESHIP",
    title: "Free Delivery",
    type: "Fixed",
    discount: 40,
    minimumOrder: 299,
    maxDiscount: 40,
    usageLimit: 400,
    used: 156,
    startDate: "2026-10-10",
    expiryDate: "2026-12-15",
    status: "Active",
  },
];

const formatMoney = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const emptyForm = {
  code: "",
  title: "",
  type: "Percentage",
  discount: "10",
  minimumOrder: "199",
  maxDiscount: "100",
  usageLimit: "100",
  startDate: new Date().toLocaleDateString("en-CA"),
  expiryDate: "2026-12-31",
};

function Promotions() {
  const [promotions, setPromotions] = useState(initialPromotions);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!success) return undefined;

    const timer = setTimeout(() => setSuccess(""), 3500);
    return () => clearTimeout(timer);
  }, [success]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setShowForm(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredPromotions = useMemo(() => {
    return promotions.filter((promotion) => {
      const searchText = search.trim().toLowerCase();

      const matchesSearch =
        promotion.code.toLowerCase().includes(searchText) ||
        promotion.title.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All" || promotion.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [promotions, search, statusFilter]);

  const activeCount = promotions.filter(
    (promotion) => promotion.status === "Active"
  ).length;

  const totalUses = promotions.reduce(
    (total, promotion) => total + promotion.used,
    0
  );

  const totalCapacity = promotions.reduce(
    (total, promotion) => total + promotion.usageLimit,
    0
  );

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError("");
    setSuccess("");
  };

  const openCreateForm = () => {
    setForm({
      ...emptyForm,
      startDate: new Date().toLocaleDateString("en-CA"),
    });
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const createPromotion = (event) => {
    event.preventDefault();

    const code = form.code.trim().toUpperCase();
    const discount = Number(form.discount);
    const minimumOrder = Number(form.minimumOrder);
    const maxDiscount = Number(form.maxDiscount);
    const usageLimit = Number(form.usageLimit);

    if (!/^[A-Z0-9_-]{3,20}$/.test(code)) {
      setError(
        "Coupon code must be 3–20 characters using letters, numbers, _ or -."
      );
      return;
    }

    if (promotions.some((promotion) => promotion.code === code)) {
      setError("This coupon code already exists. Please choose another.");
      return;
    }

    if (
      !form.title.trim() ||
      !form.startDate ||
      !form.expiryDate ||
      !Number.isFinite(discount) ||
      discount <= 0 ||
      !Number.isFinite(minimumOrder) ||
      minimumOrder < 0 ||
      !Number.isFinite(maxDiscount) ||
      maxDiscount <= 0 ||
      !Number.isFinite(usageLimit) ||
      usageLimit <= 0
    ) {
      setError("Please enter valid values in all fields.");
      return;
    }

    if (form.expiryDate < form.startDate) {
      setError("Expiry date must be on or after the start date.");
      return;
    }

    if (form.type === "Percentage" && discount > 100) {
      setError("Percentage discount cannot be more than 100%.");
      return;
    }

    const newPromotion = {
      id: Date.now(),
      code,
      title: form.title.trim(),
      type: form.type,
      discount,
      minimumOrder,
      maxDiscount: form.type === "Fixed" ? discount : maxDiscount,
      usageLimit,
      used: 0,
      startDate: form.startDate,
      expiryDate: form.expiryDate,
      status: "Active",
    };

    setPromotions((current) => [newPromotion, ...current]);
    setShowForm(false);
    setSearch("");
    setStatusFilter("All");
    setSuccess(`Coupon ${code} created successfully.`);
  };

  const toggleStatus = (id) => {
    setPromotions((current) =>
      current.map((promotion) =>
        promotion.id === id
          ? {
              ...promotion,
              status: promotion.status === "Active" ? "Inactive" : "Active",
            }
          : promotion
      )
    );

    setSuccess("Coupon status updated.");
  };

  const deletePromotion = (id) => {
    const promotion = promotions.find((item) => item.id === id);
    if (!promotion) return;

    const confirmed = window.confirm(
      `Delete coupon ${promotion.code}? This cannot be undone.`
    );

    if (!confirmed) return;

    setPromotions((current) => current.filter((item) => item.id !== id));
    setSuccess(`Coupon ${promotion.code} deleted.`);
  };

  const discountLabel = (promotion) =>
    promotion.type === "Percentage"
      ? `${promotion.discount}% OFF`
      : `${formatMoney(promotion.discount)} OFF`;

  const buttonClass =
    "button-animate inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400";

  const stats = [
    {
      label: "Total Coupons",
      value: promotions.length,
      icon: FiTag,
      color:
        "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    },
    {
      label: "Active Coupons",
      value: activeCount,
      icon: FiGift,
      color:
        "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400",
    },
    {
      label: "Total Redemptions",
      value: totalUses.toLocaleString("en-IN"),
      icon: FiUsers,
      color:
        "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
    },
    {
      label: "Usage Capacity",
      value: `${totalUses}/${totalCapacity}`,
      icon: FiPercent,
      color:
        "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
    },
  ];

  return (
    <div className="page-animate min-w-0 space-y-6">
      {/* Page header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Overview / Marketing
          </p>

          <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            Offers &amp; Promotions
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Create coupons and manage discounts for your customers.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className={`${buttonClass} w-fit bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 hover:shadow-lg`}
        >
          <FiPlus size={18} className="transition-transform duration-200 group-hover:rotate-90" />
          Create Coupon
        </button>
      </div>

      {/* Success notification */}
      {success && (
        <div
          role="status"
          className="card-animate flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-900/20 dark:text-green-300"
        >
          <FiCheckCircle size={18} className="shrink-0" />
          <span>{success}</span>

          <button
            type="button"
            onClick={() => setSuccess("")}
            className="ml-auto rounded-lg p-1 transition-colors hover:bg-green-100 dark:hover:bg-green-900/50"
            aria-label="Dismiss message"
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

                  <h2 className="mt-2 text-2xl font-bold text-gray-900 transition-colors duration-200 group-hover:text-orange-600 dark:text-white dark:group-hover:text-orange-400">
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

      {/* Search and filters */}
      <section className="card-animate hover-card flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row dark:border-gray-700 dark:bg-gray-900">
        <div className="group relative min-w-0 flex-1">
          <FiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-orange-500"
            size={18}
          />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search coupon code or offer name..."
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-800 outline-none transition-all duration-200 placeholder:text-gray-400 hover:border-orange-300 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-orange-900/30"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-all duration-200 hover:border-orange-300 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:focus:ring-orange-900/30"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        {(search || statusFilter !== "All") && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setStatusFilter("All");
            }}
            className={`${buttonClass} border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-orange-50 hover:text-orange-600 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800`}
          >
            Clear
          </button>
        )}
      </section>

      {/* Promotion cards */}
      {filteredPromotions.length > 0 ? (
        <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {filteredPromotions.map((promotion, index) => {
            const usagePercent =
              promotion.usageLimit > 0
                ? Math.min(
                    100,
                    (promotion.used / promotion.usageLimit) * 100
                  )
                : 0;

            return (
              <article
                key={promotion.id}
                style={{ animationDelay: `${Math.min(index * 80, 320)}ms` }}
                className="card-animate hover-card group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900"
              >
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="shrink-0 rounded-2xl bg-orange-50 p-3 text-orange-600 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110 dark:bg-orange-500/10 dark:text-orange-400">
                      <FiTag size={24} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-900 transition-colors group-hover:text-orange-600 dark:text-white dark:group-hover:text-orange-400">
                        {promotion.title}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Coupon code
                      </p>

                      <p className="mt-1 inline-block rounded-lg border border-dashed border-orange-300 bg-orange-50 px-3 py-1 font-mono font-bold tracking-wider text-orange-700 transition-colors hover:bg-orange-100 dark:border-orange-700 dark:bg-orange-500/10 dark:text-orange-300">
                        {promotion.code}
                      </p>
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-2xl font-bold text-orange-600 transition-transform duration-200 group-hover:scale-105 dark:text-orange-400">
                      {discountLabel(promotion)}
                    </p>

                    <span
                      className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                        promotion.status === "Active"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {promotion.status}
                    </span>
                  </div>
                </div>

                {/* Coupon information */}
                <div className="grid grid-cols-2 gap-4 border-t border-gray-100 px-5 py-4 sm:grid-cols-3 dark:border-gray-700">
                  <div className="rounded-lg p-2 transition-colors hover:bg-orange-50 dark:hover:bg-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Minimum Order
                    </p>
                    <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                      {formatMoney(promotion.minimumOrder)}
                    </p>
                  </div>

                  <div className="rounded-lg p-2 transition-colors hover:bg-orange-50 dark:hover:bg-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Max Discount
                    </p>
                    <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                      {formatMoney(promotion.maxDiscount)}
                    </p>
                  </div>

                  <div className="rounded-lg p-2 transition-colors hover:bg-orange-50 dark:hover:bg-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Expires On
                    </p>
                    <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                      {new Date(
                        `${promotion.expiryDate}T00:00:00`
                      ).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* Coupon usage */}
                <div className="border-t border-gray-100 px-5 py-4 dark:border-gray-700">
                  <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Coupon usage
                    </span>

                    <span className="font-semibold text-gray-700 dark:text-gray-200">
                      {promotion.used} / {promotion.usageLimit}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      className="h-full rounded-full bg-orange-500 transition-all duration-700 ease-out"
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <FiCalendar size={14} className="text-orange-500" />
                      Starts{" "}
                      {new Date(
                        `${promotion.startDate}T00:00:00`
                      ).toLocaleDateString("en-IN")}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => toggleStatus(promotion.id)}
                        className={`${buttonClass} px-3 py-2 text-xs font-semibold ${
                          promotion.status === "Active"
                            ? "bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-300 dark:hover:bg-amber-500/20"
                            : "bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-500/10 dark:text-green-300 dark:hover:bg-green-500/20"
                        }`}
                      >
                        <FiPower size={14} />
                        {promotion.status === "Active"
                          ? "Deactivate"
                          : "Activate"}
                      </button>

                      <button
                        type="button"
                        onClick={() => deletePromotion(promotion.id)}
                        title="Delete coupon"
                        aria-label={`Delete coupon ${promotion.code}`}
                        className="button-animate rounded-lg border border-red-100 p-2 text-red-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-900 dark:hover:bg-red-900/30"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <section className="card-animate hover-card rounded-2xl border border-gray-100 bg-white px-5 py-16 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <FiTag className="mx-auto text-gray-300 dark:text-gray-600" size={36} />

          <h3 className="mt-3 font-bold text-gray-800 dark:text-white">
            No coupons found
          </h3>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Try another search or create a new coupon.
          </p>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setStatusFilter("All");
            }}
            className={`${buttonClass} mt-4 bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600`}
          >
            Clear Filters
          </button>
        </section>
      )}

      {/* Create coupon modal */}
      {showForm && (
        <div
          className="overlay-animate fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-gray-950/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowForm(false);
          }}
        >
          <div className="modal-animate my-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gray-100 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-100 p-5 dark:border-gray-700">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Create New Coupon
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Configure a discount for your customers.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg p-2 text-gray-500 transition-all duration-200 hover:rotate-90 hover:bg-gray-100 hover:text-orange-600 dark:hover:bg-gray-800"
                aria-label="Close form"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={createPromotion} className="space-y-5 p-5">
              {error && (
                <div
                  role="alert"
                  className="overlay-animate rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-900/20 dark:text-red-300"
                >
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span className="block">Coupon Code</span>
                  <input
                    name="code"
                    value={form.code}
                    onChange={updateField}
                    required
                    maxLength={20}
                    placeholder="e.g. SAVE20"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 uppercase outline-none transition-all duration-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-orange-900/30"
                  />
                </label>

                <label className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span className="block">Offer Name</span>
                  <input
                    name="title"
                    value={form.title}
                    onChange={updateField}
                    required
                    maxLength={60}
                    placeholder="e.g. Festival Special"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition-all duration-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-orange-900/30"
                  />
                </label>

                <label className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span className="block">Discount Type</span>
                  <select
                    name="type"
                    value={form.type}
                    onChange={updateField}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition-all duration-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-orange-900/30"
                  >
                    <option value="Percentage">Percentage (%)</option>
                    <option value="Fixed">Fixed Amount (₹)</option>
                  </select>
                </label>

                <label className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span className="block">
                    Discount {form.type === "Percentage" ? "(%)" : "(₹)"}
                  </span>
                  <input
                    name="discount"
                    type="number"
                    min="1"
                    max={form.type === "Percentage" ? "100" : undefined}
                    value={form.discount}
                    onChange={updateField}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition-all duration-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-orange-900/30"
                  />
                </label>

                <label className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span className="block">Minimum Order (₹)</span>
                  <input
                    name="minimumOrder"
                    type="number"
                    min="0"
                    value={form.minimumOrder}
                    onChange={updateField}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition-all duration-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-orange-900/30"
                  />
                </label>

                <label className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span className="block">Maximum Discount (₹)</span>
                  <input
                    name="maxDiscount"
                    type="number"
                    min="1"
                    value={form.maxDiscount}
                    onChange={updateField}
                    required
                    disabled={form.type === "Fixed"}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition-all duration-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:disabled:bg-gray-700 dark:focus:ring-orange-900/30"
                  />
                </label>

                <label className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span className="block">Usage Limit</span>
                  <input
                    name="usageLimit"
                    type="number"
                    min="1"
                    value={form.usageLimit}
                    onChange={updateField}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition-all duration-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-orange-900/30"
                  />
                </label>

                <label className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span className="block">Start Date</span>
                  <input
                    name="startDate"
                    type="date"
                    value={form.startDate}
                    onChange={updateField}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition-all duration-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-orange-900/30"
                  />
                </label>

                <label className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-300 sm:col-span-2">
                  <span className="block">Expiry Date</span>
                  <input
                    name="expiryDate"
                    type="date"
                    min={form.startDate}
                    value={form.expiryDate}
                    onChange={updateField}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition-all duration-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-orange-900/30"
                  />
                </label>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className={`${buttonClass} border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800`}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className={`${buttonClass} bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600`}
                >
                  <FiPlus size={17} />
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Promotions;
