import { useAuth } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import React, { useRef } from 'react';
import { Alert, View } from 'react-native';

import RevenueCatUI from 'react-native-purchases-ui';

export default function Paywall() {
  const { signOut } = useAuth();
  const purchaseJustCompleted = useRef(false);

  return (
    <View style={{ flex: 1 }}>
      <RevenueCatUI.Paywall
        onPurchaseCompleted={() => {
          purchaseJustCompleted.current = true;
          router.replace('/(auth)/(dashboard)/home');
        }}
        onDismiss={async () => {
          if (!purchaseJustCompleted.current) {
            await signOut();
            router.replace('/sign-in');
          } else {
            purchaseJustCompleted.current = false;
          }
          return;
        }}
        onRestoreCompleted={() => {
          purchaseJustCompleted.current = true;
          Alert.alert('Restore completed');
          router.replace('/(auth)/(dashboard)/home');
        }}
        onRestoreError={() => {
          Alert.alert(
            'Restore Failed',
            "We couldn't restore your purchases. Please check your internet connection and ensure you're signed in with the correct App Store account.",
            [{ text: 'OK' }]
          );
        }}
      />
    </View>
  );
}
