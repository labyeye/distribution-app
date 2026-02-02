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

const RetailerAdd: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'manual' | 'import'>('manual');
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    gstNumber: '',
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
      newErrors.name = 'Retailer name is required';
    }

    if (!formData.contact.trim()) {
      newErrors.contact = 'Contact number is required';
    } else if (!/^\d{10}$/.test(formData.contact.trim())) {
      newErrors.contact = 'Please enter a valid 10-digit contact number';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await ApiService.post(API_ENDPOINTS.RETAILERS, {
        name: formData.name.trim(),
        contact: formData.contact.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
        gstNumber: formData.gstNumber.trim(),
      });

      Alert.alert('Success', 'Retailer added successfully', [
        {
          text: 'OK',
          onPress: () => {
            setFormData({
              name: '',
              contact: '',
              address: '',
              city: '',
              state: '',
              pincode: '',
              gstNumber: '',
            });
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to add retailer'
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

  const handleImportRetailers = async () => {
    Alert.alert(
      'Import Retailers',
      'Excel import feature requires file picker. This feature is optimized for web. Please use the web dashboard for bulk imports.',
      [{ text: 'OK' }],
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Add Retailer" showBack />
      
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
          <Text style={styles.sectionTitle}>Retailer Information</Text>

          <Input
            label="Retailer Name *"
            placeholder="Enter retailer name"
            value={formData.name}
            onChangeText={(text) => handleInputChange('name', text)}
            error={errors.name}
            editable={!loading}
          />

          <Input
            label="Contact Number *"
            placeholder="Enter 10-digit contact number"
            value={formData.contact}
            onChangeText={(text) => handleInputChange('contact', text)}
            error={errors.contact}
            keyboardType="phone-pad"
            maxLength={10}
            editable={!loading}
          />

          <Input
            label="Address *"
            placeholder="Enter address"
            value={formData.address}
            onChangeText={(text) => handleInputChange('address', text)}
            error={errors.address}
            multiline
            numberOfLines={3}
            editable={!loading}
          />

          <Input
            label="City *"
            placeholder="Enter city"
            value={formData.city}
            onChangeText={(text) => handleInputChange('city', text)}
            error={errors.city}
            editable={!loading}
          />

          <Input
            label="State"
            placeholder="Enter state"
            value={formData.state}
            onChangeText={(text) => handleInputChange('state', text)}
            editable={!loading}
          />

          <Input
            label="Pincode"
            placeholder="Enter pincode"
            value={formData.pincode}
            onChangeText={(text) => handleInputChange('pincode', text)}
            keyboardType="number-pad"
            maxLength={6}
            editable={!loading}
          />

          <Input
            label="GST Number"
            placeholder="Enter GST number (optional)"
            value={formData.gstNumber}
            onChangeText={(text) => handleInputChange('gstNumber', text)}
            autoCapitalize="characters"
            editable={!loading}
          />

          <Button
            title="Add Retailer"
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
          <Text style={styles.sectionTitle}>Import Retailers from Excel</Text>
          
          <View style={styles.importInfo}>
            <MaterialIcons name="info" size={24} color="#2563eb" />
            <Text style={styles.importInfoText}>
              Upload an Excel file with columns: Retailer Name, Address 1 (required), Address 2 (optional)
            </Text>
          </View>

          <View style={styles.importFeatureBox}>
            <MaterialIcons name="cloud-upload" size={48} color="#94a3b8" />
            <Text style={styles.importFeatureTitle}>Excel Import</Text>
            <Text style={styles.importFeatureText}>
              For bulk retailer imports, please use the web dashboard's import feature which provides:
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

export default RetailerAdd;
