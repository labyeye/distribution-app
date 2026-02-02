import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { AuthService } from '@/src/services/auth';

export default function Index() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const isAuthenticated = await AuthService.isAuthenticated();
      const user = await AuthService.getUser();
      
      if (isAuthenticated && user) {
        // After login, go to the main tab navigator which hosts the app screens
        // Cast to any because generated route types don't include '/main'
        router.replace('/main' as any);
      } else {
        router.replace('/login');
      }
    } catch (error) {
      router.replace('/login');
    } finally {
      setChecking(false);
    }
  };

  if (checking) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
});
