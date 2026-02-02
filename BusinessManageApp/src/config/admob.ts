import { Platform } from 'react-native';
import { TestIds } from 'react-native-google-mobile-ads';

// AdMob Configuration
export const ADMOB_CONFIG = {
  // Banner Ad Unit IDs
  bannerAdUnitId: Platform.select({
    // Replace with your actual Ad Unit IDs in production
    ios: __DEV__ ? TestIds.BANNER : 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
    android: __DEV__ ? TestIds.BANNER : 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
  }) || TestIds.BANNER,
  
  // App Open Ad Unit IDs (if needed in future)
  appOpenAdUnitId: Platform.select({
    ios: __DEV__ ? TestIds.APP_OPEN : 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
    android: __DEV__ ? TestIds.APP_OPEN : 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
  }) || TestIds.APP_OPEN,

  // Interstitial Ad Unit IDs (if needed in future)
  interstitialAdUnitId: Platform.select({
    ios: __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
    android: __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
  }) || TestIds.INTERSTITIAL,

  // Rewarded Ad Unit IDs (if needed in future)
  rewardedAdUnitId: Platform.select({
    ios: __DEV__ ? TestIds.REWARDED : 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
    android: __DEV__ ? TestIds.REWARDED : 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
  }) || TestIds.REWARDED,
};

// Request Configuration
export const AD_REQUEST_CONFIG = {
  requestNonPersonalizedAdsOnly: false,
  keywords: ['business', 'management', 'inventory', 'billing', 'retail'],
};
