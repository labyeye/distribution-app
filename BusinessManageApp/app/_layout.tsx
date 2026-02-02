import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import React, { useEffect } from 'react';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="main" />
        <Stack.Screen name="bill-add" />
        <Stack.Screen name="bill-assigned-today" />
        <Stack.Screen name="bills-history" />
        <Stack.Screen name="dsr-collection-summary" />
        <Stack.Screen name="retailer-add" />
        <Stack.Screen name="product-add" />
        <Stack.Screen name="order-create" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

