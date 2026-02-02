import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../components/Header';
import Loader from '../components/Loader';
import AdBanner from '../components/AdBanner';
import ApiService from '../services/api';
import { API_ENDPOINTS } from '../config/api';
import { MaterialIcons } from '@expo/vector-icons';

interface Retailer {
  _id: string;
  name: string;
  contact: string;
  // backend uses address1/address2 and may not have city/state/pincode/gstNumber
  address?: string; // legacy field
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  gstNumber?: string;
  dayAssigned?: string;
  assignedTo?: { _id?: string; name?: string } | string | null;
}

const RetailerList: React.FC = () => {
  const router = useRouter();
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [filteredRetailers, setFilteredRetailers] = useState<Retailer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [staffList, setStaffList] = useState<Array<any>>([]);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [currentAssignRetailer, setCurrentAssignRetailer] = useState<any>(null);
  const [assigning, setAssigning] = useState(false);

  const fetchRetailers = async () => {
    try {
      const response = await ApiService.get<any>(API_ENDPOINTS.RETAILERS);
      setRetailers(response);
      setFilteredRetailers(response);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load retailers');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const response = await ApiService.get<any>(
        `${API_ENDPOINTS.USERS}/staff`,
      );
      setStaffList(response || []);
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => {
    fetchRetailers();
  }, []);

  useEffect(() => {
    fetchStaff();
  }, []);

  useEffect(() => {
    filterRetailers();
  }, [searchQuery, retailers]);

  const filterRetailers = () => {
    if (searchQuery) {
      const filtered = retailers.filter(
        retailer =>
          retailer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (retailer.contact || '').includes(searchQuery) ||
          (retailer.city || retailer.address1 || retailer.address || '')
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      );
      setFilteredRetailers(filtered);
    } else {
      setFilteredRetailers(retailers);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchRetailers();
  };

  const renderRetailerItem = ({ item }: { item: Retailer }) => (
    <View style={styles.retailerCard}>
      <View style={styles.retailerHeader}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="store" size={24} color="#2563eb" />
        </View>
        <View style={styles.retailerInfo}>
          <Text style={styles.retailerName}>{item.name}</Text>
        </View>
      </View>

      <View style={styles.retailerDetails}>
        <View style={styles.detailRow}>
          <MaterialIcons name="location-on" size={16} color="#64748b" />
          <Text style={styles.detailText}>
            {item.address1 || item.address || ''}
            {item.address2 ? `, ${item.address2}` : ''}
          </Text>
        </View>

        {item.dayAssigned && (
          <View style={styles.detailRow}>
            <MaterialIcons name="calendar-today" size={16} color="#64748b" />
            <Text style={styles.detailText}>Day: {item.dayAssigned}</Text>
          </View>
        )}
        {item.assignedTo && (
          <View style={styles.detailRow}>
            <MaterialIcons name="person" size={16} color="#64748b" />
            <Text style={styles.detailText}>
              Assigned:{' '}
              {typeof item.assignedTo === 'string'
                ? item.assignedTo
                : item.assignedTo?.name || ''}
            </Text>
          </View>
        )}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              setCurrentAssignRetailer(item);
              setAssignModalVisible(true);
            }}
          >
            <MaterialIcons name="person-add" size={20} color="#2563eb" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { marginLeft: 12 }]}
            onPress={() => {
              Alert.alert(
                'Delete Retailer',
                'Are you sure you want to delete this retailer?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                      try {
                        await ApiService.delete(
                          `${API_ENDPOINTS.RETAILERS}/${item._id}`,
                        );
                        fetchRetailers();
                      } catch (err: any) {
                        Alert.alert(
                          'Error',
                          err?.message || 'Failed to delete retailer',
                        );
                      }
                    },
                  },
                ],
              );
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
      <Header title="Retailers" showBack />

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={20} color="#64748b" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, contact, or city"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94a3b8"
          />
        </View>
      </View>

      <FlatList
        data={filteredRetailers}
        renderItem={renderRetailerItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="store" size={64} color="#cbd5e1" />
            <Text style={styles.emptyText}>No retailers found</Text>
          </View>
        }
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
              keyExtractor={s => s._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.staffItem}
                  onPress={async () => {
                    if (!currentAssignRetailer) return;
                    setAssigning(true);
                    try {
                      await ApiService.post(
                        `${API_ENDPOINTS.RETAILERS}/${currentAssignRetailer._id}/assign`,
                        { staffId: item._id },
                      );
                      setAssignModalVisible(false);
                      setCurrentAssignRetailer(null);
                      fetchRetailers();
                    } catch (err: any) {
                      Alert.alert(
                        'Error',
                        err?.message || 'Failed to assign staff',
                      );
                    } finally {
                      setAssigning(false);
                    }
                  }}
                >
                  <Text style={styles.staffName}>{item.name}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={{ textAlign: 'center', color: '#64748b' }}>
                  No staff found
                </Text>
              }
            />
            <TouchableOpacity
              onPress={() => setAssignModalVisible(false)}
              style={{ marginTop: 12 }}
            >
              <Text style={{ textAlign: 'center', color: '#2563eb' }}>
                Close
              </Text>
            </TouchableOpacity>
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
  retailerCard: {
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
  retailerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  retailerInfo: {
    flex: 1,
  },
  retailerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  contactText: {
    fontSize: 14,
    color: '#64748b',
  },
  retailerDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  detailText: {
    flex: 1,
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
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

export default RetailerList;
