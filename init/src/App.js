import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import BillsAdd from "./pages/BillAdd";
import Users from "./pages/Users";
import Logout from "./pages/Logout";
import BillAssignedToday from "./pages/BillAssignedToday";
import BillsPage from "./pages/BillsPage";
import CollectionsHistory from "./pages/CollectionHistoryPage";
import ReportPage from "./pages/ReportPage";
import DSRCollectionSummary from "./pages/DSRCollectionSummary";
import RetailerAdd from "./pages/RetailerAdd";
import ProductAdd from "./pages/ProductAdd";
import RetailerList from "./pages/RetailerList";
import ProductList from "./pages/ProductList";
import OrderCreate from "./pages/OrderCreate";
import OrderList from "./pages/OrderList";
import SalaryPage from "./pages/SalaryPage";
import AdvancePage from "./pages/AdvancePage";
import SalaryLedgerPage from "./pages/SalaryLedgerPage";
import AttendancePage from "./pages/AttendancePage";
import DeliveryCreate from "./pages/DeliveryCreate";
import DeliveryTracking from "./pages/DeliveryTracking";
import DeliveryHistory from "./pages/DeliveryHistory";
import MyDeliveries from "./pages/MyDeliveries";
import RetailerDashboard from "./pages/RetailerDashboard";
import RetailerBilling from "./pages/RetailerBilling";
import RetailerCollectionHistory from "./pages/RetailerCollectionHistory";
import RetailerOrders from "./pages/RetailerOrders";

const App = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Read from localStorage on mount and listen for changes
  useEffect(() => {
    const loadUserData = () => {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      setUser(storedUser ? JSON.parse(storedUser) : null);
      setToken(storedToken);
    };

    // Load initial data
    loadUserData();

    // Listen for storage events (for cross-tab sync)
    window.addEventListener("storage", loadUserData);

    // Custom event for same-tab updates
    window.addEventListener("userLogin", loadUserData);

    return () => {
      window.removeEventListener("storage", loadUserData);
      window.removeEventListener("userLogin", loadUserData);
    };
  }, []);

  // Log to verify the token and user
  console.log("Current User:", user); // Debugging log
  console.log("Current Token:", token); // Debugging log

  // Check if token exists and if it has expired
  const isTokenExpired =
    token && Date.now() > JSON.parse(atob(token.split(".")[1])).exp * 1000;

  if (isTokenExpired) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  }

  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Redirect after login based on user role */}
        <Route
          path="/"
          element={
            user ? <Navigate to={`/${user.role}`} /> : <Navigate to="/login" />
          }
        />

        {/* Admin Dashboard Route */}
        <Route
          path="/admin"
          element={
            user?.role === "admin" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Staff Dashboard Route */}
        <Route
          path="/staff"
          element={
            user?.role === "staff" ? (
              <StaffDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Retailer Dashboard Route */}
        <Route
          path="/retailer"
          element={
            user?.role === "retailer" ? (
              <RetailerDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Retailer Billing Route */}
        <Route
          path="/retailer/billing"
          element={
            user?.role === "retailer" ? (
              <RetailerBilling />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Retailer Collection History Route */}
        <Route
          path="/retailer/collections"
          element={
            user?.role === "retailer" ? (
              <RetailerCollectionHistory />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Retailer Orders Route */}
        <Route
          path="/retailer/orders"
          element={
            user?.role === "retailer" ? (
              <RetailerOrders />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Bill Collection History Route */}
        <Route
          path="/admin/bill-collection-history"
          element={
            user?.role === "admin" ? (
              <DSRCollectionSummary />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        {/* Add Retailer */}
        <Route
          path="/admin/add-retailer"
          element={
            user?.role === "admin" ? <RetailerAdd /> : <Navigate to="/login" />
          }
        />
        {/* Add Product */}
        <Route
          path="/admin/add-product"
          element={
            user?.role === "admin" ? <ProductAdd /> : <Navigate to="/login" />
          }
        />
        {/* View Retailer */}
        <Route
          path="/admin/view-retailer"
          element={
            user?.role === "admin" ? <RetailerList /> : <Navigate to="/login" />
          }
        />
        {/* View Product */}
        <Route
          path="/admin/view-product"
          element={
            user?.role === "admin" ? <ProductList /> : <Navigate to="/login" />
          }
        />

        {/* Bills Add Route */}
        <Route
          path="/admin/bills-add"
          element={
            user?.role === "admin" ? <BillsAdd /> : <Navigate to="/login" />
          }
        />

        {/* Users Management Route */}
        <Route
          path="/admin/users"
          element={
            user?.role === "admin" ? <Users /> : <Navigate to="/login" />
          }
        />

        {/* Bill Assigned Today (For Staff) */}
        <Route
          path="/staff/bill-assigned-today"
          element={
            user?.role === "staff" ? (
              <BillAssignedToday />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/staff/order-create"
          element={
            user?.role === "staff" ? <OrderCreate /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/admin/order-list"
          element={
            user?.role === "admin" ? <OrderList /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/admin/reports"
          element={
            user?.role === "admin" ? <ReportPage /> : <Navigate to="/login" />
          }
        />

        {/* Admin Bills Page */}
        <Route
          path="/admin/bills"
          element={
            user?.role === "admin" ? <BillsPage /> : <Navigate to="/login" />
          }
        />

        {/* Salary Management Routes */}
        <Route
          path="/admin/salary"
          element={
            user?.role === "admin" ? <SalaryPage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/admin/advances"
          element={
            user?.role === "admin" ? <AdvancePage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/admin/salary-ledger"
          element={
            user?.role === "admin" ? (
              <SalaryLedgerPage />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/admin/attendance"
          element={
            user?.role === "admin" ? (
              <AttendancePage />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Delivery Logistics Routes */}
        <Route
          path="/admin/delivery-create"
          element={
            user?.role === "admin" ? (
              <DeliveryCreate />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/admin/delivery-tracking"
          element={
            user?.role === "admin" ? (
              <DeliveryTracking />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/admin/delivery-history"
          element={
            user?.role === "admin" ? (
              <DeliveryHistory />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Staff My Deliveries Route */}
        <Route
          path="/staff/my-deliveries"
          element={
            user?.role === "staff" ? <MyDeliveries /> : <Navigate to="/login" />
          }
        />

        <Route
          path="/staff/collections-history"
          element={<CollectionsHistory />}
        />

        {/* Logout Route */}
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
};

export default App;
