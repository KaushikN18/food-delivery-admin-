
import { useEffect, useState } from "react";
import {
  FiMenu,
  FiSearch,
  FiBell,
  FiChevronDown,
  FiArrowUpRight,
  FiCommand,
} from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";

const searchablePages = [
  { name: "Dashboard", description: "View overview and statistics", path: "/" },
  { name: "Orders", description: "Manage customer orders", path: "/orders" },
  {
    name: "Restaurants & Menu",
    description: "Manage restaurants and menus",
    path: "/restaurants",
  },
  {
    name: "Delivery Partners",
    description: "Manage drivers and delivery partners",
    path: "/delivery-partners",
  },
  {
    name: "Customers",
    description: "View and manage customers",
    path: "/customers",
  },
  {
    name: "Payments & Finance",
    description: "View transactions and finances",
    path: "/finance",
  },
  {
    name: "Offers & Promotions",
    description: "Manage coupons and offers",
    path: "/promotions",
  },
  {
    name: "Notifications",
    description: "View notifications and alerts",
    path: "/notifications",
  },
  {
    name: "Support & Settings",
    description: "Manage support tickets and settings",
    path: "/support",
  },
];

function Navbar({ setIsOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredPages = searchablePages.filter((page) => {
    const query = search.trim().toLowerCase();

    return (
      query &&
      (page.name.toLowerCase().includes(query) ||
        page.description.toLowerCase().includes(query))
    );
  });

  useEffect(() => {
    setShowResults(false);
    setSearch("");
  }, [location.pathname]);

  const openPage = (page) => {
    navigate(page.path);
    setSearch("");
    setShowResults(false);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === "Escape") {
      setShowResults(false);
      return;
    }

    if (event.key === "ArrowDown" && filteredPages.length > 0) {
      event.preventDefault();
      setSelectedIndex((previous) =>
        previous >= filteredPages.length - 1 ? 0 : previous + 1
      );
    }

    if (event.key === "ArrowUp" && filteredPages.length > 0) {
      event.preventDefault();
      setSelectedIndex((previous) =>
        previous <= 0 ? filteredPages.length - 1 : previous - 1
      );
    }

    if (event.key === "Enter" && filteredPages.length > 0) {
      event.preventDefault();
      openPage(filteredPages[selectedIndex] || filteredPages[0]);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 sm:gap-4 sm:px-6 lg:px-8">
      {/* Left Section */}
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open navigation"
          className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 lg:hidden"
        >
          <FiMenu size={23} />
        </button>

        {/* Functional Page Search */}
        <div className="relative hidden sm:block">
          <div className="flex w-[260px] items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition focus-within:border-orange-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-100 lg:w-[320px]">
            <FiSearch className="shrink-0 text-gray-400" size={19} />

            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setSelectedIndex(0);
                setShowResults(true);
              }}
              onFocus={() => {
                if (search.trim()) setShowResults(true);
              }}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search pages..."
              aria-label="Search dashboard pages"
              aria-expanded={showResults && Boolean(search.trim())}
              className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
            />

            <span className="flex shrink-0 items-center gap-1 rounded border border-gray-200 bg-white px-1.5 py-1 text-xs text-gray-400">
              <FiCommand size={12} /> K
            </span>
          </div>

          {showResults && search.trim() && (
            <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
              <div className="border-b border-gray-100 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Pages
                </p>
              </div>

              {filteredPages.length > 0 ? (
                <div className="max-h-80 overflow-y-auto py-2">
                  {filteredPages.map((page, index) => (
                    <button
                      key={page.path}
                      type="button"
                      onMouseEnter={() => setSelectedIndex(index)}
                      onClick={() => openPage(page)}
                      className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition ${
                        selectedIndex === index
                          ? "bg-orange-50"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div>
                        <p
                          className={`text-sm font-semibold ${
                            selectedIndex === index
                              ? "text-orange-600"
                              : "text-gray-800"
                          }`}
                        >
                          {page.name}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {page.description}
                        </p>
                      </div>

                      <FiArrowUpRight
                        className="shrink-0 text-gray-400"
                        size={17}
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-8 text-center">
                  <FiSearch
                    size={24}
                    className="mx-auto text-gray-300"
                  />
                  <p className="mt-3 text-sm font-semibold text-gray-700">
                    No pages found
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Try another search term.
                  </p>
                </div>
              )}

              <div className="border-t border-gray-100 px-4 py-2">
                <p className="text-xs text-gray-400">
                  Use ↑ ↓ to navigate, Enter to open, Esc to close
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Title */}
        <div className="sm:hidden">
          <h2 className="font-bold text-gray-900">Foodie Admin</h2>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex shrink-0 items-center gap-3 sm:gap-5">
        <button
          type="button"
          onClick={() => navigate("/notifications")}
          aria-label="Open notifications"
          title="Notifications"
          className="relative rounded-xl border border-gray-200 p-2.5 text-gray-600 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
        >
          <FiBell size={20} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        {/* Admin Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-600">
            A
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-bold text-gray-800">Admin User</p>
            <p className="text-xs text-gray-500">Super Admin</p>
          </div>

          <FiChevronDown className="hidden text-gray-500 sm:block" />
        </div>
      </div>
    </header>
  );
}

export default Navbar;
