import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  FlatList,
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
  staffName: string;
  totalBillAmount: number;
  totalCollectedToday: number;
  totalBillsWithDue: number;
  totalCompletedBills: number;
  overdueBillsCount: number;
  collectionsToday: any[];
}

const StaffDashboard: React.FC = () => {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [assignedRetailersCount, setAssignedRetailersCount] =
    useState<number>(0);

  const fetchDashboardData = async () => {
    try {
      const response = await ApiService.get<any>(API_ENDPOINTS.STAFF_DASHBOARD);
      setDashboardData(response);
    } catch (error: any) {
      Alert.alert("Error", "Failed to load dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchAssignedRetailers = async () => {
    try {
      const res = await ApiService.get<string[]>(
        API_ENDPOINTS.ASSIGNED_CUSTOMERS
      );
      setAssignedRetailersCount(res?.length || 0);
    } catch (err: any) {
      console.error("Failed to fetch assigned customers:", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchAssignedRetailers();
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
      title: "Bills Assigned Today",
      icon: "assignment",
      route: "/bill-assigned-today",
      color: "#3b82f6",
    },
    {
      title: "Create Order",
      icon: "add-shopping-cart",
      route: "/order-create",
      color: "#10b981",
    },
    {
      title: "Collection History",
      icon: "history",
      route: "/collection-history",
      color: "#f59e0b",
    },
  ];

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <Header
        title="Staff Dashboard"
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
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.staffName}>
            {dashboardData?.staffName || "Staff"}
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Today's Overview</Text>
          <View style={styles.statsGrid}>
            <Card
              title="Total Bill Amount"
              value={`₹${(
                dashboardData?.totalBillAmount || 0
              ).toLocaleString()}`}
              icon="attach-money"
              iconColor="#3b82f6"
              style={styles.statCard}
            />
            <Card
              title="Collected Today"
              value={`₹${(
                dashboardData?.totalCollectedToday || 0
              ).toLocaleString()}`}
              icon="account-balance-wallet"
              iconColor="#10b981"
              style={styles.statCard}
            />
            <Card
              title="Bills With Due"
              value={dashboardData?.totalBillsWithDue || 0}
              icon="pending-actions"
              iconColor="#f59e0b"
              style={styles.statCard}
            />
            <Card
              title="Completed Bills"
              value={dashboardData?.totalCompletedBills || 0}
              icon="check-circle"
              iconColor="#8b5cf6"
              style={styles.statCard}
            />
            <Card
              title="Overdue Bills"
              value={dashboardData?.overdueBillsCount || 0}
              icon="warning"
              iconColor="#ef4444"
              style={styles.statCard}
            />
            <Card
              title="Assigned Retailers"
              value={assignedRetailersCount}
              icon="storefront"
              iconColor="#2563eb"
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
                    size={32}
                    color={item.color}
                  />
                </View>
                <Text style={styles.menuTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {dashboardData?.collectionsToday &&
          dashboardData.collectionsToday.length > 0 && (
            <View style={styles.recentContainer}>
              <Text style={styles.sectionTitle}>Today's Collections</Text>
              {dashboardData.collectionsToday.map(
                (collection: any, index: number) => (
                  <View key={index} style={styles.collectionItem}>
                    <View style={styles.collectionLeft}>
                      <Text style={styles.collectionRetailer}>
                        {collection.retailerName}
                      </Text>
                      <Text style={styles.collectionDate}>
                        {new Date(collection.date).toLocaleDateString()}
                      </Text>
                    </View>
                    <Text style={styles.collectionAmount}>
                      ₹{collection.amount.toLocaleString()}
                    </Text>
                  </View>
                )
              )}
            </View>
          )}
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
  welcomeContainer: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  welcomeText: {
    fontSize: 14,
    color: "#64748b",
  },
  staffName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
    marginTop: 4,
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
    gap: 8,
  },
  statCard: {
    width: "48%",
  },
  menuContainer: {
    padding: 16,
    paddingTop: 0,
  },
  menuGrid: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  menuItem: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    flexDirection: "column",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  menuIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    flex: 1,
  },
  recentContainer: {
    padding: 16,
    paddingTop: 0,
  },
  collectionItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  collectionLeft: {
    flex: 1,
  },
  collectionRetailer: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  collectionDate: {
    fontSize: 12,
    color: "#64748b",
  },
  collectionAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#10b981",
  },
});

export default StaffDashboard;
