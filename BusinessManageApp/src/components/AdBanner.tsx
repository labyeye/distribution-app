import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { ADMOB_CONFIG } from '../config/admob';

interface AdBannerProps {
  size?: BannerAdSize;
}

const AdBanner: React.FC<AdBannerProps> = ({ size = BannerAdSize.BANNER }) => {
  const adUnitId = ADMOB_CONFIG.bannerAdUnitId;

  return (
    <View style={styles.container}>
      <BannerAd
        unitId={adUnitId}
        size={size}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
          keywords: ['business', 'management', 'inventory', 'billing'],
        }}
        onAdLoaded={() => {
          console.log('Banner ad loaded');
        }}
        onAdFailedToLoad={(error) => {
          console.error('Banner ad failed to load:', error);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 5,
  },
});

export default AdBanner;
