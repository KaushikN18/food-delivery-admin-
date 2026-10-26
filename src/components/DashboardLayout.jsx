import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function DashboardLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 transition-colors duration-300 dark:bg-gray-950">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="min-h-screen min-w-0 lg:pl-[260px]">
        <Navbar setIsOpen={setIsOpen} />

        <main className="min-w-0 bg-gray-50 p-4 transition-colors duration-300 dark:bg-gray-950 sm:p-6 lg:p-8">
          <div
            key={location.pathname}
            className="page-animate min-w-0"
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;