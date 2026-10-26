
import { useMemo, useState } from "react";
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
  startDate: "2026-10-24",
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
      setError("Coupon code must be 3–20 characters using letters, numbers, _ or -.");
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
    setSuccess("");
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

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Offers & Promotions
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Create coupons and manage discounts for your customers.
          </p>
        </div>

        <button
          onClick={openCreateForm}
          className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          <FiPlus size={18} />
          Create Coupon
        </button>
      </div>

      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          <FiCheckCircle size={18} />
          <span>{success}</span>
          <button
            onClick={() => setSuccess("")}
            className="ml-auto rounded-lg p-1 hover:bg-green-100"
            aria-label="Dismiss message"
          >
            <FiX size={16} />
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total Coupons",
            value: promotions.length,
            icon: FiTag,
            color: "bg-blue-50 text-blue-600",
          },
          {
            label: "Active Coupons",
            value: activeCount,
            icon: FiGift,
            color: "bg-green-50 text-green-600",
          },
          {
            label: "Total Redemptions",
            value: totalUses.toLocaleString("en-IN"),
            icon: FiUsers,
            color: "bg-purple-50 text-purple-600",
          },
          {
            label: "Usage Capacity",
            value: `${totalUses}/${totalCapacity}`,
            icon: FiPercent,
            color: "bg-orange-50 text-orange-600",
          },
        ].map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
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

      {/* Search and filters */}
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row">
        <div className="relative flex-1">
          <FiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search coupon code or offer name..."
            className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Promotion cards */}
      {filteredPromotions.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {filteredPromotions.map((promotion) => {
            const usagePercent =
              promotion.usageLimit > 0
                ? Math.min(
                    100,
                    (promotion.used / promotion.usageLimit) * 100
                  )
                : 0;

            return (
              <div
                key={promotion.id}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl bg-orange-50 p-3 text-orange-600">
                      <FiTag size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {promotion.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Coupon code
                      </p>
                      <p className="mt-1 inline-block rounded-lg border border-dashed border-orange-300 bg-orange-50 px-3 py-1 font-mono font-bold tracking-wider text-orange-700">
                        {promotion.code}
                      </p>
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-2xl font-bold text-orange-600">
                      {discountLabel(promotion)}
                    </p>
                    <span
                      className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                        promotion.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {promotion.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-gray-100 px-5 py-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-gray-500">Minimum Order</p>
                    <p className="mt-1 font-semibold text-gray-900">
                      {formatMoney(promotion.minimumOrder)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Max Discount</p>
                    <p className="mt-1 font-semibold text-gray-900">
                      {formatMoney(promotion.maxDiscount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Expires On</p>
                    <p className="mt-1 font-semibold text-gray-900">
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

                <div className="border-t border-gray-100 px-5 py-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-gray-500">Coupon usage</span>
                    <span className="font-semibold text-gray-700">
                      {promotion.used} / {promotion.usageLimit}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-orange-500 transition-all"
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <FiCalendar size={14} />
                      Starts{" "}
                      {new Date(
                        `${promotion.startDate}T00:00:00`
                      ).toLocaleDateString("en-IN")}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleStatus(promotion.id)}
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                          promotion.status === "Active"
                            ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                            : "bg-green-50 text-green-700 hover:bg-green-100"
                        }`}
                      >
                        <FiPower size={14} />
                        {promotion.status === "Active" ? "Deactivate" : "Activate"}
                      </button>

                      <button
                        onClick={() => deletePromotion(promotion.id)}
                        title="Delete coupon"
                        className="rounded-lg border border-red-100 p-2 text-red-500 transition hover:bg-red-50"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-white px-5 py-16 text-center shadow-sm">
          <FiTag className="mx-auto text-gray-300" size={36} />
          <h3 className="mt-3 font-bold text-gray-800">No coupons found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try another search or create a new coupon.
          </p>
        </div>
      )}

      {/* Create coupon modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 p-4"
          onClick={() => setShowForm(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 p-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Create New Coupon
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Configure a discount for your customers.
                </p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close form"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={createPromotion} className="space-y-5 p-5">
              {error && (
                <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </p>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-gray-700">
                  Coupon Code
                  <input
                    name="code"
                    value={form.code}
                    onChange={updateField}
                    required
                    maxLength={20}
                    placeholder="e.g. SAVE20"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 uppercase outline-none focus:border-orange-400"
                  />
                </label>

                <label className="space-y-2 text-sm font-medium text-gray-700">
                  Offer Name
                  <input
                    name="title"
                    value={form.title}
                    onChange={updateField}
                    required
                    maxLength={60}
                    placeholder="e.g. Festival Special"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-400"
                  />
                </label>

                <label className="space-y-2 text-sm font-medium text-gray-700">
                  Discount Type
                  <select
                    name="type"
                    value={form.type}
                    onChange={updateField}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-orange-400"
                  >
                    <option value="Percentage">Percentage (%)</option>
                    <option value="Fixed">Fixed Amount (₹)</option>
                  </select>
                </label>

                <label className="space-y-2 text-sm font-medium text-gray-700">
                  Discount {form.type === "Percentage" ? "(%)" : "(₹)"}
                  <input
                    name="discount"
                    type="number"
                    min="1"
                    max={form.type === "Percentage" ? "100" : undefined}
                    value={form.discount}
                    onChange={updateField}
                    required
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-400"
                  />
                </label>

                <label className="space-y-2 text-sm font-medium text-gray-700">
                  Minimum Order (₹)
                  <input
                    name="minimumOrder"
                    type="number"
                    min="0"
                    value={form.minimumOrder}
                    onChange={updateField}
                    required
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-400"
                  />
                </label>

                <label className="space-y-2 text-sm font-medium text-gray-700">
                  Maximum Discount (₹)
                  <input
                    name="maxDiscount"
                    type="number"
                    min="1"
                    value={form.maxDiscount}
                    onChange={updateField}
                    required
                    disabled={form.type === "Fixed"}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-400 disabled:bg-gray-100"
                  />
                </label>

                <label className="space-y-2 text-sm font-medium text-gray-700">
                  Usage Limit
                  <input
                    name="usageLimit"
                    type="number"
                    min="1"
                    value={form.usageLimit}
                    onChange={updateField}
                    required
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-400"
                  />
                </label>

                <label className="space-y-2 text-sm font-medium text-gray-700">
                  Start Date
                  <input
                    name="startDate"
                    type="date"
                    value={form.startDate}
                    onChange={updateField}
                    required
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-400"
                  />
                </label>

                <label className="space-y-2 text-sm font-medium text-gray-700 sm:col-span-2">
                  Expiry Date
                  <input
                    name="expiryDate"
                    type="date"
                    min={form.startDate}
                    value={form.expiryDate}
                    onChange={updateField}
                    required
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-400"
                  />
                </label>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                >
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
