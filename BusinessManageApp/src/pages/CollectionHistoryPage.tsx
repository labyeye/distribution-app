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
} from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../components/Header';
import Loader from '../components/Loader';
import AdBanner from '../components/AdBanner';
import ApiService from '../services/api';
import ExportService from '../services/exportService';
import { API_ENDPOINTS } from '../config/api';
import { MaterialIcons } from '@expo/vector-icons';

interface Collection {
  _id: string;
  billNumber: string;
  retailer: string;
  amountCollected: number;
  paymentMode: string;
  collectionDate: string;
  staffName?: string;
  remarks?: string;
}

const CollectionHistoryPage: React.FC = () => {
  const router = useRouter();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<Collection[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCollections = async () => {
    try {
      const response = await ApiService.get<any>(
        API_ENDPOINTS.COLLECTIONS_HISTORY,
      );
      setCollections(response);
      setFilteredCollections(response);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load collection history');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  useEffect(() => {
    filterCollections();
  }, [searchQuery, collections]);

  const filterCollections = () => {
    if (searchQuery) {
      const filtered = collections.filter(
        collection =>
          collection.billNumber
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          collection.retailer.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredCollections(filtered);
    } else {
      setFilteredCollections(collections);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchCollections();
  };

  const handleExportToday = async () => {
    try {
      await ExportService.exportTodayCollections();
      Alert.alert('Success', 'Collections exported successfully');
    } catch (error: any) {
      Alert.alert('Error', 'Failed to export collections');
    }
  };

  const renderCollectionItem = ({ item }: { item: Collection }) => (
    <View style={styles.collectionCard}>
      <View style={styles.collectionHeader}>
        <Text style={styles.billNumber}>#{item.billNumber}</Text>
        <View style={styles.paymentModeBadge}>
          <Text style={styles.paymentModeText}>{item.paymentMode}</Text>
        </View>
      </View>

      <Text style={styles.retailerName}>{item.retailer}</Text>

      <View style={styles.amountContainer}>
        <Text style={styles.amountLabel}>Amount Collected</Text>
        <Text style={styles.amountValue}>
          ₹{item.amountCollected.toLocaleString()}
        </Text>
      </View>

      <View style={styles.collectionDetails}>
        <View style={styles.detailRow}>
          <MaterialIcons name="calendar-today" size={16} color="#64748b" />
          <Text style={styles.detailText}>
            {new Date(item.collectionDate).toLocaleDateString()}
          </Text>
        </View>
        {item.staffName && (
          <View style={styles.detailRow}>
            <MaterialIcons name="person" size={16} color="#64748b" />
            <Text style={styles.detailText}>{item.staffName}</Text>
          </View>
        )}
      </View>

      {item.remarks && (
        <View style={styles.remarksContainer}>
          <Text style={styles.remarksLabel}>Remarks:</Text>
          <Text style={styles.remarksText}>{item.remarks}</Text>
        </View>
      )}
    </View>
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <Header title="Collection History" showBack />

      <View style={styles.headerActions}>
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
        <TouchableOpacity
          style={styles.exportButton}
          onPress={handleExportToday}
        >
          <MaterialIcons name="file-download" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredCollections}
        renderItem={renderCollectionItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="inbox" size={64} color="#cbd5e1" />
            <Text style={styles.emptyText}>No collections found</Text>
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
  headerActions: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    gap: 12,
    alignItems: 'center',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  exportButton: {
    backgroundColor: '#16a34a',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
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
  collectionCard: {
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
  collectionHeader: {
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
  paymentModeBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  paymentModeText: {
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
  amountContainer: {
    backgroundColor: '#dcfce7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  amountLabel: {
    fontSize: 12,
    color: '#166534',
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#16a34a',
  },
  collectionDetails: {
    gap: 8,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#64748b',
  },
  remarksContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  remarksLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 4,
  },
  remarksText: {
    fontSize: 14,
    color: '#1e293b',
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

export default CollectionHistoryPage;
