import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  RefreshControl,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import Loader from '../components/Loader';
import AdBanner from '../components/AdBanner';
import ApiService from '../services/api';
import { AuthService } from '../services/auth';
import { API_ENDPOINTS } from '../config/api';
import { MaterialIcons } from '@expo/vector-icons';

interface User {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

const Users: React.FC = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    email: '',
    phone: '',
    role: 'staff',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [passwordUser, setPasswordUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await ApiService.get<User[]>(API_ENDPOINTS.USERS);
      setUsers(response);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load users');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const loadCurrent = async () => {
      try {
        const u = await AuthService.getUser();
        setCurrentUser(u as User | null);
      } catch (e) {
        // ignore
      }
    };
    loadCurrent();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      password: '',
      email: '',
      phone: '',
      role: 'staff',
    });
    setModalVisible(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      password: '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role,
    });
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) {
      Alert.alert('Error', 'Name and Email are required');
      return;
    }

    if (!editingUser && !formData.password) {
      Alert.alert('Error', 'Password is required for new users');
      return;
    }

    try {
      if (editingUser) {
        await ApiService.put(`${API_ENDPOINTS.USERS}/${editingUser._id}`, formData);
        Alert.alert('Success', 'User updated successfully');
      } else {
        await ApiService.post(API_ENDPOINTS.USERS, formData);
        Alert.alert('Success', 'User created successfully');
      }
      setModalVisible(false);
      fetchUsers();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save user');
    }
  };

  const handleToggleStatus = async (user: User) => {
    try {
      await ApiService.put(`${API_ENDPOINTS.USERS}/${user._id}`, {
        isActive: !user.isActive,
      });
      Alert.alert('Success', `User ${user.isActive ? 'deactivated' : 'activated'} successfully`);
      fetchUsers();
    } catch (error: any) {
      Alert.alert('Error', 'Failed to update user status');
    }
  };

  const handleDelete = (user: User) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete ${user.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await ApiService.delete(`${API_ENDPOINTS.USERS}/${user._id}`);
              Alert.alert('Success', 'User deleted successfully');
              fetchUsers();
            } catch (error: any) {
              Alert.alert('Error', 'Failed to delete user');
            }
          },
        },
      ]
    );
  };

  const openPasswordModal = (user: User) => {
    setPasswordUser(user);
    setNewPassword('');
    setPasswordModalVisible(true);
  };

  const handleChangePassword = async () => {
    if (!passwordUser) return;
    if (!newPassword) {
      Alert.alert('Error', 'Password cannot be empty');
      return;
    }
    try {
      await ApiService.put(`${API_ENDPOINTS.USERS}/${passwordUser._id}`, { password: newPassword });
      Alert.alert('Success', 'Password updated successfully');
      setPasswordModalVisible(false);
      fetchUsers();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update password');
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderUserItem = ({ item }: { item: User }) => (
    <View style={styles.userCard}>
      <View style={styles.userHeader}>
        <View style={styles.userIcon}>
          <MaterialIcons name="person" size={24} color="#2563eb" />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.username}>{item.email}</Text>
        </View>
        <View style={[styles.statusBadge, !item.isActive && styles.statusBadgeInactive]}>
          <Text style={styles.statusText}>{item.isActive ? 'Active' : 'Inactive'}</Text>
        </View>
      </View>

      <View style={styles.userDetails}>
        <View style={styles.detailRow}>
          <MaterialIcons name="admin-panel-settings" size={16} color="#64748b" />
          <Text style={styles.detailText}>{item.role.toUpperCase()}</Text>
        </View>
        {item.email && (
          <View style={styles.detailRow}>
            <MaterialIcons name="email" size={16} color="#64748b" />
            <Text style={styles.detailText}>{item.email}</Text>
          </View>
        )}
        {item.phone && (
          <View style={styles.detailRow}>
            <MaterialIcons name="phone" size={16} color="#64748b" />
            <Text style={styles.detailText}>{item.phone}</Text>
          </View>
        )}
      </View>

      <View style={styles.userActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => openEditModal(item)}
        >
          <MaterialIcons name="edit" size={20} color="#2563eb" />
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleToggleStatus(item)}
        >
          <MaterialIcons name={item.isActive ? 'block' : 'check-circle'} size={20} color={item.isActive ? '#ef4444' : '#16a34a'} />
          <Text style={styles.actionButtonText}>{item.isActive ? 'Deactivate' : 'Activate'}</Text>
        </TouchableOpacity>
        {currentUser?.role === 'admin' && item.role === 'staff' && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => openPasswordModal(item)}
          >
            <MaterialIcons name={'vpn-key' as any} size={20} color="#f59e0b" />
            <Text style={styles.actionButtonText}>Change Password</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDelete(item)}
        >
          <MaterialIcons name="delete" size={20} color="#ef4444" />
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <Header title="Users Management" showBack />
      
      <View style={styles.searchContainer}>
        <Input
          placeholder="Search by name, username or email"
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon="search"
        />
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item._id}
        renderItem={renderUserItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="people-outline" size={64} color="#cbd5e1" />
            <Text style={styles.emptyText}>No users found</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={openAddModal}>
        <MaterialIcons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingUser ? 'Edit User' : 'Add New User'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              <Input
                label="Name"
                placeholder="Enter full name"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
              />
              {!editingUser && (
                <Input
                  label="Password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChangeText={(text) => setFormData({ ...formData, password: text })}
                  secureTextEntry
                />
              )}
              <Input
                label="Email"
                placeholder="Enter email"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                keyboardType="email-address"
              />
              <Input
                label="Phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                keyboardType="phone-pad"
              />
              
              <View style={styles.roleSelector}>
                <Text style={styles.roleLabel}>Role</Text>
                <View style={styles.roleButtons}>
                  {['admin', 'staff'].map((role) => (
                    <TouchableOpacity
                      key={role}
                      style={[
                        styles.roleButton,
                        formData.role === role && styles.roleButtonActive,
                      ]}
                      onPress={() => setFormData({ ...formData, role })}
                    >
                      <Text
                        style={[
                          styles.roleButtonText,
                          formData.role === role && styles.roleButtonTextActive,
                        ]}
                      >
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.modalActions}>
                <Button title="Cancel" onPress={() => setModalVisible(false)} variant="secondary" />
                <Button title={editingUser ? 'Update' : 'Create'} onPress={handleSubmit} />
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={passwordModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change Password</Text>
              <TouchableOpacity onPress={() => setPasswordModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              <Input
                label="New Password"
                placeholder="Enter new password"
                value={newPassword}
                onChangeText={(text) => setNewPassword(text)}
                secureTextEntry
              />

              <View style={styles.modalActions}>
                <Button title="Cancel" onPress={() => setPasswordModalVisible(false)} variant="secondary" />
                <Button title="Update" onPress={handleChangePassword} />
              </View>
            </View>
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
  listContent: {
    padding: 16,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 2,
  },
  username: {
    fontSize: 14,
    color: '#64748b',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#dcfce7',
  },
  statusBadgeInactive: {
    backgroundColor: '#fee2e2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16a34a',
  },
  userDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 8,
  },
  userActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#64748b',
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
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  form: {
    padding: 20,
  },
  roleSelector: {
    marginBottom: 16,
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  roleButtonActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  roleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
  roleButtonTextActive: {
    color: '#FFFFFF',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
});

export default Users;
