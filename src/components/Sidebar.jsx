import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiShoppingBag,
  FiCoffee,
  FiTruck,
  FiUsers,
  FiDollarSign,
  FiTag,
  FiHeadphones,
  FiBell,
  FiChevronLeft,
} from "react-icons/fi";

const menuItems = [
  { name: "Dashboard", path: "/", icon: FiGrid },
  { name: "Orders", path: "/orders", icon: FiShoppingBag },
  { name: "Restaurants & Menu", path: "/restaurants", icon: FiCoffee },
  { name: "Delivery Partners", path: "/delivery-partners", icon: FiTruck },
  { name: "Customers", path: "/customers", icon: FiUsers },
  { name: "Payments & Finance", path: "/finance", icon: FiDollarSign },
  { name: "Offers & Promotions", path: "/promotions", icon: FiTag },
  { name: "Notifications", path: "/notifications", icon: FiBell },
  { name: "Support & Settings", path: "/support", icon: FiHeadphones },
];

function Sidebar({ isOpen, setIsOpen }) {
  return (
    <>
      {/* Mobile Overlay */}
      <button
        type="button"
        aria-label="Close sidebar overlay"
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-[260px] flex-col overflow-hidden border-r border-gray-200 bg-white text-gray-800 shadow-xl transition-transform duration-300 ease-in-out dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 lg:translate-x-0 lg:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-gray-100 px-5 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-xl text-white shadow-md shadow-orange-500/20 transition-transform duration-300 hover:rotate-6 hover:scale-110">
              <FiCoffee />
            </div>

            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-gray-900 dark:text-white">
                Foodie<span className="text-orange-500">Admin</span>
              </h1>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Management Panel
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-orange-500 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
          >
            <FiChevronLeft size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain px-4 py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <p className="mb-4 px-3 text-xs font-bold uppercase tracking-[0.16em] text-gray-400 dark:text-gray-500">
            Main Menu
          </p>

          <nav className="space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  onClick={() => setIsOpen(false)}
                  style={{ animationDelay: `${index * 35}ms` }}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 hover:translate-x-1 ${
                      isActive
                        ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                        : "text-gray-600 hover:bg-orange-50 hover:text-orange-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-orange-400"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`absolute inset-y-2 left-0 w-1 rounded-r-full bg-white transition-opacity ${
                          isActive ? "opacity-100" : "opacity-0"
                        }`}
                      />

                      <Icon
                        size={19}
                        className="shrink-0 transition-transform duration-200 group-hover:scale-110"
                      />

                      <span className="truncate">{item.name}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer - Support Card Removed */}
        <div className="shrink-0 border-t border-gray-100 px-4 py-4 dark:border-gray-700">
          <p className="text-center text-[11px] text-gray-400 dark:text-gray-500">
            FoodieAdmin © 2026
          </p>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;