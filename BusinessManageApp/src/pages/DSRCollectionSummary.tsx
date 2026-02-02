import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import Header from "../components/Header";
import Card from "../components/Card";
import Loader from "../components/Loader";
import AdBanner from "../components/AdBanner";
import ApiService from "../services/api";
import ExportService from "../services/exportService";
import { API_ENDPOINTS } from "../config/api";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

interface DSRData {
  _id: string;
  staffId?: string;
  staffName: string;
  total: number;
  cash: number;
  cashTrc: number;
  upi: number;
  upiTrc: number;
  cheque: number;
  chequeTrc: number;
  bankTransfer: number;
  bankTransferTrc: number;
  assignedRetailers: number;
  collectedRetailers: number;
  collectionCount?: number;
}

const DSRCollectionSummary: React.FC = () => {
  const router = useRouter();
  const [dsrData, setDsrData] = useState<DSRData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [startDate, setStartDate] = useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [endDate, setEndDate] = useState<Date>(() => {
    const d = new Date();
    d.setHours(23, 59, 59, 999);
    return d;
  });
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [totalSummary, setTotalSummary] = useState({
    totalCollected: 0,
    totalBills: 0,
    completedBills: 0,
    pendingBills: 0,
  });

  const fetchDSRSummary = async () => {
    try {
      // Use selected startDate and endDate
      const s = new Date(startDate);
      s.setHours(0, 0, 0, 0);
      const e = new Date(endDate);
      e.setHours(23, 59, 59, 999);

      const response = await ApiService.get<any>(
        `${
          API_ENDPOINTS.DSR_SUMMARY
        }?startDate=${s.toISOString()}&endDate=${e.toISOString()}`
      );

      // ApiService.get returns the parsed JSON body.
      // Backend returns { success: true, data: [...] }
      console.log("DSR summary response:", response);
      if (response?.success) {
        const dataArray = Array.isArray(response.data) ? response.data : [];
        setDsrData(dataArray);

        const total = dataArray.reduce(
          (acc: any, dsr: DSRData) => ({
            totalCollected: acc.totalCollected + (dsr.total || 0),
            totalBills: acc.totalBills + (dsr.collectionCount || 0),
            completedBills: 0,
            pendingBills: 0,
          }),
          {
            totalCollected: 0,
            totalBills: 0,
            completedBills: 0,
            pendingBills: 0,
          }
        );

        setTotalSummary(total);
      } else {
        // if backend returned error structure or success false
        setDsrData([]);
        Alert.alert("Warning", response?.message || "No DSR data returned");
      }
    } catch (error: any) {
      console.error("Fetch DSR error:", error?.response || error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to load DSR summary"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDSRSummary();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDSRSummary();
  };

  const handleExport = async () => {
    try {
      const s = new Date(startDate);
      s.setHours(0, 0, 0, 0);
      const e = new Date(endDate);
      e.setHours(23, 59, 59, 999);

      await ExportService.exportDSRSummary(s, e);
      Alert.alert("Success", "DSR Summary exported successfully");
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Failed to export DSR summary");
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <Header title="DSR Collection Summary" showBack />

      <View style={styles.exportButtonContainer}>
        <View style={styles.dateRow}>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowStartPicker(true)}
          >
            <Text style={styles.dateLabel}>
              Start: {startDate.toISOString().split("T")[0]}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowEndPicker(true)}
          >
            <Text style={styles.dateLabel}>
              End: {endDate.toISOString().split("T")[0]}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.generateButton}
            onPress={() => {
              setLoading(true);
              fetchDSRSummary();
            }}
          >
            <Text style={styles.generateButtonText}>Generate</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.exportButton,
              dsrData.length === 0 ? styles.exportButtonDisabled : null,
            ]}
            onPress={dsrData.length === 0 ? undefined : handleExport}
            activeOpacity={dsrData.length === 0 ? 1 : 0.7}
          >
            <MaterialIcons name="file-download" size={20} color="#FFFFFF" />
            <Text style={styles.exportButtonText}>Export to Excel</Text>
          </TouchableOpacity>
        </View>
        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowStartPicker(false);
              if (date) setStartDate(date);
            }}
          />
        )}
        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowEndPicker(false);
              if (date) {
                const d = new Date(date);
                d.setHours(23, 59, 59, 999);
                setEndDate(d);
              }
            }}
          />
        )}
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Overall Summary removed as requested */}

        {/* DSR Cards Slider Section */}
        <View style={styles.tableContainer}>
          <Text style={styles.sectionTitle}>DSR Wise Summary</Text>
          {dsrData.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                No DSR data for selected date range.
              </Text>
            </View>
          ) : (
            <FlatList
              horizontal
              data={dsrData}
              keyExtractor={(item) => item._id || item.staffName}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.dsrCardSlider}>
                  <View style={styles.dsrCardInner}>
                    <Text style={styles.dsrCardName}>
                      {item.staffName || "Unknown"}
                    </Text>
                    <Text style={styles.dsrCardTotal}>
                      ₹{(item.total || 0).toLocaleString("en-IN")}
                    </Text>

                    <View style={styles.rowTwo}>
                      <View style={styles.smallStat}>
                        <Text style={styles.smallLabel}>Assigned</Text>
                        <Text style={styles.smallValue}>
                          {item.assignedRetailers || 0}
                        </Text>
                      </View>
                      <View style={styles.smallStat}>
                        <Text style={styles.smallLabel}>Collected</Text>
                        <Text style={styles.smallValue}>
                          {item.collectedRetailers || 0}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.paymentsRow}>
                      <View
                        style={[
                          styles.paymentBox,
                          { backgroundColor: "#e8f0ff" },
                        ]}
                      >
                        <Text style={styles.payLabel}>Cash</Text>
                        <Text style={styles.payValue}>
                          ₹{(item.cash || 0).toLocaleString("en-IN")}
                        </Text>
                        <Text style={styles.payTrc}>
                          {item.cashTrc || 0} TRC
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.paymentBox,
                          { backgroundColor: "#e8fff4" },
                        ]}
                      >
                        <Text style={styles.payLabel}>UPI</Text>
                        <Text style={styles.payValue}>
                          ₹{(item.upi || 0).toLocaleString("en-IN")}
                        </Text>
                        <Text style={styles.payTrc}>
                          {item.upiTrc || 0} TRC
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.paymentBox,
                          { backgroundColor: "#fff7e6" },
                        ]}
                      >
                        <Text style={styles.payLabel}>Cheque</Text>
                        <Text style={styles.payValue}>
                          ₹{(item.cheque || 0).toLocaleString("en-IN")}
                        </Text>
                        <Text style={styles.payTrc}>
                          {item.chequeTrc || 0} TRC
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.paymentBox,
                          { backgroundColor: "#f3e8ff" },
                        ]}
                      >
                        <Text style={styles.payLabel}>Bank</Text>
                        <Text style={styles.payValue}>
                          ₹{(item.bankTransfer || 0).toLocaleString("en-IN")}
                        </Text>
                        <Text style={styles.payTrc}>
                          {item.bankTransferTrc || 0} TRC
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}
            />
          )}
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
  exportButtonContainer: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  exportButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#16a34a",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  exportButtonDisabled: {
    backgroundColor: "#94d3a2",
    opacity: 0.6,
  },
  exportButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  summaryContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 16,
  },
  overallCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  summaryLabel: {
    fontSize: 16,
    color: "#64748b",
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
  },
  collectedAmount: {
    color: "#16a34a",
  },

  // Table Styles
  tableContainer: {
    padding: 16,
    paddingTop: 0,
    backgroundColor: "#FFFFFF",
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1e40af",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    backgroundColor: "#FFFFFF",
  },
  tableCell: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    minWidth: 100,
    fontSize: 14,
  },
  headerText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 13,
  },
  rowText: {
    color: "#1e293b",
    fontWeight: "500",
  },
  dsrNameCell: {
    minWidth: 140,
    paddingHorizontal: 16,
  },
  amountCell: {
    textAlign: "right",
    fontWeight: "600",
  },
  columnGroup: {
    flexDirection: "column",
  },
  groupLabel: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    textAlign: "center",
    fontWeight: "600",
    borderRightWidth: 1,
    borderRightColor: "rgba(255,255,255,0.3)",
  },
  retailersHeader: {
    backgroundColor: "#1e40af",
    color: "#FFFFFF",
    minWidth: 160,
  },
  cashHeader: {
    backgroundColor: "#3b82f6",
    color: "#FFFFFF",
    minWidth: 130,
  },
  upiHeader: {
    backgroundColor: "#10b981",
    color: "#FFFFFF",
    minWidth: 130,
  },
  chequeHeader: {
    backgroundColor: "#f59e0b",
    color: "#FFFFFF",
    minWidth: 130,
  },
  bankHeader: {
    backgroundColor: "#8b5cf6",
    color: "#FFFFFF",
    minWidth: 160,
  },
  subColumns: {
    flexDirection: "row",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dateButton: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  dateLabel: {
    color: "#0f172a",
    fontWeight: "600",
  },
  generateButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  generateButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  dsrCardSlider: {
    width: 320,
    padding: 12,
  },
  dsrCardInner: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  dsrCardName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 8,
  },
  dsrCardTotal: {
    fontSize: 20,
    fontWeight: "800",
    color: "#047857",
    marginBottom: 12,
  },
  rowTwo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  smallStat: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 6,
  },
  smallLabel: { color: "#64748b", fontWeight: "600" },
  smallValue: { fontSize: 16, fontWeight: "700", color: "#0f172a" },
  paymentsRow: {
    flexDirection: "column",
    gap: 8,
  },
  paymentBox: {
    width: "100%",
    borderRadius: 8,
    padding: 12,
    alignItems: "flex-start",
    marginBottom: 8,
  },
  payLabel: { fontWeight: "700", color: "#374151" },
  payValue: { fontSize: 16, fontWeight: "800", color: "#0f172a", marginTop: 4 },
  payTrc: { color: "#6b7280", marginTop: 2 },
  emptyState: {
    padding: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: "#64748b",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default DSRCollectionSummary;
