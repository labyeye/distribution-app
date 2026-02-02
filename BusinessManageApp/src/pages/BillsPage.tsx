import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  TextInput,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../components/Header';
import Loader from '../components/Loader';
import Button from '../components/Button';
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
  assignedTo?: string | null;
  assignedToName?: string | null;
}

const BillsPage: React.FC = () => {
  const router = useRouter();
  const [bills, setBills] = useState<Bill[]>([]);
  const [filteredBills, setFilteredBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [staffList, setStaffList] = useState<Array<any>>([]);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [currentAssignBill, setCurrentAssignBill] = useState<null | Bill>(null);
  const [assigning, setAssigning] = useState(false);

  const fetchBills = async () => {
    try {
      const response = await ApiService.get<any>(API_ENDPOINTS.BILLS);
      setBills(response);
      setFilteredBills(response);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load bills');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  useEffect(() => {
    filterBills();
  }, [searchQuery, filterStatus, bills]);

  const filterBills = () => {
    let filtered = bills;

    if (filterStatus !== 'All') {
      filtered = filtered.filter(bill => bill.status === filterStatus);
    }

    if (searchQuery) {
      filtered = filtered.filter(bill =>
        bill.billNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bill.retailer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredBills(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchBills();
  };

  const fetchStaff = async () => {
    try {
      const response = await ApiService.get<any>(`${API_ENDPOINTS.USERS}/staff`);
      setStaffList(response || []);
    } catch (error: any) {
      // ignore silently
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const renderBillItem = ({ item }: { item: Bill }) => (
    <View style={styles.billCard}>
      <View style={styles.billHeader}>
        <Text style={styles.billNumber}>#{item.billNumber}</Text>
        <View
          style={[
            styles.statusBadge,
            // explicit mapping to avoid indexing styles with dynamic keys
            ({ Unpaid: styles.statusUnpaid, Partial: styles.statusPartial, Paid: styles.statusPaid } as Record<string, any>)[item.status] || null,
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
        {item.assignedToName ? (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Assigned To:</Text>
            <Text style={styles.detailValue}>{item.assignedToName}</Text>
          </View>
        ) : null}
        {/* Actions: Assign / Delete */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              setCurrentAssignBill(item);
              setAssignModalVisible(true);
            }}
          >
            <MaterialIcons name="person-add" size={20} color="#2563eb" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { marginLeft: 12 }]}
            onPress={() => {
              Alert.alert('Delete Bill', 'Are you sure you want to delete this bill?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: async () => {
                  try {
                    await ApiService.delete(`${API_ENDPOINTS.BILLS}/${item._id}`);
                    // refresh list
                    fetchBills();
                  } catch (err: any) {
                    Alert.alert('Error', err?.message || 'Failed to delete bill');
                  }
                } }
              ]);
            }}
          >
            <MaterialIcons name="delete" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <Header title="All Bills" showBack />
      
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

              {/* Assign Staff Modal */}
              <Modal
                visible={assignModalVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setAssignModalVisible(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <Text style={styles.sectionTitle}>Assign Staff</Text>
                    <FlatList
                      data={staffList}
                      keyExtractor={(s) => s._id}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={styles.staffItem}
                          onPress={async () => {
                            if (!currentAssignBill) return;
                            setAssigning(true);
                            try {
                              await ApiService.put(`${API_ENDPOINTS.BILLS}/${currentAssignBill._id}/assign`, { staffId: item._id });
                              setAssignModalVisible(false);
                              setCurrentAssignBill(null);
                              fetchBills();
                            } catch (err: any) {
                              Alert.alert('Error', err?.message || 'Failed to assign staff');
                            } finally {
                              setAssigning(false);
                            }
                          }}
                        >
                          <Text style={styles.staffName}>{item.name}</Text>
                        </TouchableOpacity>
                      )}
                      ListEmptyComponent={<Text style={{textAlign:'center',color:'#64748b'}}>No staff found</Text>}
                    />
                    <Button title="Close" onPress={() => setAssignModalVisible(false)} style={{marginTop:12}} />
                  </View>
                </View>
              </Modal>
        </View>
      </View>

      <View style={styles.filterContainer}>
        {['All', 'Unpaid', 'Partial', 'Paid'].map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterButton,
              filterStatus === status && styles.filterButtonActive,
            ]}
            onPress={() => setFilterStatus(status)}
          >
            <Text
              style={[
                styles.filterText,
                filterStatus === status && styles.filterTextActive,
              ]}
            >
              {status}
            </Text>
          </TouchableOpacity>
        ))}
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
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#FFFFFF',
  },
  filterButtonActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  filterTextActive: {
    color: '#FFFFFF',
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
  actionRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#0f172a',
  },
  staffItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e6eef8',
  },
  staffName: {
    fontSize: 16,
    color: '#0f172a',
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

export default BillsPage;
