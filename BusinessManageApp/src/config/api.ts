import { Platform } from "react-native";

// Use emulator-friendly hostnames. If running on a physical device, replace with your machine IP.
export const API_BASE_URL =
  Platform.OS === "android" ? "http://10.0.2.2:2500" : "http://localhost:2500";

export const API_ENDPOINTS = {
  LOGIN: "/api/auth/login",
  USERS: "/api/users",
  BILLS: "/api/bills",
  BILLS_ASSIGNED: "/api/bills/bills-assigned-today",
  ASSIGNED_CUSTOMERS: "/api/bills/assigned-customers",
  BILLS_HISTORY: "/api/bills/history",
  COLLECTIONS: "/api/collections",
  COLLECTIONS_HISTORY: "/api/collections/history",
  DSR_SUMMARY: "/api/reports/dsr-summary",
  RETAILERS: "/api/retailers",
  PRODUCTS: "/api/products",
  ORDERS: "/api/orders",
  REPORTS: "/api/reports",
  ADMIN_DASHBOARD: "/api/admin/dashboard",
  STAFF_DASHBOARD: "/api/staff/dashboard",
  DELIVERIES: "/api/deliveries",
};
