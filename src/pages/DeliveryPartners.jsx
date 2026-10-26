
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

  const emptyForm = {
    name: "",
    phone: "",
    email: "",
    vehicle: "Two Wheeler",
    vehicleNumber: "",
    zone: "",
  };

  const [form, setForm] = useState(emptyForm);

  // Persist partner data whenever it changes.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(partners));
    } catch {
      setNotice("Unable to save changes in browser storage.");
    }
  }, [partners]);

  const filteredPartners = useMemo(() => {
    const query = search.toLowerCase().trim();

    return partners.filter((partner) => {
      const matchesSearch =
        partner.id.toLowerCase().includes(query) ||
        partner.name.toLowerCase().includes(query) ||
        partner.phone.toLowerCase().includes(query) ||
        partner.zone.toLowerCase().includes(query);

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
    (total, partner) => total + partner.deliveries,
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
      color: "bg-orange-50 text-orange-600",
    },
    {
      label: "Verified Partners",
      value: verifiedCount,
      icon: FiCheckCircle,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Pending Verification",
      value: pendingCount,
      icon: FiClock,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Online Partners",
      value: onlineCount,
      icon: FiTruck,
      color: "bg-blue-50 text-blue-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-gray-500">
            Overview / Delivery Management
          </p>
          <h1 className="mt-2 text-2xl font-extrabold text-gray-900 sm:text-3xl">
            Delivery Partners
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage delivery staff, verification, and availability.
          </p>
        </div>

        <button
          onClick={() => {
            setForm(emptyForm);
            setShowForm(true);
          }}
          className="flex w-fit items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white hover:bg-orange-600"
        >
          <FiPlus size={18} />
          Add Partner
        </button>
      </div>

      {notice && (
        <div
          role="status"
          className="flex items-center justify-between gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
        >
          <span>{notice}</span>
          <button onClick={() => setNotice("")} aria-label="Dismiss">
            <FiX size={18} />
          </button>
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}
              >
                <Icon size={22} />
              </div>
              <p className="mt-4 text-sm text-gray-500">{stat.label}</p>
              <h2 className="mt-1 text-2xl font-extrabold text-gray-900">
                {stat.value}
              </h2>
            </div>
          );
        })}
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Completed Deliveries</p>
          <h2 className="mt-2 text-2xl font-extrabold text-gray-900">
            {totalDeliveries.toLocaleString("en-IN")}
          </h2>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Partner Earnings</p>
          <h2 className="mt-2 text-2xl font-extrabold text-gray-900">
            {formatMoney(
              partners.reduce((total, partner) => total + partner.earnings, 0)
            )}
          </h2>
        </div>
      </div>

      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="relative">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, ID, phone, zone..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-orange-400"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
          >
            <option value="All">All Verification Statuses</option>
            <option value="Verified">Verified</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            value={availabilityFilter}
            onChange={(event) => setAvailabilityFilter(event.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
          >
            <option value="All">All Availability</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
          </select>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
        {filteredPartners.map((partner) => (
          <article
            key={partner.id}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-xl font-extrabold text-orange-600">
                {partner.name
                  .split(" ")
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join("")}
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="font-extrabold text-gray-900">
                  {partner.name}
                </h2>
                <p className="mt-1 text-xs text-gray-500">{partner.id}</p>

                <div className="mt-2 flex flex-wrap gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                      partner.status === "Verified"
                        ? "bg-green-50 text-green-700"
                        : partner.status === "Pending"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-red-50 text-red-700"
                    }`}
                  >
                    {partner.status}
                  </span>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                      partner.availability === "Online"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {partner.availability}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-3 border-y border-gray-100 py-4 text-sm">
              <p className="flex items-center gap-2 text-gray-600">
                <FiPhone className="shrink-0 text-orange-500" />
                {partner.phone}
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <FiMapPin className="shrink-0 text-orange-500" />
                {partner.zone}
              </p>
              <p className="text-gray-600">
                Vehicle: <span className="font-semibold">{partner.vehicle}</span>
              </p>
              <p className="text-gray-600">
                Number:{" "}
                <span className="font-semibold">{partner.vehicleNumber}</span>
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 py-4 text-center">
              <div>
                <FiStar className="mx-auto text-amber-500" size={17} />
                <p className="mt-1 font-bold text-gray-900">
                  {partner.rating || "New"}
                </p>
                <p className="text-xs text-gray-500">Rating</p>
              </div>
              <div>
                <FiTruck className="mx-auto text-blue-500" size={17} />
                <p className="mt-1 font-bold text-gray-900">
                  {partner.deliveries}
                </p>
                <p className="text-xs text-gray-500">Deliveries</p>
              </div>
              <div>
                <FiCheckCircle className="mx-auto text-green-500" size={17} />
                <p className="mt-1 font-bold text-gray-900">
                  {formatMoney(partner.earnings)}
                </p>
                <p className="text-xs text-gray-500">Earnings</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedPartner(partner)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                <FiEye size={16} />
                Details
              </button>

              {partner.status === "Pending" && (
                <>
                  <button
                    onClick={() => verifyPartner(partner)}
                    className="rounded-xl bg-green-500 px-3 py-2.5 text-sm font-bold text-white hover:bg-green-600"
                  >
                    Verify
                  </button>
                  <button
                    onClick={() => rejectPartner(partner)}
                    className="rounded-xl bg-red-50 px-3 py-2.5 text-sm font-bold text-red-600 hover:bg-red-100"
                  >
                    Reject
                  </button>
                </>
              )}

              {partner.status === "Verified" && (
                <button
                  onClick={() => toggleAvailability(partner)}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold ${
                    partner.availability === "Online"
                      ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                      : "bg-green-50 text-green-700 hover:bg-green-100"
                  }`}
                >
                  <FiPower size={15} />
                  {partner.availability === "Online" ? "Go Offline" : "Go Online"}
                </button>
              )}

              {partner.status === "Rejected" && (
                <button
                  onClick={() => {
                    updatePartner(partner.id, {
                      status: "Pending",
                      availability: "Offline",
                    });
                    setNotice("Partner returned to pending verification.");
                  }}
                  className="rounded-xl bg-amber-50 px-3 py-2.5 text-sm font-bold text-amber-700 hover:bg-amber-100"
                >
                  Re-review
                </button>
              )}
            </div>
          </article>
        ))}

        {filteredPartners.length === 0 && (
          <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center md:col-span-2 2xl:col-span-3">
            <FiUsers className="mx-auto text-gray-300" size={36} />
            <p className="mt-3 font-bold text-gray-800">
              No delivery partners found
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Try changing your search or filters.
            </p>
          </div>
        )}
      </section>

      {/* Add delivery partner */}
      {showForm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-950/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowForm(false);
          }}
        >
          <form
            onSubmit={createPartner}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">
                  Add Delivery Partner
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  New partners must be verified before going online.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg bg-gray-100 p-2 text-gray-600"
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
                ["vehicleNumber", "Vehicle Number", "Enter registration number", "text"],
                ["zone", "Delivery Zone", "Enter delivery area", "text"],
              ].map(([key, label, placeholder, type]) => (
                <label key={key} className="block">
                  <span className="mb-2 block text-sm font-semibold text-gray-700">
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
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                  />
                </label>
              ))}

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-700">
                  Vehicle Type
                </span>
                <select
                  value={form.vehicle}
                  onChange={(event) =>
                    setForm({ ...form, vehicle: event.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
                >
                  <option>Two Wheeler</option>
                  <option>Electric Scooter</option>
                  <option>Bicycle</option>
                  <option>Car</option>
                </select>
              </label>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white hover:bg-orange-600"
              >
                Register Partner
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Partner details */}
      {selectedPartner && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-950/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedPartner(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-gray-100 p-5">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">
                  Partner Details
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedPartner.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedPartner(null)}
                className="rounded-lg bg-gray-100 p-2 text-gray-600"
                aria-label="Close details"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-lg font-extrabold text-gray-900">
                  {selectedPartner.name}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedPartner.email}
                </p>
                <p className="mt-2 text-sm text-gray-500">
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
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3 text-sm"
                >
                  <span className="text-gray-500">{label}</span>
                  <span className="text-right font-semibold text-gray-900">
                    {value}
                  </span>
                </div>
              ))}

              {selectedPartner.status === "Pending" && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      verifyPartner(selectedPartner);
                    }}
                    className="flex items-center justify-center gap-2 rounded-xl bg-green-500 py-3 font-bold text-white hover:bg-green-600"
                  >
                    <FiCheck />
                    Verify
                  </button>
                  <button
                    onClick={() => rejectPartner(selectedPartner)}
                    className="rounded-xl bg-red-50 py-3 font-bold text-red-600 hover:bg-red-100"
                  >
                    Reject
                  </button>
                </div>
              )}

              <p className="text-xs text-gray-500">
                Demo mode: changes are stored in this browser. Verification
                does not validate real identity documents.
              </p>

              <button
                onClick={() => setSelectedPartner(null)}
                className="w-full rounded-xl bg-orange-500 py-3 font-bold text-white hover:bg-orange-600"
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
