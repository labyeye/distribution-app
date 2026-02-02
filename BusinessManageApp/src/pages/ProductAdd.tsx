import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import AdBanner from '../components/AdBanner';
import ApiService from '../services/api';
import { API_ENDPOINTS } from '../config/api';
import { MaterialIcons } from '@expo/vector-icons';

const ProductAdd: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'manual' | 'import'>('manual');
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: '',
    price: '',
    unit: '',
    description: '',
  });
  const [errors, setErrors] = useState<any>({});
  const [importProgress, setImportProgress] = useState({
    current: 0,
    total: 0,
    message: '',
  });

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Product code is required';
    }

    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await ApiService.post(API_ENDPOINTS.PRODUCTS, {
        name: formData.name.trim(),
        code: formData.code.trim(),
        category: formData.category.trim(),
        price: Number(formData.price),
        unit: formData.unit.trim(),
        description: formData.description.trim(),
      });

      Alert.alert('Success', 'Product added successfully', [
        {
          text: 'OK',
          onPress: () => {
            setFormData({
              name: '',
              code: '',
              category: '',
              price: '',
              unit: '',
              description: '',
            });
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to add product'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleImportProducts = async () => {
    Alert.alert(
      'Import Products',
      'Excel import feature requires file picker. This feature is optimized for web. Please use the web dashboard for bulk imports.',
      [{ text: 'OK' }],
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Add Product" showBack />
      
      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'manual' && styles.tabActive,
          ]}
          onPress={() => setActiveTab('manual')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'manual' && styles.tabTextActive,
            ]}
          >
            Manual Entry
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'import' && styles.tabActive,
          ]}
          onPress={() => setActiveTab('import')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'import' && styles.tabTextActive,
            ]}
          >
            Import Excel
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'manual' ? (
      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Product Information</Text>

          <Input
            label="Product Name *"
            placeholder="Enter product name"
            value={formData.name}
            onChangeText={(text) => handleInputChange('name', text)}
            error={errors.name}
            editable={!loading}
          />

          <Input
            label="Product Code *"
            placeholder="Enter product code"
            value={formData.code}
            onChangeText={(text) => handleInputChange('code', text)}
            error={errors.code}
            autoCapitalize="characters"
            editable={!loading}
          />

          <Input
            label="Category"
            placeholder="Enter category"
            value={formData.category}
            onChangeText={(text) => handleInputChange('category', text)}
            editable={!loading}
          />

          <Input
            label="Price *"
            placeholder="Enter price"
            value={formData.price}
            onChangeText={(text) => handleInputChange('price', text)}
            error={errors.price}
            keyboardType="decimal-pad"
            editable={!loading}
          />

          <Input
            label="Unit"
            placeholder="Enter unit (e.g., Ltr, Kg, Pcs)"
            value={formData.unit}
            onChangeText={(text) => handleInputChange('unit', text)}
            editable={!loading}
          />

          <Input
            label="Description"
            placeholder="Enter product description"
            value={formData.description}
            onChangeText={(text) => handleInputChange('description', text)}
            multiline
            numberOfLines={3}
            editable={!loading}
          />

          <Button
            title="Add Product"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
      ) : (
      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Import Products from Excel</Text>
          
          <View style={styles.importInfo}>
            <MaterialIcons name="info" size={24} color="#2563eb" />
            <Text style={styles.importInfoText}>
              Upload an Excel file with columns: Code, Product Name, MRP, Price, Weight, Scheme, Stock, Company
            </Text>
          </View>

          <View style={styles.importFeatureBox}>
            <MaterialIcons name="cloud-upload" size={48} color="#94a3b8" />
            <Text style={styles.importFeatureTitle}>Excel Import</Text>
            <Text style={styles.importFeatureText}>
              For bulk product imports, please use the web dashboard's import feature which provides:
            </Text>
            
            <View style={styles.featureList}>
              <Text style={styles.featureItem}>✓ File validation and preview</Text>
              <Text style={styles.featureItem}>✓ Progress tracking</Text>
              <Text style={styles.featureItem}>✓ Detailed error reporting</Text>
              <Text style={styles.featureItem}>✓ Batch processing up to 1000 records</Text>
            </View>

            <Button
              title="Open Web Dashboard"
              onPress={() => {
                Alert.alert(
                  'Web Dashboard',
                  'Please open the web application at http://localhost:3000 to access the Excel import feature.',
                );
              }}
              style={styles.submitButton}
            />

            <Text style={styles.alternativeText}>
              Or continue with manual entry on the "Manual Entry" tab
            </Text>
          </View>

          {importProgress.message !== '' && (
            <View style={styles.progressBox}>
              <ActivityIndicator size="large" color="#2563eb" />
              <Text style={styles.progressText}>{importProgress.message}</Text>
              {importProgress.total > 0 && (
                <Text style={styles.progressCounter}>
                  {importProgress.current} / {importProgress.total}
                </Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>
      )}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#2563eb',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
  tabTextActive: {
    color: '#2563eb',
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
  importInfo: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    marginBottom: 20,
    gap: 12,
  },
  importInfoText: {
    flex: 1,
    fontSize: 14,
    color: '#0c4a6e',
    lineHeight: 20,
  },
  importFeatureBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  importFeatureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 12,
    marginBottom: 8,
  },
  importFeatureText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
  },
  featureList: {
    width: '100%',
    marginBottom: 20,
  },
  featureItem: {
    fontSize: 14,
    color: '#475569',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  progressBox: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f0f4f8',
    borderRadius: 8,
    alignItems: 'center',
  },
  progressText: {
    marginTop: 12,
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '600',
  },
  progressCounter: {
    marginTop: 8,
    fontSize: 12,
    color: '#64748b',
  },
  alternativeText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 12,
  },
  submitButton: {
    marginTop: 8,
  },
});

export default ProductAdd;
