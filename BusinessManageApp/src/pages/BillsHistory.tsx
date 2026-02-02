import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  RefreshControl,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../components/Header';
import Loader from '../components/Loader';
import AdBanner from '../components/AdBanner';
import ApiService from '../services/api';
import { API_ENDPOINTS } from '../config/api';
import { MaterialIcons } from '@expo/vector-icons';

interface Bill {
  _id: string;
  billNumber: string;
  retailer: string;
  amount: number;
  dueAmount: number;
  billDate: string;
  status: string;
  assignedStaff?: string;
}

const BillsHistory: React.FC = () => {
  const router = useRouter();
  const [bills, setBills] = useState<Bill[]>([]);
  const [filteredBills, setFilteredBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchBillsHistory = async () => {
    try {
      const response = await ApiService.get<any>(API_ENDPOINTS.BILLS_HISTORY);
      setBills(response);
      setFilteredBills(response);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load bills history');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBillsHistory();
  }, []);

  useEffect(() => {
    filterBills();
  }, [searchQuery, bills]);

  const filterBills = () => {
    if (searchQuery) {
      const filtered = bills.filter(bill =>
        bill.billNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bill.retailer.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBills(filtered);
    } else {
      setFilteredBills(bills);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchBillsHistory();
  };

  const renderBillItem = ({ item }: { item: Bill }) => (
    <View style={styles.billCard}>
      <View style={styles.billHeader}>
        <Text style={styles.billNumber}>#{item.billNumber}</Text>
        <View
          style={[
            styles.statusBadge,
            // explicit mapping to avoid indexing styles with dynamic keys
            ( { Unpaid: styles.statusUnpaid, Partial: styles.statusPartial, Paid: styles.statusPaid } as Record<string, any> )[item.status] || null,
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      <Text style={styles.retailerName}>{item.retailer}</Text>
      
      <View style={styles.billDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Total Amount:</Text>
          <Text style={styles.detailValue}>₹{item.amount.toLocaleString()}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Due Amount:</Text>
          <Text style={[styles.detailValue, styles.dueAmount]}>₹{item.dueAmount.toLocaleString()}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Bill Date:</Text>
          <Text style={styles.detailValue}>
            {item.billDate ? new Date(item.billDate).toLocaleDateString() : 'N/A'}
          </Text>
        </View>
        {/* dueDate removed */}
        {item.assignedStaff && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Assigned To:</Text>
            <Text style={styles.detailValue}>{item.assignedStaff}</Text>
          </View>
        )}
      </View>
    </View>
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <Header title="Bills History" showBack />
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={20} color="#64748b" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by bill number or retailer"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94a3b8"
          />
        </View>
      </View>

      <FlatList
        data={filteredBills}
        renderItem={renderBillItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="inbox" size={64} color="#cbd5e1" />
            <Text style={styles.emptyText}>No bills found</Text>
          </View>
        }
      />
      <AdBanner />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#1e293b',
  },
  listContent: {
    padding: 16,
  },
  billCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  billHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  billNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563eb',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusUnpaid: {
    backgroundColor: '#fef3c7',
  },
  statusPartial: {
    backgroundColor: '#dbeafe',
  },
  statusPaid: {
    backgroundColor: '#d1fae5',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
  },
  retailerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  billDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  dueAmount: {
    color: '#ef4444',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 16,
  },
});

export default BillsHistory;
