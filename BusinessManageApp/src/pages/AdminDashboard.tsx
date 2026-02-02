import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import Header from "../components/Header";
import Card from "../components/Card";
import Loader from "../components/Loader";
import AdBanner from "../components/AdBanner";
import ApiService from "../services/api";
import { AuthService } from "../services/auth";
import { API_ENDPOINTS } from "../config/api";
import { MaterialIcons } from "@expo/vector-icons";

interface DashboardData {
  totalBills: number;
  totalCollection: number;
  pendingBills: number;
  totalRetailers: number;
  totalProducts: number;
  activeStaff: number;
  todayCollection: number;
  monthlyCollection: number;
}

const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const response = await ApiService.get<any>(API_ENDPOINTS.ADMIN_DASHBOARD);
      if (response.success) {
        // Backend returns metrics as top-level keys (e.g. totalBillAmount, totalPaidAmount,
        // totalRemainingAmount, totalStaff). Older frontend expected a `data` object.
        // Normalize/mapping so mobile UI shows values even when `response.data` is not present.
        const payload = response.data ?? response;

        const mapped: DashboardData = {
          // `totalBills` (count) may not be provided by backend; fall back to 0
          totalBills: payload.totalBills ?? payload.totalBillCount ?? 0,
          // `pendingBills` may not be provided directly
          pendingBills: payload.pendingBills ?? 0,
          // totalCollection: prefer totalPaidAmount (backend uses this for today's paid sum),
          // otherwise try any totalCollection or totalBillAmount fallback
          totalCollection:
            payload.totalCollection ??
            payload.totalPaidAmount ??
            payload.totalBillAmount ??
            0,
          todayCollection:
            payload.todayCollection ?? payload.totalPaidAmount ?? 0,
          monthlyCollection:
            payload.monthlyCollection ??
            (payload.collectionTrends?.monthly?.data
              ? payload.collectionTrends.monthly.data.reduce(
                  (s: number, v: number) => s + v,
                  0,
                )
              : 0),
          totalRetailers: payload.totalRetailers ?? 0,
          totalProducts: payload.totalProducts ?? 0,
          activeStaff: payload.totalStaff ?? payload.activeStaff ?? 0,
        };

        setDashboardData(mapped);
      }
    } catch (error: any) {
      Alert.alert("Error", "Failed to load dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await AuthService.logout();
          router.replace("/login");
        },
      },
    ]);
  };

  const menuItems = [
    {
      title: "Bills Management",
      icon: "receipt",
      route: "/bills-page",
      color: "#3b82f6",
    },
    {
      title: "Add Bills",
      icon: "add-circle",
      route: "/bill-add",
      color: "#10b981",
    },
    {
      title: "Collection History",
      icon: "history",
      route: "/dsr-collection-summary",
      color: "#f59e0b",
    },
    {
      title: "Add Retailer",
      icon: "store",
      route: "/retailer-add",
      color: "#8b5cf6",
    },
    {
      title: "View Retailers",
      icon: "people",
      route: "/retailer-list",
      color: "#ec4899",
    },
    {
      title: "Add Product",
      icon: "shopping-cart",
      route: "/product-add",
      color: "#14b8a6",
    },
    {
      title: "View Products",
      icon: "inventory",
      route: "/product-list",
      color: "#f97316",
    },
    {
      title: "Orders",
      icon: "local-shipping",
      route: "/order-list",
      color: "#6366f1",
    },
    {
      title: "Reports",
      icon: "assessment",
      route: "/report-page",
      color: "#ef4444",
    },
    { title: "Users", icon: "person", route: "/users", color: "#06b6d4" },
  ];

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <Header
        title="Admin Dashboard"
        rightAction={{
          icon: "logout",
          onPress: handleLogout,
        }}
      />
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            <Card
              title="Total Bills"
              value={dashboardData?.totalBills || 0}
              icon="receipt-long"
              iconColor="#3b82f6"
              onPress={() => router.push("/bills-page" as any)}
              style={styles.statCard}
            />
            <Card
              title="Pending Bills"
              value={dashboardData?.pendingBills || 0}
              icon="pending-actions"
              iconColor="#f59e0b"
              onPress={() => router.push("/bills-page" as any)}
              style={styles.statCard}
            />
            <Card
              title="Total Collection"
              value={`₹${(
                dashboardData?.totalCollection || 0
              ).toLocaleString()}`}
              icon="account-balance-wallet"
              iconColor="#10b981"
              onPress={() => router.push("/dsr-collection-summary" as any)}
              style={styles.statCard}
            />
            <Card
              title="Today's Collection"
              value={`₹${(
                dashboardData?.todayCollection || 0
              ).toLocaleString()}`}
              icon="today"
              iconColor="#8b5cf6"
              onPress={() => router.push("/dsr-collection-summary" as any)}
              style={styles.statCard}
            />
            <Card
              title="Monthly Collection"
              value={`₹${(
                dashboardData?.monthlyCollection || 0
              ).toLocaleString()}`}
              icon="calendar-month"
              iconColor="#ec4899"
              onPress={() => router.push("/dsr-collection-summary" as any)}
              style={styles.statCard}
            />
            <Card
              title="Total Retailers"
              value={dashboardData?.totalRetailers || 0}
              icon="store"
              iconColor="#14b8a6"
              onPress={() => router.push("/retailer-list" as any)}
              style={styles.statCard}
            />
            <Card
              title="Total Products"
              value={dashboardData?.totalProducts || 0}
              icon="inventory-2"
              iconColor="#f97316"
              onPress={() => router.push("/product-list" as any)}
              style={styles.statCard}
            />
            <Card
              title="Active Staff"
              value={dashboardData?.activeStaff || 0}
              icon="groups"
              iconColor="#06b6d4"
              onPress={() => router.push("/users" as any)}
              style={styles.statCard}
            />
          </View>
        </View>

        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.menuGrid}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => router.push(item.route as any)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.menuIconContainer,
                    { backgroundColor: `${item.color}15` },
                  ]}
                >
                  <MaterialIcons
                    name={
                      item.icon as React.ComponentProps<
                        typeof MaterialIcons
                      >["name"]
                    }
                    size={28}
                    color={item.color}
                  />
                </View>
                <Text style={styles.menuTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      <AdBanner />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: "48%",
  },
  menuContainer: {
    padding: 16,
    paddingTop: 0,
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  menuItem: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  menuIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  menuTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1e293b",
    textAlign: "center",
  },
});

export default AdminDashboard;
