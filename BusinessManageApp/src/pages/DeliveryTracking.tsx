import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import Header from "../components/Header";
import Input from "../components/Input";
import Button from "../components/Button";
import AdBanner from "../components/AdBanner";
import ApiService from "../services/api";
import { API_ENDPOINTS } from "../config/api";
import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

interface Bill {
  billId: string;
  billNumber: string;
  billAmount: number;
}

interface Retailer {
  _id: string;
  name: string;
  address1: string;
  address2?: string;
}

interface Staff {
  _id: string;
  name: string;
  email: string;
}

interface BillOption {
  _id: string;
  billNumber: string;
  retailer: string;
  amount: number;
}

interface Delivery {
  _id: string;
  vehicleNumber: string;
  vehicleType: string;
  driverName: string;
  driverMobile: string;
  retailerName: string;
  retailerAddress: string;
  bills: Bill[];
  totalQuantity: number;
  totalWeight: number;
  dispatchDateTime: string;
  expectedDeliveryDate: string;
  actualDeliveryDateTime?: string;
  deliveryStatus: string;
  remarks?: string;
  totalBillAmount: number;
  isDelayed: boolean;
}

const DeliveryTracking: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"create" | "track">("create");
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [availableBills, setAvailableBills] = useState<BillOption[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [selectedBills, setSelectedBills] = useState<Bill[]>([]);
  const [showBillPicker, setShowBillPicker] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [formData, setFormData] = useState({
    vehicleNumber: "",
    vehicleType: "Bike",
    driverName: "",
    driverMobile: "",
    driverId: "",
    retailerId: "",
    totalQuantity: "",
    totalWeight: "",
    dispatchDateTime: new Date().toISOString().slice(0, 16),
    expectedDeliveryDate: "",
    remarks: "",
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    fetchRetailers();
    fetchStaff();
    fetchDeliveries();
  }, []);

  useEffect(() => {
    if (formData.retailerId) {
      fetchBillsForRetailer(formData.retailerId);
    }
  }, [formData.retailerId]);

  const fetchRetailers = async () => {
    try {
      const response: any = await ApiService.get(API_ENDPOINTS.RETAILERS);
      setRetailers(response.data || []);
    } catch (error) {
      console.error("Error fetching retailers:", error);
    }
  };

  const fetchStaff = async () => {
    try {
      const response: any = await ApiService.get(API_ENDPOINTS.USERS);
      const staffUsers = response.data.filter(
        (user: any) => user.role === "staff",
      );
      setStaffList(staffUsers || []);
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };

  const fetchBillsForRetailer = async (retailerId: string) => {
    try {
      const response: any = await ApiService.get(
        `${API_ENDPOINTS.BILLS}?retailerId=${retailerId}&status=Unpaid,Partially Paid`,
      );
      setAvailableBills(response.data.bills || []);
    } catch (error) {
      console.error("Error fetching bills:", error);
    }
  };

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const response: any = await ApiService.get(
        API_ENDPOINTS.DELIVERIES || "/deliveries",
      );
      setDeliveries(response.data.deliveries || []);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.vehicleNumber.trim()) {
      newErrors.vehicleNumber = "Vehicle number is required";
    }

    if (!formData.driverName.trim()) {
      newErrors.driverName = "Driver/Staff name is required";
    }

    if (!formData.driverMobile.trim()) {
      newErrors.driverMobile = "Mobile number is required";
    } else if (!/^[0-9]{10}$/.test(formData.driverMobile)) {
      newErrors.driverMobile = "Mobile number must be 10 digits";
    }

    if (!formData.retailerId) {
      newErrors.retailerId = "Please select a retailer";
    }

    if (selectedBills.length === 0) {
      newErrors.bills = "Please add at least one bill";
    }

    if (!formData.expectedDeliveryDate) {
      newErrors.expectedDeliveryDate = "Expected delivery date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const selectedRetailer = retailers.find(
        (r) => r._id === formData.retailerId,
      );

      await ApiService.post(API_ENDPOINTS.DELIVERIES || "/deliveries", {
        vehicleNumber: formData.vehicleNumber.trim().toUpperCase(),
        vehicleType: formData.vehicleType,
        driverName: formData.driverName.trim(),
        driverMobile: formData.driverMobile.trim(),
        driverId: formData.driverId || null,
        retailerId: formData.retailerId,
        bills: selectedBills,
        totalQuantity: parseFloat(formData.totalQuantity) || 0,
        totalWeight: parseFloat(formData.totalWeight) || 0,
        dispatchDateTime: formData.dispatchDateTime,
        expectedDeliveryDate: formData.expectedDeliveryDate,
        remarks: formData.remarks.trim(),
      });

      Alert.alert("Success", "Delivery created successfully", [
        {
          text: "OK",
          onPress: () => {
            resetForm();
            fetchDeliveries();
            setActiveTab("track");
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to create delivery",
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      vehicleNumber: "",
      vehicleType: "Bike",
      driverName: "",
      driverMobile: "",
      driverId: "",
      retailerId: "",
      totalQuantity: "",
      totalWeight: "",
      dispatchDateTime: new Date().toISOString().slice(0, 16),
      expectedDeliveryDate: "",
      remarks: "",
    });
    setSelectedBills([]);
    setErrors({});
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleAddBill = (billId: string) => {
    const bill = availableBills.find((b) => b._id === billId);
    if (bill && !selectedBills.find((b) => b.billId === billId)) {
      setSelectedBills([
        ...selectedBills,
        {
          billId: bill._id,
          billNumber: bill.billNumber,
          billAmount: bill.amount,
        },
      ]);
    }
    setShowBillPicker(false);
  };

  const handleRemoveBill = (billId: string) => {
    setSelectedBills(selectedBills.filter((b) => b.billId !== billId));
  };

  const handleUpdateStatus = async (deliveryId: string, newStatus: string) => {
    try {
      setLoading(true);
      await ApiService.put(
        `${API_ENDPOINTS.DELIVERIES || "/deliveries"}/${deliveryId}/status`,
        {
          status: newStatus,
        },
      );
      Alert.alert("Success", "Delivery status updated successfully");
      fetchDeliveries();
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update status",
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "#f59e0b";
      case "In Transit":
        return "#3b82f6";
      case "Delivered":
        return "#10b981";
      case "Cancelled":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const filteredDeliveries =
    statusFilter === "all"
      ? deliveries
      : deliveries.filter((d) => d.deliveryStatus === statusFilter);

  const renderCreateForm = () => (
    <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Vehicle Information</Text>

        <Input
          label="Vehicle Number *"
          placeholder="Enter vehicle number (e.g., MH12AB1234)"
          value={formData.vehicleNumber}
          onChangeText={(text) =>
            handleInputChange("vehicleNumber", text.toUpperCase())
          }
          error={errors.vehicleNumber}
          editable={!loading}
          autoCapitalize="characters"
        />

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Vehicle Type *</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={formData.vehicleType}
              onValueChange={(value) => handleInputChange("vehicleType", value)}
              enabled={!loading}
              style={styles.picker}
            >
              <Picker.Item label="Bike" value="Bike" />
              <Picker.Item label="Tempo" value="Tempo" />
              <Picker.Item label="Truck" value="Truck" />
            </Picker>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Driver/Staff Information</Text>

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Select Staff (Optional)</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={formData.driverId}
              onValueChange={(value) => {
                handleInputChange("driverId", value);
                const staff = staffList.find((s) => s._id === value);
                if (staff) {
                  handleInputChange("driverName", staff.name);
                }
              }}
              enabled={!loading}
              style={styles.picker}
            >
              <Picker.Item label="-- Select Staff --" value="" />
              {staffList.map((staff) => (
                <Picker.Item
                  key={staff._id}
                  label={staff.name}
                  value={staff._id}
                />
              ))}
            </Picker>
          </View>
        </View>

        <Input
          label="Driver/Staff Name *"
          placeholder="Enter driver name"
          value={formData.driverName}
          onChangeText={(text) => handleInputChange("driverName", text)}
          error={errors.driverName}
          editable={!loading}
        />

        <Input
          label="Driver Mobile Number *"
          placeholder="Enter 10-digit mobile number"
          value={formData.driverMobile}
          onChangeText={(text) => handleInputChange("driverMobile", text)}
          error={errors.driverMobile}
          keyboardType="phone-pad"
          maxLength={10}
          editable={!loading}
        />

        <Text style={styles.sectionTitle}>Delivery Information</Text>

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Retailer/Shop *</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={formData.retailerId}
              onValueChange={(value) => {
                handleInputChange("retailerId", value);
                setSelectedBills([]);
              }}
              enabled={!loading}
              style={styles.picker}
            >
              <Picker.Item label="-- Select Retailer --" value="" />
              {retailers.map((retailer) => (
                <Picker.Item
                  key={retailer._id}
                  label={`${retailer.name} - ${retailer.address1}`}
                  value={retailer._id}
                />
              ))}
            </Picker>
          </View>
          {errors.retailerId && (
            <Text style={styles.errorText}>{errors.retailerId}</Text>
          )}
        </View>

        <View style={styles.billsSection}>
          <View style={styles.billsHeader}>
            <Text style={styles.label}>Bills/Invoices *</Text>
            <TouchableOpacity
              style={[
                styles.addBillButton,
                !formData.retailerId && styles.addBillButtonDisabled,
              ]}
              onPress={() => setShowBillPicker(true)}
              disabled={!formData.retailerId || loading}
            >
              <MaterialIcons name="add" size={20} color="#fff" />
              <Text style={styles.addBillButtonText}>Add Bill</Text>
            </TouchableOpacity>
          </View>

          {selectedBills.length > 0 ? (
            <View style={styles.selectedBillsList}>
              {selectedBills.map((bill, index) => (
                <View key={bill.billId} style={styles.billItem}>
                  <View style={styles.billInfo}>
                    <Text style={styles.billNumber}>{bill.billNumber}</Text>
                    <Text style={styles.billAmount}>
                      ₹{bill.billAmount.toFixed(2)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleRemoveBill(bill.billId)}
                    disabled={loading}
                  >
                    <MaterialIcons name="close" size={24} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              ))}
              <View style={styles.totalBillAmount}>
                <Text style={styles.totalBillAmountLabel}>Total Amount:</Text>
                <Text style={styles.totalBillAmountValue}>
                  ₹
                  {selectedBills
                    .reduce((sum, bill) => sum + bill.billAmount, 0)
                    .toFixed(2)}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={styles.noBillsText}>No bills added yet</Text>
          )}
          {errors.bills && <Text style={styles.errorText}>{errors.bills}</Text>}
        </View>

        <Input
          label="Total Quantity (Optional)"
          placeholder="Enter total quantity"
          value={formData.totalQuantity}
          onChangeText={(text) => handleInputChange("totalQuantity", text)}
          keyboardType="decimal-pad"
          editable={!loading}
        />

        <Input
          label="Total Weight (Optional)"
          placeholder="Enter total weight in kg"
          value={formData.totalWeight}
          onChangeText={(text) => handleInputChange("totalWeight", text)}
          keyboardType="decimal-pad"
          editable={!loading}
        />

        <Input
          label="Dispatch Date & Time *"
          placeholder="YYYY-MM-DDTHH:MM"
          value={formData.dispatchDateTime}
          onChangeText={(text) => handleInputChange("dispatchDateTime", text)}
          editable={!loading}
        />

        <Input
          label="Expected Delivery Date *"
          placeholder="YYYY-MM-DD"
          value={formData.expectedDeliveryDate}
          onChangeText={(text) =>
            handleInputChange("expectedDeliveryDate", text)
          }
          error={errors.expectedDeliveryDate}
          editable={!loading}
        />

        <Input
          label="Remarks (Optional)"
          placeholder="Enter any additional notes"
          value={formData.remarks}
          onChangeText={(text) => handleInputChange("remarks", text)}
          multiline
          numberOfLines={3}
          editable={!loading}
        />

        <Button
          title="Create Delivery"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          style={styles.submitButton}
        />
      </View>
    </ScrollView>
  );

  const renderTrackingList = () => (
    <View style={styles.trackingContainer}>
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {["all", "Pending", "In Transit", "Delivered", "Cancelled"].map(
            (status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterButton,
                  statusFilter === status && styles.filterButtonActive,
                ]}
                onPress={() => setStatusFilter(status)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    statusFilter === status && styles.filterButtonTextActive,
                  ]}
                >
                  {status === "all" ? "All" : status}
                </Text>
              </TouchableOpacity>
            ),
          )}
        </ScrollView>
      </View>

      <ScrollView style={styles.deliveriesList}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#2563eb"
            style={styles.loader}
          />
        ) : filteredDeliveries.length > 0 ? (
          filteredDeliveries.map((delivery) => (
            <View key={delivery._id} style={styles.deliveryCard}>
              <View style={styles.deliveryHeader}>
                <View style={styles.vehicleInfo}>
                  <MaterialIcons
                    name="local-shipping"
                    size={24}
                    color="#2563eb"
                  />
                  <View style={styles.vehicleDetails}>
                    <Text style={styles.vehicleNumber}>
                      {delivery.vehicleNumber}
                    </Text>
                    <Text style={styles.vehicleType}>
                      {delivery.vehicleType}
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: getStatusColor(delivery.deliveryStatus),
                    },
                  ]}
                >
                  <Text style={styles.statusBadgeText}>
                    {delivery.deliveryStatus}
                  </Text>
                </View>
              </View>

              <View style={styles.deliveryDetails}>
                <View style={styles.detailRow}>
                  <MaterialIcons name="person" size={18} color="#64748b" />
                  <Text style={styles.detailText}>
                    {delivery.driverName} - {delivery.driverMobile}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <MaterialIcons name="store" size={18} color="#64748b" />
                  <Text style={styles.detailText}>{delivery.retailerName}</Text>
                </View>

                <View style={styles.detailRow}>
                  <MaterialIcons name="location-on" size={18} color="#64748b" />
                  <Text style={styles.detailText} numberOfLines={2}>
                    {delivery.retailerAddress}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <MaterialIcons name="receipt" size={18} color="#64748b" />
                  <Text style={styles.detailText}>
                    {delivery.bills.length} Bill(s) - ₹
                    {delivery.totalBillAmount.toFixed(2)}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <MaterialIcons name="schedule" size={18} color="#64748b" />
                  <Text style={styles.detailText}>
                    Expected:{" "}
                    {new Date(
                      delivery.expectedDeliveryDate,
                    ).toLocaleDateString()}
                  </Text>
                </View>

                {delivery.isDelayed &&
                  delivery.deliveryStatus !== "Delivered" && (
                    <View style={styles.delayedBadge}>
                      <MaterialIcons name="warning" size={16} color="#ef4444" />
                      <Text style={styles.delayedText}>Delayed</Text>
                    </View>
                  )}
              </View>

              {delivery.deliveryStatus !== "Delivered" &&
                delivery.deliveryStatus !== "Cancelled" && (
                  <View style={styles.actionButtons}>
                    {delivery.deliveryStatus === "Pending" && (
                      <TouchableOpacity
                        style={[
                          styles.actionButton,
                          { backgroundColor: "#3b82f6" },
                        ]}
                        onPress={() =>
                          handleUpdateStatus(delivery._id, "In Transit")
                        }
                      >
                        <Text style={styles.actionButtonText}>
                          Mark In Transit
                        </Text>
                      </TouchableOpacity>
                    )}
                    {delivery.deliveryStatus === "In Transit" && (
                      <TouchableOpacity
                        style={[
                          styles.actionButton,
                          { backgroundColor: "#10b981" },
                        ]}
                        onPress={() =>
                          handleUpdateStatus(delivery._id, "Delivered")
                        }
                      >
                        <Text style={styles.actionButtonText}>
                          Mark Delivered
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons name="local-shipping" size={64} color="#cbd5e1" />
            <Text style={styles.emptyStateText}>No deliveries found</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Logistics & Distribution" showBack />

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "create" && styles.tabActive]}
          onPress={() => setActiveTab("create")}
        >
          <MaterialIcons
            name="add-circle-outline"
            size={20}
            color={activeTab === "create" ? "#2563eb" : "#64748b"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "create" && styles.tabTextActive,
            ]}
          >
            Create Delivery
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "track" && styles.tabActive]}
          onPress={() => setActiveTab("track")}
        >
          <MaterialIcons
            name="track-changes"
            size={20}
            color={activeTab === "track" ? "#2563eb" : "#64748b"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "track" && styles.tabTextActive,
            ]}
          >
            Track Deliveries
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "create" ? renderCreateForm() : renderTrackingList()}

      {/* Bill Picker Modal */}
      <Modal
        visible={showBillPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBillPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Bill</Text>
              <TouchableOpacity onPress={() => setShowBillPicker(false)}>
                <MaterialIcons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {availableBills.length > 0 ? (
                availableBills.map((bill) => (
                  <TouchableOpacity
                    key={bill._id}
                    style={styles.billOption}
                    onPress={() => handleAddBill(bill._id)}
                    disabled={selectedBills.some((b) => b.billId === bill._id)}
                  >
                    <View style={styles.billOptionInfo}>
                      <Text style={styles.billOptionNumber}>
                        {bill.billNumber}
                      </Text>
                      <Text style={styles.billOptionAmount}>
                        ₹{bill.amount.toFixed(2)}
                      </Text>
                    </View>
                    {selectedBills.some((b) => b.billId === bill._id) && (
                      <MaterialIcons
                        name="check-circle"
                        size={24}
                        color="#10b981"
                      />
                    )}
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noBillsAvailable}>
                  No unpaid bills available for this retailer
                </Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

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
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: "#2563eb",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748b",
  },
  tabTextActive: {
    color: "#2563eb",
  },
  form: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginTop: 16,
    marginBottom: 12,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
  },
  pickerWrapper: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    overflow: "hidden",
  },
  picker: {
    height: 50,
  },
  billsSection: {
    marginBottom: 16,
  },
  billsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  addBillButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563eb",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  addBillButtonDisabled: {
    backgroundColor: "#cbd5e1",
  },
  addBillButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  selectedBillsList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  billItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  billInfo: {
    flex: 1,
  },
  billNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
  },
  billAmount: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 2,
  },
  totalBillAmount: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: "#e2e8f0",
  },
  totalBillAmountLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
  },
  totalBillAmountValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2563eb",
  },
  noBillsText: {
    fontSize: 14,
    color: "#94a3b8",
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 16,
  },
  errorText: {
    fontSize: 12,
    color: "#ef4444",
    marginTop: 4,
  },
  submitButton: {
    marginTop: 24,
    marginBottom: 16,
  },
  trackingContainer: {
    flex: 1,
  },
  filterContainer: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
  },
  filterButtonActive: {
    backgroundColor: "#2563eb",
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  filterButtonTextActive: {
    color: "#FFFFFF",
  },
  deliveriesList: {
    flex: 1,
    padding: 16,
  },
  loader: {
    marginTop: 32,
  },
  deliveryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  deliveryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  vehicleInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  vehicleDetails: {
    gap: 2,
  },
  vehicleNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
  },
  vehicleType: {
    fontSize: 12,
    color: "#64748b",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  deliveryDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  detailText: {
    flex: 1,
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
  },
  delayedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#fef2f2",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  delayedText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ef4444",
  },
  actionButtons: {
    marginTop: 16,
    gap: 8,
  },
  actionButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#94a3b8",
    marginTop: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  modalBody: {
    padding: 16,
  },
  billOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    marginBottom: 8,
  },
  billOptionInfo: {
    flex: 1,
  },
  billOptionNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
  },
  billOptionAmount: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 2,
  },
  noBillsAvailable: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    paddingVertical: 32,
  },
});

export default DeliveryTracking;
