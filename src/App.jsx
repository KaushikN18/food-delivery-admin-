
import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "./components/DashboardLayout";

import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Restaurants from "./pages/Restaurants";
import DeliveryPartners from "./pages/DeliveryPartners";
import Customers from "./pages/Customers";
import Finance from "./pages/Finance";
import Promotions from "./pages/Promotions";
import Support from "./pages/Support";
import Notifications from "./pages/Notifications";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route
            path="/delivery-partners"
            element={<DeliveryPartners />}
          />
          <Route path="/customers" element={<Customers />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="/support" element={<Support />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
