import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import AdminDashboard from "./admin-dashboard";
import BillsPage from "./bills-page";
import CollectionHistory from "./collection-history";
import ProductList from "./product-list";
import OrderList from "./order-list";
import RetailerList from "./retailer-list";
import ReportPage from "./report-page";
import Users from "./users";
import DeliveryTracking from "./delivery-tracking";

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let name: React.ComponentProps<typeof Ionicons>["name"] =
            "home-outline";
          if (route.name === "Dashboard") name = "speedometer-outline";
          else if (route.name === "Bills") name = "receipt-outline";
          else if (route.name === "Collections") name = "cash-outline";
          else if (route.name === "Products") name = "pricetags-outline";
          else if (route.name === "Orders") name = "cart-outline";
          else if (route.name === "Retailers") name = "people-outline";
          else if (route.name === "Reports") name = "analytics-outline";
          else if (route.name === "Users") name = "person-outline";
          else if (route.name === "Delivery") name = "car-outline";

          return <Ionicons name={name} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={AdminDashboard} />
      <Tab.Screen name="Bills" component={BillsPage} />
      <Tab.Screen name="Collections" component={CollectionHistory} />
      <Tab.Screen name="Products" component={ProductList} />
      <Tab.Screen name="Orders" component={OrderList} />
      <Tab.Screen name="Retailers" component={RetailerList} />
      <Tab.Screen name="Reports" component={ReportPage} />
      <Tab.Screen name="Delivery" component={DeliveryTracking} />
      <Tab.Screen name="Users" component={Users} />
    </Tab.Navigator>
  );
}
