import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import AdBanner from '../components/AdBanner';
import ApiService from '../services/api';
import ImportService from '../services/importService';
import { API_ENDPOINTS } from '../config/api';
import { MaterialIcons } from '@expo/vector-icons';

const BillAdd: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'manual' | 'import'>('manual');
  const [formData, setFormData] = useState({
    billNumber: '',
    retailer: '',
    amount: '',
    dueAmount: '',
    billDate: '',
    status: 'Unpaid',
    collectionDay: 'Monday',
  });
  const [errors, setErrors] = useState<any>({});
  const [importProgress, setImportProgress] = useState({
    current: 0,
    total: 0,
    message: '',
  });

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.billNumber.trim()) {
      newErrors.billNumber = 'Bill number is required';
    }

    if (!formData.retailer.trim()) {
      newErrors.retailer = 'Retailer name is required';
    }

    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!formData.dueAmount) {
      newErrors.dueAmount = 'Due amount is required';
    } else if (
      isNaN(Number(formData.dueAmount)) ||
      Number(formData.dueAmount) < 0
    ) {
      newErrors.dueAmount = 'Please enter a valid due amount';
    }

    if (!formData.billDate) {
      newErrors.billDate = 'Bill date is required';
    } else {
      // Validate date format YYYY-MM-DD
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(formData.billDate)) {
        newErrors.billDate = 'Invalid date format. Use YYYY-MM-DD';
      } else {
        const date = new Date(formData.billDate);
        if (isNaN(date.getTime())) {
          newErrors.billDate = 'Invalid date';
        }
      }
    }

    // dueDate removed from form

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await ApiService.post(API_ENDPOINTS.BILLS, {
        billNumber: formData.billNumber.trim(),
        retailer: formData.retailer.trim(),
        amount: Number(formData.amount),
        dueAmount: Number(formData.dueAmount),
        billDate: formData.billDate,
        status: formData.status,
        collectionDay: formData.collectionDay,
      });

      Alert.alert('Success', 'Bill added successfully', [
        {
          text: 'OK',
          onPress: () => {
            setFormData({
              billNumber: '',
              retailer: '',
              amount: '',
              dueAmount: '',
              billDate: '',
              status: 'Unpaid',
              collectionDay: 'Monday',
            });
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to add bill',
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

  const handleImportBills = async () => {
    Alert.alert(
      'Import Bills',
      'Excel import feature requires file picker. This feature is optimized for web. Please use the web dashboard for bulk imports.',
      [{ text: 'OK' }],
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Add Bill" showBack />
      
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
          <Text style={styles.sectionTitle}>Bill Information</Text>

          <Input
            label="Bill Number *"
            placeholder="Enter bill number"
            value={formData.billNumber}
            onChangeText={text => handleInputChange('billNumber', text)}
            error={errors.billNumber}
            editable={!loading}
          />

          <Input
            label="Retailer Name *"
            placeholder="Enter retailer name"
            value={formData.retailer}
            onChangeText={text => handleInputChange('retailer', text)}
            error={errors.retailer}
            editable={!loading}
          />

          <Input
            label="Total Amount *"
            placeholder="Enter total amount"
            value={formData.amount}
            onChangeText={text => handleInputChange('amount', text)}
            error={errors.amount}
            keyboardType="decimal-pad"
            editable={!loading}
          />

          <Input
            label="Due Amount *"
            placeholder="Enter due amount"
            value={formData.dueAmount}
            onChangeText={text => handleInputChange('dueAmount', text)}
            error={errors.dueAmount}
            keyboardType="decimal-pad"
            editable={!loading}
          />

          <Input
            label="Bill Date * (YYYY-MM-DD)"
            placeholder="2026-01-11"
            value={formData.billDate}
            onChangeText={text => handleInputChange('billDate', text)}
            error={errors.billDate}
            editable={!loading}
          />

          <View style={styles.dayContainer}>
            <Text style={styles.label}>Collection Day *</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.dayScroll}
            >
              {[
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
                'Sunday',
              ].map(day => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayButton,
                    formData.collectionDay === day && styles.dayButtonActive,
                  ]}
                  onPress={() => handleInputChange('collectionDay', day)}
                  disabled={loading}
                >
                  <Text
                    style={[
                      styles.dayButtonText,
                      formData.collectionDay === day &&
                        styles.dayButtonTextActive,
                    ]}
                  >
                    {day.slice(0, 3)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.statusContainer}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.statusButtons}>
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  formData.status === 'Unpaid' && styles.statusButtonActive,
                ]}
                onPress={() => handleInputChange('status', 'Unpaid')}
                disabled={loading}
              >
                <Text
                  style={[
                    styles.statusButtonText,
                    formData.status === 'Unpaid' &&
                      styles.statusButtonTextActive,
                  ]}
                >
                  Unpaid
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  formData.status === 'Partial' && styles.statusButtonActive,
                ]}
                onPress={() => handleInputChange('status', 'Partial')}
                disabled={loading}
              >
                <Text
                  style={[
                    styles.statusButtonText,
                    formData.status === 'Partial' &&
                      styles.statusButtonTextActive,
                  ]}
                >
                  Partial
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  formData.status === 'Paid' && styles.statusButtonActive,
                ]}
                onPress={() => handleInputChange('status', 'Paid')}
                disabled={loading}
              >
                <Text
                  style={[
                    styles.statusButtonText,
                    formData.status === 'Paid' && styles.statusButtonTextActive,
                  ]}
                >
                  Paid
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Button
            title="Add Bill"
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
          
          <Text style={styles.sectionTitle}>Import Bills from Excel</Text>
          
          <View style={styles.importInfo}>
            <MaterialIcons name="info" size={24} color="#2563eb" />
            <Text style={styles.importInfoText}>
              Upload an Excel file with columns: Bill Number, Retailer, Amount, Due Amount, Bill Date, Collection Day
            </Text>
          </View>

          <View style={styles.importFeatureBox}>
            <MaterialIcons name="cloud-upload" size={48} color="#94a3b8" />
            <Text style={styles.importFeatureTitle}>Excel Import</Text>
            <Text style={styles.importFeatureText}>
              For bulk bill imports, please use the web dashboard's import feature which provides:
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
  statusContainer: {
    marginBottom: 16,
  },
  dayContainer: {
    marginBottom: 16,
  },
  dayScroll: {
    flexDirection: 'row',
  },
  dayButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayButtonActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  dayButtonTextActive: {
    color: '#FFFFFF',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  statusButtonActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  statusButtonTextActive: {
    color: '#FFFFFF',
  },
  submitButton: {
    marginTop: 8,
  },
});

export default BillAdd;
