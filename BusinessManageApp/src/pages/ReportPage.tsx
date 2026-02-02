import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../components/Header';
import Card from '../components/Card';
import Loader from '../components/Loader';
import AdBanner from '../components/AdBanner';
import ApiService from '../services/api';
import { API_ENDPOINTS } from '../config/api';
import { MaterialIcons } from '@expo/vector-icons';

interface ReportData {
  totalRevenue: number;
  totalCollections: number;
  totalBills: number;
  paidBills: number;
  unpaidBills: number;
  partialBills: number;
  totalRetailers: number;
  totalProducts: number;
  topRetailers: Array<{
    name: string;
    totalAmount: number;
  }>;
  monthlyData: Array<{
    month: string;
    revenue: number;
  }>;
}

const ReportPage: React.FC = () => {
  const router = useRouter();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('month');

  const fetchReportData = async () => {
    try {
      const response = await ApiService.get<any>(`${API_ENDPOINTS.REPORTS}?period=${selectedPeriod}`);
      setReportData(response);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load report data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [selectedPeriod]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchReportData();
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <Header title="Reports" showBack />
      
      <View style={styles.periodSelector}>
        {(['month', 'quarter', 'year'] as const).map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodButton,
              selectedPeriod === period && styles.periodButtonActive,
            ]}
            onPress={() => setSelectedPeriod(period)}
          >
            <Text
              style={[
                styles.periodText,
                selectedPeriod === period && styles.periodTextActive,
              ]}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Financial Overview</Text>
          <View style={styles.statsGrid}>
            <Card
              title="Total Revenue"
              value={`₹${(reportData?.totalRevenue || 0).toLocaleString()}`}
              icon="attach-money"
              iconColor="#16a34a"
            />
            <Card
              title="Total Collections"
              value={`₹${(reportData?.totalCollections || 0).toLocaleString()}`}
              icon="account-balance-wallet"
              iconColor="#2563eb"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bills Summary</Text>
          <View style={styles.statsGrid}>
            <Card
              title="Total Bills"
              value={reportData?.totalBills || 0}
              icon="receipt-long"
              iconColor="#8b5cf6"
            />
            <Card
              title="Paid Bills"
              value={reportData?.paidBills || 0}
              icon="check-circle"
              iconColor="#16a34a"
            />
            <Card
              title="Unpaid Bills"
              value={reportData?.unpaidBills || 0}
              icon="pending"
              iconColor="#ef4444"
            />
            <Card
              title="Partial Bills"
              value={reportData?.partialBills || 0}
              icon="hourglass-empty"
              iconColor="#f59e0b"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Stats</Text>
          <View style={styles.statsGrid}>
            <Card
              title="Total Retailers"
              value={reportData?.totalRetailers || 0}
              icon="store"
              iconColor="#14b8a6"
            />
            <Card
              title="Total Products"
              value={reportData?.totalProducts || 0}
              icon="inventory-2"
              iconColor="#f97316"
            />
          </View>
        </View>

        {reportData?.topRetailers && reportData.topRetailers.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top Retailers</Text>
            <View style={styles.topRetailersCard}>
              {reportData.topRetailers.map((retailer, index) => (
                <View key={index} style={styles.retailerRow}>
                  <View style={styles.retailerLeft}>
                    <View style={styles.rankBadge}>
                      <Text style={styles.rankText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.retailerName}>{retailer.name}</Text>
                  </View>
                  <Text style={styles.retailerAmount}>
                    ₹{retailer.totalAmount.toLocaleString()}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {reportData?.monthlyData && reportData.monthlyData.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Monthly Revenue</Text>
            <View style={styles.monthlyCard}>
              {reportData.monthlyData.map((data, index) => (
                <View key={index} style={styles.monthRow}>
                  <Text style={styles.monthLabel}>{data.month}</Text>
                  <Text style={styles.monthValue}>₹{data.revenue.toLocaleString()}</Text>
                </View>
              ))}
            </View>
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
    backgroundColor: '#f8fafc',
  },
  periodSelector: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  periodTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  statsGrid: {
    gap: 0,
  },
  topRetailersCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  retailerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  retailerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563eb',
  },
  retailerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
  },
  retailerAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#16a34a',
  },
  monthlyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  monthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  monthLabel: {
    fontSize: 16,
    color: '#64748b',
  },
  monthValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
});

export default ReportPage;
