
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
      {isOpen && (
        <button
          aria-label="Close sidebar overlay"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col
        border-r border-gray-200 bg-white transition-transform duration-300
        lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-gray-100 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-xl text-white">
              <FiCoffee />
            </div>

            <div>
              <h1 className="text-lg font-extrabold text-gray-900">
                Foodie<span className="text-orange-500">Admin</span>
              </h1>
              <p className="text-xs text-gray-500">Management Panel</p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <FiChevronLeft size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-4 px-3 text-xs font-bold uppercase tracking-widest text-gray-400">
            Main Menu
          </p>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-orange-500 text-white shadow-lg shadow-orange-100"
                        : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                    }`
                  }
                >
                  <Icon size={19} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Support Section */}
        <div className="shrink-0 border-t border-gray-100 p-4">
          <div className="rounded-xl bg-orange-50 p-4">
            <p className="text-sm font-bold text-gray-800">
              Need assistance?
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Contact the support team for help.
            </p>

            <NavLink
              to="/support"
              onClick={() => setIsOpen(false)}
              className="mt-3 inline-block text-sm font-bold text-orange-600"
            >
              Get Support →
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
