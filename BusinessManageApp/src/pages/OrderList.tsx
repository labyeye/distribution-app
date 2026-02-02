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

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  retailerName: string;
  orderDate: string;
  totalAmount: number;
  items: OrderItem[];
  status: string;
}

const OrderList: React.FC = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchOrders = async () => {
    try {
      const response = await ApiService.get<any>(API_ENDPOINTS.ORDERS);
      setOrders(response);
      setFilteredOrders(response);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [searchQuery, orders]);

  const filterOrders = () => {
    if (searchQuery) {
      const filtered = orders.filter(order =>
        ((order.orderNumber || order._id || '').toString().toLowerCase().includes(searchQuery.toLowerCase())) ||
        (order.retailerName || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>#
          {item.orderNumber || (item._id ? item._id.toString().slice(-6) : '')}
        </Text>
        <View
          style={[
            styles.statusBadge,
            // map order status to concrete style keys to satisfy TypeScript
            ({ Pending: styles.statusPending, Completed: styles.statusCompleted, Cancelled: styles.statusCancelled } as Record<string, any>)[item.status] || null,
          ]}
        >
          <Text style={styles.statusText}>{item.status || 'Pending'}</Text>
        </View>
      </View>
      
      <Text style={styles.retailerName}>{item.retailerName}</Text>
      
      <View style={styles.orderInfo}>
        <View style={styles.infoRow}>
          <MaterialIcons name="calendar-today" size={16} color="#64748b" />
          <Text style={styles.infoText}>
            {(() => {
              const dateVal = (item.orderDate as any) || (item as any).createdAt;
              if (!dateVal) return '-';
              const d = new Date(dateVal);
              return isNaN(d.getTime()) ? '-' : d.toLocaleDateString();
            })()}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="shopping-cart" size={16} color="#64748b" />
          <Text style={styles.infoText}>{item.items.length} items</Text>
        </View>
      </View>

      <View style={styles.itemsList}>
        {Array.isArray(item.items) && item.items.map((orderItem, index) => {
          const qty = Number((orderItem as any).quantity ?? 0);
          const name = (orderItem as any).productName || (orderItem as any).name || '';
          const price = Number((orderItem as any).price ?? (orderItem as any).netPrice ?? 0);
          const lineTotal = qty * price;
          return (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemName}>
                {name} x {qty}
              </Text>
              <Text style={styles.itemPrice}>
                ₹{lineTotal.toLocaleString()}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total Amount</Text>
        <Text style={styles.totalValue}>
          ₹{(typeof (item as any).totalAmount === 'number'
            ? (item as any).totalAmount
            : (typeof (item as any).totalOrderValue === 'number'
              ? (item as any).totalOrderValue
              : 0)).toLocaleString()}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <Header title="Orders" showBack />
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={20} color="#64748b" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by order number or retailer"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94a3b8"
          />
        </View>
      </View>

      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="shopping-cart" size={64} color="#cbd5e1" />
            <Text style={styles.emptyText}>No orders found</Text>
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
  orderCard: {
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
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563eb',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
  },
  statusPending: {
    backgroundColor: '#fef3c7',
  },
  statusCompleted: {
    backgroundColor: '#d1fae5',
  },
  statusCancelled: {
    backgroundColor: '#fee2e2',
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
  orderInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#64748b',
  },
  itemsList: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 14,
    color: '#1e293b',
    flex: 1,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#16a34a',
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

export default OrderList;
