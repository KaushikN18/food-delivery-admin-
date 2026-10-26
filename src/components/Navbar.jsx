
import { useEffect, useState } from "react";
import {
  FiMenu,
  FiSearch,
  FiBell,
  FiChevronDown,
  FiArrowUpRight,
  FiCommand,
  FiSun,
  FiMoon,
  FiUser,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";

const searchablePages = [
  { name: "Dashboard", description: "View overview and statistics", path: "/" },
  { name: "Orders", description: "Manage customer orders", path: "/orders" },
  { name: "Restaurants & Menu", description: "Manage restaurants and menus", path: "/restaurants" },
  { name: "Delivery Partners", description: "Manage drivers and delivery partners", path: "/delivery-partners" },
  { name: "Customers", description: "View and manage customers", path: "/customers" },
  { name: "Payments & Finance", description: "View transactions and finances", path: "/finance" },
  { name: "Offers & Promotions", description: "Manage coupons and offers", path: "/promotions" },
  { name: "Notifications", description: "View notifications and alerts", path: "/notifications" },
  { name: "Support & Settings", description: "Manage support tickets and settings", path: "/support" },
];

function Navbar({ setIsOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showProfile, setShowProfile] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("foodie-theme") === "dark"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("foodie-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    setShowResults(false);
    setSearch("");
    setShowProfile(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowResults(false);
        setShowProfile(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const filteredPages = searchablePages.filter((page) => {
    const query = search.trim().toLowerCase();
    return (
      query &&
      (page.name.toLowerCase().includes(query) ||
        page.description.toLowerCase().includes(query))
    );
  });

  const openPage = (page) => {
    navigate(page.path);
    setSearch("");
    setShowResults(false);
    setShowProfile(false);
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

  const toggleTheme = () => {
    setDarkMode((previous) => !previous);
  };

  const iconButton =
    "rounded-xl border border-gray-200 p-2.5 text-gray-600 transition-all duration-200 hover:scale-105 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 active:scale-95 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800";

  return (
    <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 transition-colors duration-300 dark:border-gray-700 dark:bg-gray-900 sm:gap-4 sm:px-6 lg:px-8">
      {/* Left section */}
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open navigation"
          className="rounded-lg p-2 text-gray-600 transition-all duration-200 hover:bg-orange-50 hover:text-orange-600 dark:text-gray-300 dark:hover:bg-gray-800 lg:hidden"
        >
          <FiMenu size={23} />
        </button>

        {/* Search */}
        <div className="relative hidden sm:block">
          <div className="flex w-[260px] items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition-all duration-200 focus-within:border-orange-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-100 dark:border-gray-700 dark:bg-gray-800 dark:focus-within:bg-gray-800 dark:focus-within:ring-orange-900/30 lg:w-[320px]">
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
              className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400 dark:text-white"
            />
            <span className="flex shrink-0 items-center gap-1 rounded border border-gray-200 bg-white px-1.5 py-1 text-xs text-gray-400 dark:border-gray-600 dark:bg-gray-700">
              <FiCommand size={12} /> K
            </span>
          </div>

          {showResults && search.trim() && (
            <div className="dropdown-animate absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
              <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-700">
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
                      className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors ${
                        selectedIndex === index
                          ? "bg-orange-50 dark:bg-gray-700"
                          : "hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      <div>
                        <p
                          className={`text-sm font-semibold ${
                            selectedIndex === index
                              ? "text-orange-600"
                              : "text-gray-800 dark:text-gray-100"
                          }`}
                        >
                          {page.name}
                        </p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {page.description}
                        </p>
                      </div>
                      <FiArrowUpRight className="shrink-0 text-gray-400 transition-transform duration-200 group-hover:translate-x-1" size={17} />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-8 text-center">
                  <FiSearch size={24} className="mx-auto text-gray-300" />
                  <p className="mt-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
                    No pages found
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Try another search term.
                  </p>
                </div>
              )}

              <div className="border-t border-gray-100 px-4 py-2 dark:border-gray-700">
                <p className="text-xs text-gray-400">
                  Use ↑ ↓ to navigate, Enter to open, Esc to close
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="sm:hidden">
          <h2 className="font-bold text-gray-900 dark:text-white">
            Foodie Admin
          </h2>
        </div>
      </div>

      {/* Right section */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        {/* Light / Dark mode */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          title={darkMode ? "Light mode" : "Dark mode"}
          className={iconButton}
        >
          <span className="block transition-transform duration-300 hover:rotate-12">
            {darkMode ? (
              <FiSun size={20} className="text-amber-400" />
            ) : (
              <FiMoon size={20} />
            )}
          </span>
        </button>

        {/* Notifications */}
        <button
          type="button"
          onClick={() => navigate("/notifications")}
          aria-label="Open notifications"
          title="Notifications"
          className={`relative ${iconButton}`}
        >
          <FiBell size={20} />
          <span className="notification-pulse absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" />
        </button>

        {/* Admin profile */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowProfile((previous) => !previous)}
            aria-expanded={showProfile}
            aria-label="Open admin profile menu"
            className="flex items-center gap-2 rounded-xl p-1.5 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 sm:gap-3 sm:px-2"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 font-bold text-white shadow-md shadow-orange-500/20 transition-transform duration-300 hover:scale-110 hover:rotate-6">
              A
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-sm font-bold text-gray-800 dark:text-white">
                Admin User
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Super Admin
              </p>
            </div>

            <FiChevronDown
              className={`hidden text-gray-500 transition-transform duration-300 sm:block ${
                showProfile ? "rotate-180" : ""
              }`}
            />
          </button>

          {showProfile && (
            <>
              <button
                type="button"
                aria-label="Close profile menu"
                className="fixed inset-0 z-40 cursor-default"
                onClick={() => setShowProfile(false)}
              />

              <div className="dropdown-animate absolute right-0 top-full z-50 mt-3 w-64 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center gap-3 border-b border-gray-100 px-3 py-3 dark:border-gray-700">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-600 dark:bg-orange-900/40 dark:text-orange-300">
                    A
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-gray-900 dark:text-white">
                      Admin User
                    </p>
                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                      admin@foodie.com
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => openPage({ path: "/support" })}
                  className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-700 transition-all duration-200 hover:translate-x-1 hover:bg-orange-50 hover:text-orange-600 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  <FiUser size={17} />
                  My Profile
                </button>

                <button
                  type="button"
                  onClick={() => openPage({ path: "/support" })}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-700 transition-all duration-200 hover:translate-x-1 hover:bg-orange-50 hover:text-orange-600 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  <FiSettings size={17} />
                  Settings
                </button>

                <div className="my-2 border-t border-gray-100 dark:border-gray-700" />

                <button
                  type="button"
                  onClick={() => {
                    setShowProfile(false);
                    window.alert(
                      "Logout is not connected to an authentication system yet."
                    );
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-600 transition-all duration-200 hover:translate-x-1 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <FiLogOut size={17} />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
