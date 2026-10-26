import { useEffect, useMemo, useState } from "react";
import {
  FiSearch,
  FiPlus,
  FiMapPin,
  FiStar,
  FiCheckCircle,
  FiClock,
  FiEye,
  FiX,
  FiEdit2,
  FiTrash2,
  FiCoffee,
  FiDollarSign,
} from "react-icons/fi";

const STORAGE_KEY = "foodie-admin-restaurants";

const initialRestaurants = [
  {
    id: 1,
    name: "Spice Garden",
    owner: "Arun Kumar",
    category: "Indian",
    location: "Anna Nagar, Chennai",
    phone: "+91 98765 43210",
    rating: 4.8,
    orders: 1240,
    commission: 15,
    status: "Approved",
    open: true,
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600",
    menu: [
      { id: 101, name: "Chicken Biryani", category: "Main Course", price: 280, available: true },
      { id: 102, name: "Butter Naan", category: "Bread", price: 45, available: true },
      { id: 103, name: "Paneer Butter Masala", category: "Main Course", price: 220, available: false },
    ],
  },
  {
    id: 2,
    name: "Pizza Corner",
    owner: "Priya Sharma",
    category: "Fast Food",
    location: "Velachery, Chennai",
    phone: "+91 98765 12345",
    rating: 4.6,
    orders: 980,
    commission: 12,
    status: "Approved",
    open: true,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600",
    menu: [
      { id: 201, name: "Margherita Pizza", category: "Pizza", price: 249, available: true },
      { id: 202, name: "Farmhouse Pizza", category: "Pizza", price: 349, available: true },
      { id: 203, name: "Garlic Bread", category: "Sides", price: 99, available: true },
    ],
  },
  {
    id: 3,
    name: "Green Bowl",
    owner: "Sneha Reddy",
    category: "Healthy Food",
    location: "Adyar, Chennai",
    phone: "+91 99887 66554",
    rating: 4.5,
    orders: 650,
    commission: 10,
    status: "Pending",
    open: false,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600",
    menu: [
      { id: 301, name: "Fresh Garden Salad", category: "Salads", price: 180, available: true },
      { id: 302, name: "Paneer Wrap", category: "Wraps", price: 160, available: true },
    ],
  },
  {
    id: 4,
    name: "Burger House",
    owner: "Rahul Verma",
    category: "Fast Food",
    location: "T. Nagar, Chennai",
    phone: "+91 91234 56780",
    rating: 4.3,
    orders: 820,
    commission: 14,
    status: "Approved",
    open: true,
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600",
    menu: [
      { id: 401, name: "Classic Burger", category: "Burgers", price: 180, available: true },
      { id: 402, name: "French Fries", category: "Sides", price: 90, available: true },
    ],
  },
  {
    id: 5,
    name: "Royal Dosa House",
    owner: "Karthik Raj",
    category: "South Indian",
    location: "Mylapore, Chennai",
    phone: "+91 90000 12345",
    rating: 4.7,
    orders: 1100,
    commission: 12,
    status: "Pending",
    open: false,
    image:
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600",
    menu: [
      { id: 501, name: "Masala Dosa", category: "Breakfast", price: 100, available: true },
      { id: 502, name: "Idli Set", category: "Breakfast", price: 60, available: true },
    ],
  },
  {
    id: 6,
    name: "Sweet Treats",
    owner: "Divya Mohan",
    category: "Desserts",
    location: "Guindy, Chennai",
    phone: "+91 91111 22222",
    rating: 4.4,
    orders: 430,
    commission: 10,
    status: "Rejected",
    open: false,
    image:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600",
    menu: [
      { id: 601, name: "Chocolate Cake", category: "Cakes", price: 150, available: true },
      { id: 602, name: "Chocolate Brownie", category: "Desserts", price: 120, available: true },
    ],
  },
];

const categories = [
  "All Categories",
  "Indian",
  "Fast Food",
  "Healthy Food",
  "South Indian",
  "Desserts",
];

function getSavedRestaurants() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return initialRestaurants;

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : initialRestaurants;
  } catch {
    return initialRestaurants;
  }
}

function Restaurants() {
  const [restaurants, setRestaurants] = useState(getSavedRestaurants);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [notice, setNotice] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState(null);

  const [menuForm, setMenuForm] = useState({
    name: "",
    category: "Main Course",
    price: "",
  });

  const [form, setForm] = useState({
    name: "",
    owner: "",
    category: "Indian",
    location: "",
    phone: "",
    commission: 12,
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(restaurants));
    } catch {
      setNotice("Unable to save changes in browser storage.");
    }
  }, [restaurants]);

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();

    return restaurants.filter((restaurant) => {
      const matchesSearch =
        restaurant.name.toLowerCase().includes(query) ||
        restaurant.owner.toLowerCase().includes(query) ||
        restaurant.location.toLowerCase().includes(query);

      const matchesCategory =
        category === "All Categories" ||
        restaurant.category === category;

      const matchesStatus =
        statusFilter === "All" ||
        restaurant.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [restaurants, search, category, statusFilter]);

  const approved = restaurants.filter(
    (restaurant) => restaurant.status === "Approved"
  ).length;

  const pending = restaurants.filter(
    (restaurant) => restaurant.status === "Pending"
  ).length;

  const totalOrders = restaurants.reduce(
    (sum, restaurant) => sum + restaurant.orders,
    0
  );

  const updateRestaurant = (id, changes) => {
    setRestaurants((current) =>
      current.map((restaurant) =>
        restaurant.id === id
          ? { ...restaurant, ...changes }
          : restaurant
      )
    );

    setSelected((current) =>
      current?.id === id
        ? { ...current, ...changes }
        : current
    );
  };

  const handleCreateRestaurant = (event) => {
    event.preventDefault();

    const restaurant = {
      id: Date.now(),
      ...form,
      name: form.name.trim(),
      owner: form.owner.trim(),
      location: form.location.trim(),
      phone: form.phone.trim(),
      commission: Number(form.commission),
      rating: 0,
      orders: 0,
      status: "Pending",
      open: false,
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600",
      menu: [],
    };

    setRestaurants((current) => [restaurant, ...current]);
    setShowForm(false);

    setForm({
      name: "",
      owner: "",
      category: "Indian",
      location: "",
      phone: "",
      commission: 12,
    });

    setSearch("");
    setCategory("All Categories");
    setStatusFilter("All");
    setNotice("Restaurant registered and sent for approval.");
  };

  const saveMenuItem = (event) => {
    event.preventDefault();

    if (
      !selected ||
      !menuForm.name.trim() ||
      Number(menuForm.price) <= 0
    ) {
      return;
    }

    const menu = editingMenuItem
      ? selected.menu.map((item) =>
          item.id === editingMenuItem.id
            ? {
                ...item,
                ...menuForm,
                name: menuForm.name.trim(),
                price: Number(menuForm.price),
              }
            : item
        )
      : [
          ...selected.menu,
          {
            id: Date.now(),
            ...menuForm,
            name: menuForm.name.trim(),
            price: Number(menuForm.price),
            available: true,
          },
        ];

    updateRestaurant(selected.id, { menu });
    setEditingMenuItem(null);
    setMenuForm({
      name: "",
      category: "Main Course",
      price: "",
    });

    setNotice(
      editingMenuItem ? "Menu item updated." : "Menu item added."
    );
  };

  const deleteMenuItem = (itemId) => {
    const menu = selected.menu.filter((item) => item.id !== itemId);

    updateRestaurant(selected.id, { menu });
    setNotice("Menu item removed.");
  };

  const toggleMenuAvailability = (itemId) => {
    const menu = selected.menu.map((item) =>
      item.id === itemId
        ? { ...item, available: !item.available }
        : item
    );

    updateRestaurant(selected.id, { menu });
  };

  const summaryCards = [
    {
      label: "Total Restaurants",
      value: restaurants.length,
      icon: FiCoffee,
      color: "bg-orange-100 text-orange-600",
    },
    {
      label: "Approved",
      value: approved,
      icon: FiCheckCircle,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Pending Approval",
      value: pending,
      icon: FiClock,
      color: "bg-amber-100 text-amber-600",
    },
    {
      label: "Total Orders",
      value: totalOrders.toLocaleString("en-IN"),
      icon: FiDollarSign,
      color: "bg-blue-100 text-blue-600",
    },
  ];
    return (
    <div className="page-animate space-y-6">
      {/* Page header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-gray-500">
            Overview / Restaurant Management
          </p>

          <h1 className="mt-2 text-2xl font-extrabold text-gray-900 sm:text-3xl">
            Restaurants & Menu
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage restaurant registrations, menus, pricing and availability.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="button-animate flex w-fit items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-100 hover:bg-orange-600"
        >
          <FiPlus size={18} />
          Register Restaurant
        </button>
      </div>

      {/* Notification */}
      {notice && (
        <div
          role="status"
          className="flex items-center justify-between gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
        >
          <span>{notice}</span>

          <button
            onClick={() => setNotice("")}
            aria-label="Dismiss message"
            className="button-animate"
          >
            <FiX size={18} />
          </button>
        </div>
      )}

      {/* Summary cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              style={{ animationDelay: `${index * 100}ms` }}
              className="card-animate hover-card rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.color}`}
              >
                <Icon size={22} />
              </div>

              <p className="mt-4 text-sm text-gray-500">
                {card.label}
              </p>

              <h2 className="mt-1 text-2xl font-extrabold text-gray-900">
                {card.value}
              </h2>
            </div>
          );
        })}
      </section>

      {/* Search and filters */}
      <section className="card-animate rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="relative">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search restaurants, owners..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400"
          >
            {["All", "Approved", "Pending", "Rejected"].map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Restaurant cards */}
      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
        {filtered.map((restaurant, index) => (
          <article
            key={restaurant.id}
            style={{ animationDelay: `${(index % 6) * 70}ms` }}
            className="card-animate hover-card overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
          >
            <div className="relative h-44 bg-gray-100">
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="h-full w-full object-cover transition duration-300 hover:scale-105"
              />

              <span
                className={`absolute left-3 top-3 rounded-full px-3 py-1.5 text-xs font-bold ${
                  restaurant.status === "Approved"
                    ? "bg-green-100 text-green-700"
                    : restaurant.status === "Pending"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-red-100 text-red-700"
                }`}
              >
                {restaurant.status}
              </span>

              <span
                className={`absolute right-3 top-3 rounded-full px-3 py-1.5 text-xs font-bold ${
                  restaurant.open
                    ? "bg-white text-green-700"
                    : "bg-gray-900/80 text-white"
                }`}
              >
                {restaurant.open ? "Open" : "Closed"}
              </span>
            </div>

            <div className="space-y-4 p-5">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-lg font-extrabold text-gray-900">
                      {restaurant.name}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Owned by {restaurant.owner}
                    </p>
                  </div>

                  <span className="flex shrink-0 items-center gap-1 rounded-lg bg-amber-50 px-2 py-1.5 text-sm font-bold text-amber-600">
                    <FiStar size={14} fill="currentColor" />
                    {restaurant.rating || "New"}
                  </span>
                </div>

                <p className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                  <FiMapPin className="shrink-0 text-orange-500" />
                  {restaurant.location}
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  {restaurant.category} · {restaurant.orders} orders
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 border-y border-gray-100 py-4">
                <div>
                  <p className="text-xs text-gray-500">Commission</p>
                  <p className="mt-1 font-bold text-gray-900">
                    {restaurant.commission}%
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Menu items</p>
                  <p className="mt-1 font-bold text-gray-900">
                    {restaurant.menu.length}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelected(restaurant)}
                  className="button-animate flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  <FiEye size={16} />
                  Details & Menu
                </button>

                {restaurant.status === "Pending" && (
                  <button
                    onClick={() => {
                      updateRestaurant(restaurant.id, {
                        status: "Approved",
                      });
                      setNotice(`${restaurant.name} approved.`);
                    }}
                    className="button-animate rounded-xl bg-green-500 px-3 py-2.5 text-sm font-bold text-white hover:bg-green-600"
                  >
                    Approve
                  </button>
                )}

                {restaurant.status === "Approved" && (
                  <button
                    onClick={() => {
                      updateRestaurant(restaurant.id, {
                        open: !restaurant.open,
                      });

                      setNotice(
                        `${restaurant.name} is now ${
                          restaurant.open ? "closed" : "open"
                        }.`
                      );
                    }}
                    className={`button-animate rounded-xl px-3 py-2.5 text-sm font-bold ${
                      restaurant.open
                        ? "bg-red-50 text-red-600 hover:bg-red-100"
                        : "bg-green-50 text-green-700 hover:bg-green-100"
                    }`}
                  >
                    {restaurant.open ? "Close" : "Open"}
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center md:col-span-2 2xl:col-span-3">
            <FiCoffee className="mx-auto text-gray-300" size={36} />

            <p className="mt-3 font-bold text-gray-800">
              No restaurants found
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Change your search or filters and try again.
            </p>
          </div>
        )}
      </section>
            {/* Registration modal */}
      {showForm && (
        <div
          className="overlay-animate fixed inset-0 z-[100] flex items-center justify-center bg-gray-950/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowForm(false);
            }
          }}
        >
          <form
            onSubmit={handleCreateRestaurant}
            className="modal-animate max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">
                  Register Restaurant
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  New registrations require approval.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="button-animate rounded-lg bg-gray-100 p-2 text-gray-600"
                aria-label="Close form"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {[
                ["name", "Restaurant name", "Enter restaurant name"],
                ["owner", "Owner name", "Enter owner name"],
                ["location", "Location", "Enter restaurant address"],
                ["phone", "Contact number", "Enter phone number"],
              ].map(([key, label, placeholder]) => (
                <div key={key}>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    {label}
                  </label>

                  <input
                    required
                    value={form[key]}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        [key]: event.target.value,
                      })
                    }
                    placeholder={placeholder}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                  />
                </div>
              ))}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Category
                </label>

                <select
                  value={form.category}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      category: event.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
                >
                  {categories
                    .filter((item) => item !== "All Categories")
                    .map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Commission (%)
                </label>

                <input
                  required
                  type="number"
                  min="0"
                  max="100"
                  value={form.commission}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      commission: Number(event.target.value),
                    })
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="button-animate flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-700"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="button-animate flex-1 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white hover:bg-orange-600"
              >
                Submit Registration
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Restaurant and menu details modal */}
      {selected && (
        <div
          className="overlay-animate fixed inset-0 z-[100] flex items-center justify-center bg-gray-950/50 p-3 sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelected(null);
              setEditingMenuItem(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="modal-animate max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-gray-100 p-5 sm:p-6">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">
                  {selected.name}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Restaurant details and menu management
                </p>
              </div>

              <button
                onClick={() => {
                  setSelected(null);
                  setEditingMenuItem(null);
                }}
                className="button-animate rounded-lg bg-gray-100 p-2 text-gray-600"
                aria-label="Close restaurant details"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="space-y-6 p-5 sm:p-6">
              {/* Restaurant information */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Owner</p>

                  <p className="mt-1 font-bold text-gray-900">
                    {selected.owner}
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    {selected.phone}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Location</p>

                  <p className="mt-1 font-bold text-gray-900">
                    {selected.location}
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    {selected.category}
                  </p>
                </div>
              </div>

              {/* Restaurant status and commission */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Restaurant status
                  </label>

                  <select
                    value={selected.status}
                    onChange={(event) =>
                      updateRestaurant(selected.id, {
                        status: event.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm"
                  >
                    <option>Pending</option>
                    <option>Approved</option>
                    <option>Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Commission (%)
                  </label>

                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={selected.commission}
                    onChange={(event) =>
                      updateRestaurant(selected.id, {
                        commission: Number(event.target.value),
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm"
                  />
                </div>
              </div>

              {/* Menu management */}
              <div>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-extrabold text-gray-900">
                      Menu Management
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {selected.menu.length} menu items
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingMenuItem(null);
                      setMenuForm({
                        name: "",
                        category: "Main Course",
                        price: "",
                      });
                    }}
                    className="button-animate flex items-center gap-2 rounded-xl bg-orange-500 px-3 py-2.5 text-sm font-bold text-white"
                  >
                    <FiPlus />
                    New Item
                  </button>
                </div>

                {/* Add or edit menu item */}
                <form
                  onSubmit={saveMenuItem}
                  className="mb-5 grid grid-cols-1 gap-3 rounded-xl border border-orange-100 bg-orange-50/50 p-4 sm:grid-cols-3"
                >
                  <input
                    required
                    value={menuForm.name}
                    onChange={(event) =>
                      setMenuForm({
                        ...menuForm,
                        name: event.target.value,
                      })
                    }
                    placeholder="Food item name"
                    className="min-w-0 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm"
                  />

                  <input
                    required
                    type="number"
                    min="1"
                    step="0.01"
                    value={menuForm.price}
                    onChange={(event) =>
                      setMenuForm({
                        ...menuForm,
                        price: event.target.value,
                      })
                    }
                    placeholder="Price (₹)"
                    className="min-w-0 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm"
                  />

                  <select
                    value={menuForm.category}
                    onChange={(event) =>
                      setMenuForm({
                        ...menuForm,
                        category: event.target.value,
                      })
                    }
                    className="min-w-0 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm"
                  >
                    {[
                      "Main Course",
                      "Breakfast",
                      "Pizza",
                      "Burgers",
                      "Sides",
                      "Desserts",
                      "Drinks",
                      "Salads",
                      "Wraps",
                      "Bread",
                    ].map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>

                  {editingMenuItem && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingMenuItem(null);
                        setMenuForm({
                          name: "",
                          category: "Main Course",
                          price: "",
                        });
                      }}
                      className="button-animate rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold"
                    >
                      Cancel Edit
                    </button>
                  )}

                  <button
                    type="submit"
                    className="button-animate rounded-lg bg-gray-900 px-3 py-2.5 text-sm font-bold text-white sm:col-span-2"
                  >
                    {editingMenuItem ? "Save Changes" : "Add Menu Item"}
                  </button>
                </form>

                {/* Menu items list */}
                <div className="space-y-3">
                  {selected.menu.map((item, index) => (
                    <div
                      key={item.id}
                      style={{ animationDelay: `${index * 50}ms` }}
                      className="card-animate flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 p-4"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-gray-900">
                          {item.name}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {item.category}
                        </p>

                        <p className="mt-1 font-bold text-orange-600">
                          ₹{Number(item.price).toLocaleString("en-IN")}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            toggleMenuAvailability(item.id)
                          }
                          className={`button-animate rounded-lg px-3 py-2 text-xs font-bold ${
                            item.available
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {item.available ? "Available" : "Unavailable"}
                        </button>

                        <button
                          type="button"
                          aria-label={`Edit ${item.name}`}
                          onClick={() => {
                            setEditingMenuItem(item);
                            setMenuForm({
                              name: item.name,
                              category: item.category,
                              price: String(item.price),
                            });
                          }}
                          className="button-animate rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50"
                        >
                          <FiEdit2 size={16} />
                        </button>

                        <button
                          type="button"
                          aria-label={`Delete ${item.name}`}
                          onClick={() => deleteMenuItem(item.id)}
                          className="button-animate rounded-lg border border-red-100 p-2 text-red-500 hover:bg-red-50"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {selected.menu.length === 0 && (
                    <p className="rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-500">
                      No menu items yet. Add your first item above.
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  setSelected(null);
                  setEditingMenuItem(null);
                }}
                className="button-animate w-full rounded-xl bg-orange-500 px-4 py-3 font-bold text-white hover:bg-orange-600"
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

export default Restaurants;