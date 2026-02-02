import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/navigation';

export const AuthService = {
  async saveToken(token: string): Promise<void> {
    await AsyncStorage.setItem('token', token);
  },

  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem('token');
  },

  async saveUser(user: User): Promise<void> {
    await AsyncStorage.setItem('user', JSON.stringify(user));
  },

  async getUser(): Promise<User | null> {
    const userStr = await AsyncStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  },

  async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem('token');
    return !!token;
  },
};
