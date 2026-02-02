import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
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

interface Product {
  _id: string;
  name: string;
  code: string;
  price: number;
}

interface OrderItem {
  product: string;
  productName: string;
  quantity: number;
  price: number;
}

const OrderCreate: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    retailerName: '',
    orderDate: new Date().toISOString().split('T')[0],
  });
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await ApiService.get<any>(API_ENDPOINTS.PRODUCTS);
      setProducts(response);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const addOrderItem = () => {
    if (products.length === 0) {
      Alert.alert('Error', 'No products available');
      return;
    }
    const firstProduct = products[0];
    setOrderItems([
      ...orderItems,
      {
        product: firstProduct._id,
        productName: firstProduct.name,
        quantity: 1,
        price: firstProduct.price,
      },
    ]);
  };

  const removeOrderItem = (index: number) => {
    const newItems = orderItems.filter((_, i) => i !== index);
    setOrderItems(newItems);
  };

  const updateOrderItem = (index: number, field: string, value: any) => {
    const newItems = [...orderItems];
    if (field === 'product') {
      const product = products.find(p => p._id === value);
      if (product) {
        newItems[index] = {
          ...newItems[index],
          product: value,
          productName: product.name,
          price: product.price,
        };
      }
    } else if (field === 'quantity') {
      newItems[index] = {
        ...newItems[index],
        quantity: parseInt(value) || 0,
      };
    }
    setOrderItems(newItems);
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.retailerName.trim()) {
      newErrors.retailerName = 'Retailer name is required';
    }

    if (orderItems.length === 0) {
      Alert.alert('Error', 'Please add at least one product');
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await ApiService.post(API_ENDPOINTS.ORDERS, {
        retailerName: formData.retailerName.trim(),
        orderDate: formData.orderDate,
        items: orderItems.map(item => ({
          product: item.product,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: calculateTotal(),
      });

      Alert.alert('Success', 'Order created successfully', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to create order');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <Header title="Create Order" showBack />
      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Order Information</Text>

          <Input
            label="Retailer Name *"
            placeholder="Enter retailer name"
            value={formData.retailerName}
            onChangeText={(text) => {
              setFormData({ ...formData, retailerName: text });
              setErrors({ ...errors, retailerName: '' });
            }}
            error={errors.retailerName}
            editable={!submitting}
          />

          <Input
            label="Order Date (YYYY-MM-DD)"
            placeholder="2026-01-11"
            value={formData.orderDate}
            onChangeText={(text) => setFormData({ ...formData, orderDate: text })}
            editable={!submitting}
          />

          <View style={styles.itemsSection}>
            <View style={styles.itemsHeader}>
              <Text style={styles.sectionTitle}>Order Items</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={addOrderItem}
                disabled={submitting}
              >
                <MaterialIcons name="add-circle" size={24} color="#2563eb" />
              </TouchableOpacity>
            </View>

            {orderItems.map((item, index) => (
              <View key={index} style={styles.orderItemCard}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemNumber}>Item {index + 1}</Text>
                  <TouchableOpacity
                    onPress={() => removeOrderItem(index)}
                    disabled={submitting}
                  >
                    <MaterialIcons name="delete" size={24} color="#ef4444" />
                  </TouchableOpacity>
                </View>

                <View style={styles.productSelect}>
                  <Text style={styles.selectLabel}>Product</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {products.map((product) => (
                      <TouchableOpacity
                        key={product._id}
                        style={[
                          styles.productOption,
                          item.product === product._id && styles.productOptionSelected,
                        ]}
                        onPress={() => updateOrderItem(index, 'product', product._id)}
                        disabled={submitting}
                      >
                        <Text
                          style={[
                            styles.productOptionText,
                            item.product === product._id && styles.productOptionTextSelected,
                          ]}
                        >
                          {product.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <View style={styles.itemRow}>
                  <View style={styles.itemField}>
                    <Text style={styles.fieldLabel}>Quantity</Text>
                    <Input
                      placeholder="Qty"
                      value={item.quantity.toString()}
                      onChangeText={(text) => updateOrderItem(index, 'quantity', text)}
                      keyboardType="number-pad"
                      editable={!submitting}
                      containerStyle={styles.inputContainer}
                    />
                  </View>
                  <View style={styles.itemField}>
                    <Text style={styles.fieldLabel}>Price</Text>
                    <Text style={styles.priceText}>₹{item.price.toLocaleString()}</Text>
                  </View>
                  <View style={styles.itemField}>
                    <Text style={styles.fieldLabel}>Total</Text>
                    <Text style={styles.totalText}>
                      ₹{(item.quantity * item.price).toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.grandTotalCard}>
            <Text style={styles.grandTotalLabel}>Grand Total</Text>
            <Text style={styles.grandTotalValue}>₹{calculateTotal().toLocaleString()}</Text>
          </View>

          <Button
            title="Create Order"
            onPress={handleSubmit}
            loading={submitting}
            disabled={submitting}
            style={styles.submitButton}
          />
        </View>
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
  content: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  itemsSection: {
    marginTop: 24,
  },
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    padding: 4,
  },
  orderItemCard: {
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
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  productSelect: {
    marginBottom: 12,
  },
  selectLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  productOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#FFFFFF',
    marginRight: 8,
  },
  productOptionSelected: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  productOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  productOptionTextSelected: {
    color: '#FFFFFF',
  },
  itemRow: {
    flexDirection: 'row',
    gap: 12,
  },
  itemField: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 4,
  },
  inputContainer: {
    marginBottom: 0,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 12,
  },
  totalText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#16a34a',
    marginTop: 12,
  },
  grandTotalCard: {
    backgroundColor: '#dcfce7',
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  grandTotalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#166534',
  },
  grandTotalValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#16a34a',
  },
  submitButton: {
    marginTop: 8,
  },
});

export default OrderCreate;
