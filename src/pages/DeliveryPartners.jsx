
import { useEffect, useMemo, useState } from "react";
import {
  FiSearch,
  FiPlus,
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiTruck,
  FiStar,
  FiEye,
  FiX,
  FiPhone,
  FiMapPin,
  FiPower,
  FiCheck,
} from "react-icons/fi";

const STORAGE_KEY = "foodie-admin-delivery-partners";

const initialPartners = [
  {
    id: "DP-1001",
    name: "Karthik Raj",
    phone: "+91 98765 43210",
    email: "karthik@gmail.com",
    vehicle: "Two Wheeler",
    vehicleNumber: "TN09AB1234",
    zone: "Anna Nagar",
    rating: 4.8,
    deliveries: 245,
    earnings: 24500,
    status: "Verified",
    availability: "Online",
  },
  {
    id: "DP-1002",
    name: "Vijay Kumar",
    phone: "+91 98765 12345",
    email: "vijay@gmail.com",
    vehicle: "Two Wheeler",
    vehicleNumber: "TN10CD5678",
    zone: "T. Nagar",
    rating: 4.6,
    deliveries: 198,
    earnings: 19800,
    status: "Verified",
    availability: "Offline",
  },
  {
    id: "DP-1003",
    name: "Arun Prakash",
    phone: "+91 91234 56780",
    email: "arun@gmail.com",
    vehicle: "Electric Scooter",
    vehicleNumber: "TN11EF9012",
    zone: "Velachery",
    rating: 4.9,
    deliveries: 312,
    earnings: 31200,
    status: "Verified",
    availability: "Online",
  },
  {
    id: "DP-1004",
    name: "Manoj Kumar",
    phone: "+91 99887 66554",
    email: "manoj@gmail.com",
    vehicle: "Two Wheeler",
    vehicleNumber: "TN12GH3456",
    zone: "Adyar",
    rating: 4.3,
    deliveries: 86,
    earnings: 8600,
    status: "Pending",
    availability: "Offline",
  },
  {
    id: "DP-1005",
    name: "Suresh Babu",
    phone: "+91 90000 12345",
    email: "suresh@gmail.com",
    vehicle: "Bicycle",
    vehicleNumber: "TN13JK7890",
    zone: "Mylapore",
    rating: 4.5,
    deliveries: 120,
    earnings: 12000,
    status: "Pending",
    availability: "Offline",
  },
  {
    id: "DP-1006",
    name: "Ravi Shankar",
    phone: "+91 91111 22222",
    email: "ravi@gmail.com",
    vehicle: "Two Wheeler",
    vehicleNumber: "TN14LM4567",
    zone: "Guindy",
    rating: 4.1,
    deliveries: 64,
    earnings: 6400,
    status: "Rejected",
    availability: "Offline",
  },
];

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  vehicle: "Two Wheeler",
  vehicleNumber: "",
  zone: "",
};

const formatMoney = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

function getSavedPartners() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return initialPartners;

    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : initialPartners;
  } catch {
    return initialPartners;
  }
}

function DeliveryPartners() {
  const [partners, setPartners] = useState(getSavedPartners);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [availabilityFilter, setAvailabilityFilter] = useState("All");
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(partners));
    } catch {
      setNotice("Unable to save changes in browser storage.");
    }
  }, [partners]);

  useEffect(() => {
    if (!notice) return undefined;

    const timer = setTimeout(() => setNotice(""), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowForm(false);
        setSelectedPartner(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredPartners = useMemo(() => {
    const query = search.toLowerCase().trim();

    return partners.filter((partner) => {
      const matchesSearch = [
        partner.id,
        partner.name,
        partner.phone,
        partner.zone,
      ].some((value) => String(value ?? "").toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "All" || partner.status === statusFilter;

      const matchesAvailability =
        availabilityFilter === "All" ||
        partner.availability === availabilityFilter;

      return matchesSearch && matchesStatus && matchesAvailability;
    });
  }, [partners, search, statusFilter, availabilityFilter]);

  const verifiedCount = partners.filter(
    (partner) => partner.status === "Verified"
  ).length;

  const pendingCount = partners.filter(
    (partner) => partner.status === "Pending"
  ).length;

  const onlineCount = partners.filter(
    (partner) =>
      partner.status === "Verified" && partner.availability === "Online"
  ).length;

  const totalDeliveries = partners.reduce(
    (total, partner) => total + Number(partner.deliveries || 0),
    0
  );

  const totalEarnings = partners.reduce(
    (total, partner) => total + Number(partner.earnings || 0),
    0
  );

  const updatePartner = (id, updates) => {
    setPartners((current) =>
      current.map((partner) =>
        partner.id === id ? { ...partner, ...updates } : partner
      )
    );

    setSelectedPartner((current) =>
      current?.id === id ? { ...current, ...updates } : current
    );
  };

  const createPartner = (event) => {
    event.preventDefault();

    const newPartner = {
      id: `DP-${Date.now().toString().slice(-7)}`,
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      vehicle: form.vehicle,
      vehicleNumber: form.vehicleNumber.trim().toUpperCase(),
      zone: form.zone.trim(),
      rating: 0,
      deliveries: 0,
      earnings: 0,
      status: "Pending",
      availability: "Offline",
    };

    setPartners((current) => [newPartner, ...current]);
    setShowForm(false);
    setForm(emptyForm);
    setSearch("");
    setStatusFilter("All");
    setAvailabilityFilter("All");
    setNotice("Delivery partner registered and awaiting verification.");
  };

  const verifyPartner = (partner) => {
    updatePartner(partner.id, {
      status: "Verified",
      availability: "Offline",
    });

    setNotice(`${partner.name} has been verified.`);
  };

  const rejectPartner = (partner) => {
    updatePartner(partner.id, {
      status: "Rejected",
      availability: "Offline",
    });

    setNotice(`${partner.name}'s application was rejected.`);
  };

  const toggleAvailability = (partner) => {
    if (partner.status !== "Verified") {
      setNotice("Only verified delivery partners can go online.");
      return;
    }

    const availability =
      partner.availability === "Online" ? "Offline" : "Online";

    updatePartner(partner.id, { availability });
    setNotice(`${partner.name} is now ${availability.toLowerCase()}.`);
  };

  const stats = [
    {
      label: "Total Partners",
      value: partners.length,
      icon: FiUsers,
      color: "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
    },
    {
      label: "Verified Partners",
      value: verifiedCount,
      icon: FiCheckCircle,
      color: "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400",
    },
    {
      label: "Pending Verification",
      value: pendingCount,
      icon: FiClock,
      color: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
    },
    {
      label: "Online Partners",
      value: onlineCount,
      icon: FiTruck,
      color: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    },
  ];

  const cardClass =
    "card-animate hover-card rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900";

  const buttonClass =
    "button-animate inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2";

  return (
    <div className="page-animate min-w-0 space-y-6">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Overview / Delivery Management
          </p>

          <h1 className="mt-2 text-2xl font-extrabold text-gray-900 dark:text-white sm:text-3xl">
            Delivery Partners
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Manage delivery staff, verification, and availability.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setForm(emptyForm);
            setShowForm(true);
          }}
          className={`${buttonClass} w-fit bg-orange-500 px-5 py-3 text-sm font-bold text-white hover:bg-orange-600`}
        >
          <FiPlus size={18} />
          Add Partner
        </button>
      </div>

      {/* Status message */}
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
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              style={{ animationDelay: `${index * 80}ms` }}
              className={cardClass}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 hover:scale-110 ${stat.color}`}
              >
                <Icon size={23} />
              </div>

              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                {stat.label}
              </p>

              <h2 className="mt-1 text-2xl font-extrabold text-gray-900 dark:text-white">
                {stat.value}
              </h2>
            </div>
          );
        })}
      </section>

      {/* Delivery totals */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className={cardClass} style={{ animationDelay: "100ms" }}>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Completed Deliveries
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-gray-900 dark:text-white">
            {totalDeliveries.toLocaleString("en-IN")}
          </h2>
        </div>

        <div className={cardClass} style={{ animationDelay: "180ms" }}>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Partner Earnings
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-gray-900 dark:text-white">
            {formatMoney(totalEarnings)}
          </h2>
        </div>
      </section>

      {/* Search and filters */}
      <section className="card-animate hover-card rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="relative">
            <FiSearch
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, ID, phone, zone..."
              aria-label="Search delivery partners"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter by verification status"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-all duration-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="All">All Verification Statuses</option>
            <option value="Verified">Verified</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            value={availabilityFilter}
            onChange={(event) => setAvailabilityFilter(event.target.value)}
            aria-label="Filter by availability"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-all duration-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="All">All Availability</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
          </select>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span>
            Showing {filteredPartners.length} of {partners.length} partners
          </span>

          {(search || statusFilter !== "All" || availabilityFilter !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("All");
                setAvailabilityFilter("All");
              }}
              className="font-semibold text-orange-600 transition-colors hover:text-orange-700 dark:text-orange-400"
            >
              Clear filters
            </button>
          )}
        </div>
      </section>

      {/* Partner cards */}
      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
        {filteredPartners.map((partner, index) => (
          <article
            key={partner.id}
            style={{ animationDelay: `${Math.min(index * 70, 350)}ms` }}
            className="card-animate hover-card min-w-0 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-xl font-extrabold text-orange-600 transition-transform duration-300 hover:scale-105 dark:bg-orange-500/15 dark:text-orange-400">
                {partner.name
                  .split(" ")
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join("")}
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="truncate font-extrabold text-gray-900 dark:text-white">
                  {partner.name}
                </h2>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {partner.id}
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                      partner.status === "Verified"
                        ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                        : partner.status === "Pending"
                          ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                          : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                    }`}
                  >
                    {partner.status}
                  </span>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                      partner.availability === "Online"
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {partner.availability}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-3 border-y border-gray-100 py-4 text-sm dark:border-gray-700">
              <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <FiPhone className="shrink-0 text-orange-500" />
                <span className="break-words">{partner.phone}</span>
              </p>

              <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <FiMapPin className="shrink-0 text-orange-500" />
                {partner.zone}
              </p>

              <p className="text-gray-600 dark:text-gray-300">
                Vehicle:{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {partner.vehicle}
                </span>
              </p>

              <p className="text-gray-600 dark:text-gray-300">
                Number:{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {partner.vehicleNumber}
                </span>
              </p>
            </div>

            {/* Partner metrics */}
            <div className="grid grid-cols-3 gap-2 py-4 text-center">
              <div className="rounded-xl p-2 transition-colors hover:bg-amber-50 dark:hover:bg-gray-800">
                <FiStar className="mx-auto text-amber-500" size={17} />
                <p className="mt-1 break-words font-bold text-gray-900 dark:text-white">
                  {partner.rating || "New"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Rating
                </p>
              </div>

              <div className="rounded-xl p-2 transition-colors hover:bg-blue-50 dark:hover:bg-gray-800">
                <FiTruck className="mx-auto text-blue-500" size={17} />
                <p className="mt-1 font-bold text-gray-900 dark:text-white">
                  {partner.deliveries}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Deliveries
                </p>
              </div>

              <div className="rounded-xl p-2 transition-colors hover:bg-green-50 dark:hover:bg-gray-800">
                <FiCheckCircle className="mx-auto text-green-500" size={17} />
                <p className="mt-1 break-words text-sm font-bold text-gray-900 dark:text-white">
                  {formatMoney(partner.earnings)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Earnings
                </p>
              </div>
            </div>

            {/* Partner actions */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedPartner(partner)}
                className={`${buttonClass} min-w-0 flex-1 border border-gray-200 px-3 py-2.5 text-sm font-semibold text-gray-700 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800`}
              >
                <FiEye size={16} />
                Details
              </button>

              {partner.status === "Pending" && (
                <>
                  <button
                    type="button"
                    onClick={() => verifyPartner(partner)}
                    className={`${buttonClass} bg-green-500 px-3 py-2.5 text-sm font-bold text-white hover:bg-green-600`}
                  >
                    <FiCheck size={15} />
                    Verify
                  </button>

                  <button
                    type="button"
                    onClick={() => rejectPartner(partner)}
                    className={`${buttonClass} bg-red-50 px-3 py-2.5 text-sm font-bold text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20`}
                  >
                    Reject
                  </button>
                </>
              )}

              {partner.status === "Verified" && (
                <button
                  type="button"
                  onClick={() => toggleAvailability(partner)}
                  className={`${buttonClass} px-3 py-2.5 text-sm font-bold ${
                    partner.availability === "Online"
                      ? "bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400"
                      : "bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-500/10 dark:text-green-400"
                  }`}
                >
                  <FiPower size={15} />
                  {partner.availability === "Online" ? "Go Offline" : "Go Online"}
                </button>
              )}

              {partner.status === "Rejected" && (
                <button
                  type="button"
                  onClick={() => {
                    updatePartner(partner.id, {
                      status: "Pending",
                      availability: "Offline",
                    });
                    setNotice("Partner returned to pending verification.");
                  }}
                  className={`${buttonClass} bg-amber-50 px-3 py-2.5 text-sm font-bold text-amber-700 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400`}
                >
                  Re-review
                </button>
              )}
            </div>
          </article>
        ))}

        {filteredPartners.length === 0 && (
          <div className="card-animate rounded-2xl border border-gray-100 bg-white p-10 text-center dark:border-gray-700 dark:bg-gray-900 md:col-span-2 2xl:col-span-3">
            <FiUsers className="mx-auto text-gray-300" size={36} />

            <p className="mt-3 font-bold text-gray-800 dark:text-white">
              No delivery partners found
            </p>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Try changing your search or filters.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("All");
                setAvailabilityFilter("All");
              }}
              className={`${buttonClass} mt-4 bg-orange-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-600`}
            >
              Reset filters
            </button>
          </div>
        )}
      </section>

      {/* Add partner modal */}
      {showForm && (
        <div
          className="overlay-animate fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-gray-950/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowForm(false);
          }}
        >
          <form
            onSubmit={createPartner}
            className="modal-animate my-auto max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-900"
          >
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">
                  Add Delivery Partner
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  New partners must be verified before going online.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-orange-100 hover:text-orange-600 dark:bg-gray-800 dark:text-gray-300"
                aria-label="Close form"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {[
                ["name", "Full Name", "Enter full name", "text"],
                ["phone", "Phone Number", "Enter phone number", "tel"],
                ["email", "Email Address", "Enter email address", "email"],
                [
                  "vehicleNumber",
                  "Vehicle Number",
                  "Enter registration number",
                  "text",
                ],
                ["zone", "Delivery Zone", "Enter delivery area", "text"],
              ].map(([key, label, placeholder, type]) => (
                <label key={key} className="block">
                  <span className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {label}
                  </span>

                  <input
                    required
                    type={type}
                    value={form[key]}
                    onChange={(event) =>
                      setForm({ ...form, [key]: event.target.value })
                    }
                    placeholder={placeholder}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </label>
              ))}

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Vehicle Type
                </span>

                <select
                  value={form.vehicle}
                  onChange={(event) =>
                    setForm({ ...form, vehicle: event.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-orange-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option>Two Wheeler</option>
                  <option>Electric Scooter</option>
                  <option>Bicycle</option>
                  <option>Car</option>
                </select>
              </label>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className={`${buttonClass} flex-1 border border-gray-200 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800`}
              >
                Cancel
              </button>

              <button
                type="submit"
                className={`${buttonClass} flex-1 bg-orange-500 px-4 py-3 text-sm font-bold text-white hover:bg-orange-600`}
              >
                Register Partner
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Partner details modal */}
      {selectedPartner && (
        <div
          className="overlay-animate fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-gray-950/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedPartner(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="partner-details-title"
            className="modal-animate my-auto max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-gray-100 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
          >
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 p-5 dark:border-gray-700">
              <div>
                <h2
                  id="partner-details-title"
                  className="text-xl font-extrabold text-gray-900 dark:text-white"
                >
                  Partner Details
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {selectedPartner.id}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPartner(null)}
                className="rounded-lg bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-orange-100 hover:text-orange-600 dark:bg-gray-800 dark:text-gray-300"
                aria-label="Close details"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div className="rounded-xl bg-gray-50 p-4 transition-colors hover:bg-orange-50 dark:bg-gray-800 dark:hover:bg-gray-800">
                <p className="text-lg font-extrabold text-gray-900 dark:text-white">
                  {selectedPartner.name}
                </p>

                <p className="mt-1 break-words text-sm text-gray-500 dark:text-gray-400">
                  {selectedPartner.email}
                </p>

                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {selectedPartner.phone}
                </p>
              </div>

              {[
                ["Verification", selectedPartner.status],
                ["Availability", selectedPartner.availability],
                ["Vehicle", selectedPartner.vehicle],
                ["Vehicle Number", selectedPartner.vehicleNumber],
                ["Delivery Zone", selectedPartner.zone],
                ["Completed Deliveries", selectedPartner.deliveries],
                ["Total Earnings", formatMoney(selectedPartner.earnings)],
                ["Rating", selectedPartner.rating || "Not rated yet"],
              ].map(([label, value], index) => (
                <div
                  key={label}
                  style={{ animationDelay: `${index * 35}ms` }}
                  className="card-animate flex items-center justify-between gap-4 rounded-lg border-b border-gray-100 pb-3 text-sm dark:border-gray-700"
                >
                  <span className="text-gray-500 dark:text-gray-400">
                    {label}
                  </span>

                  <span className="text-right font-semibold text-gray-900 dark:text-white">
                    {value}
                  </span>
                </div>
              ))}

              {selectedPartner.status === "Pending" && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => verifyPartner(selectedPartner)}
                    className={`${buttonClass} bg-green-500 py-3 font-bold text-white hover:bg-green-600`}
                  >
                    <FiCheck />
                    Verify
                  </button>

                  <button
                    type="button"
                    onClick={() => rejectPartner(selectedPartner)}
                    className={`${buttonClass} bg-red-50 py-3 font-bold text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400`}
                  >
                    Reject
                  </button>
                </div>
              )}

              <p className="text-xs leading-5 text-gray-500 dark:text-gray-400">
                Demo mode: changes are stored in this browser. Verification
                does not validate real identity documents.
              </p>

              <button
                type="button"
                onClick={() => setSelectedPartner(null)}
                className={`${buttonClass} w-full bg-orange-500 py-3 font-bold text-white hover:bg-orange-600`}
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

export default DeliveryPartners;
