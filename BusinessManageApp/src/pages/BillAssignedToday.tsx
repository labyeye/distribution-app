import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
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
  assignedDay?: string;
}

const BillAssignedToday: React.FC = () => {
  const router = useRouter();
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [collectionAmount, setCollectionAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchBills = async () => {
    try {
      const response = await ApiService.get<any>(API_ENDPOINTS.BILLS_ASSIGNED);
      setBills(response);
    } catch (error: any) {
      console.error('Failed to load bills:', error);
      const message = error.response?.data?.message || error.message || 'Failed to load bills';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const filteredBills = bills.filter((b) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      (b.retailer && b.retailer.toLowerCase().includes(q)) ||
      (b.billNumber && b.billNumber.toLowerCase().includes(q))
    );
  });

  const onRefresh = () => {
    setRefreshing(true);
    fetchBills();
  };

  const handleCollectionPress = (bill: Bill) => {
    setSelectedBill(bill);
    setCollectionAmount('');
    setPaymentMode('Cash');
    setRemarks('');
    setShowModal(true);
  };

  const handleSubmitCollection = async () => {
    if (!selectedBill) return;

    const amount = parseFloat(collectionAmount);
    if (isNaN(amount) || amount <= 0 || amount > selectedBill.dueAmount) {
      Alert.alert('Error', 'Please enter a valid collection amount');
      return;
    }

    setSubmitting(true);
    try {
      await ApiService.post(API_ENDPOINTS.COLLECTIONS, {
        billId: selectedBill._id,
        amountCollected: amount,
        paymentMode,
        remarks,
        collectionDate: new Date().toISOString(),
      });

      Alert.alert('Success', 'Collection recorded successfully');
      setShowModal(false);
      fetchBills();
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to record collection',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const renderBillItem = ({ item }: { item: Bill }) => (
    <View style={styles.billCard}>
      <View style={styles.billHeader}>
        <Text style={styles.billNumber}>#{item.billNumber}</Text>
        <View
          style={[
            styles.statusBadge,
            // map status to concrete style keys to satisfy TypeScript
            (
              {
                Unpaid: styles.statusUnpaid,
                Partial: styles.statusPartial,
                Paid: styles.statusPaid,
              } as Record<string, any>
            )[item.status] || null,
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <Text style={styles.retailerName}>{item.retailer}</Text>

      <View style={styles.billDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Total Amount:</Text>
          <Text style={styles.detailValue}>
            ₹{item.amount.toLocaleString()}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Due Amount:</Text>
          <Text style={[styles.detailValue, styles.dueAmount]}>
            ₹{item.dueAmount.toLocaleString()}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Bill Date:</Text>
          <Text style={styles.detailValue}>
            {item.billDate
              ? new Date(item.billDate).toLocaleDateString()
              : 'N/A'}
          </Text>
        </View>
        {/* dueDate removed */}
      </View>

      {item.dueAmount > 0 && (
        <Button
          title="Record Collection"
          onPress={() => handleCollectionPress(item)}
          variant="success"
          style={styles.collectButton}
        />
      )}
    </View>
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <Header title="Bills Assigned Today" showBack />

      <View style={styles.searchContainer}>
        <Input
          placeholder="Search by retailer or bill number"
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon="search"
          editable={!loading}
        />
      </View>

      <FlatList
        data={filteredBills}
        renderItem={renderBillItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="inbox" size={64} color="#cbd5e1" />
            <Text style={styles.emptyText}>No bills assigned today</Text>
          </View>
        }
      />

      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Record Collection</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <MaterialIcons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {selectedBill && (
                <>
                  <View style={styles.modalBillInfo}>
                    <Text style={styles.modalBillNumber}>
                      #{selectedBill.billNumber}
                    </Text>
                    <Text style={styles.modalRetailer}>
                      {selectedBill.retailer}
                    </Text>
                    <Text style={styles.modalDue}>
                      Due: ₹{selectedBill.dueAmount.toLocaleString()}
                    </Text>
                  </View>

                  <Input
                    label="Collection Amount *"
                    placeholder="Enter amount"
                    value={collectionAmount}
                    onChangeText={setCollectionAmount}
                    keyboardType="decimal-pad"
                    editable={!submitting}
                  />

                  <View style={styles.paymentModeContainer}>
                    <Text style={styles.label}>Payment Mode</Text>
                    <View style={styles.paymentModeButtons}>
                      {['Cash', 'UPI', 'Cheque', 'Bank Transfer'].map(mode => (
                        <TouchableOpacity
                          key={mode}
                          style={[
                            styles.paymentModeButton,
                            paymentMode === mode &&
                              styles.paymentModeButtonActive,
                          ]}
                          onPress={() => setPaymentMode(mode)}
                          disabled={submitting}
                        >
                          <Text
                            style={[
                              styles.paymentModeText,
                              paymentMode === mode &&
                                styles.paymentModeTextActive,
                            ]}
                          >
                            {mode}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <Input
                    label="Remarks"
                    placeholder="Enter remarks (optional)"
                    value={remarks}
                    onChangeText={setRemarks}
                    multiline
                    numberOfLines={3}
                    editable={!submitting}
                  />

                  <Button
                    title="Submit Collection"
                    onPress={handleSubmitCollection}
                    loading={submitting}
                    disabled={submitting}
                    variant="success"
                  />
                </>
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
    backgroundColor: '#f8fafc',
  },
  listContent: {
    padding: 16,
  },
  searchContainer: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
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
    marginBottom: 16,
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
  collectButton: {
    marginTop: 8,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  modalBillInfo: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  modalBillNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563eb',
    marginBottom: 4,
  },
  modalRetailer: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  modalDue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
  },
  paymentModeContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  paymentModeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  paymentModeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#FFFFFF',
  },
  paymentModeButtonActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  paymentModeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  paymentModeTextActive: {
    color: '#FFFFFF',
  },
});

export default BillAssignedToday;
