import { useAuth } from '@clerk/clerk-expo';
import { Redirect, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StatusBar, View, ActivityIndicator } from 'react-native';
import Purchases from 'react-native-purchases';

import { AppContextProvider } from '~/lib/contexts/AppContext';
import Paywall from '~/components/Paywall';

export default function AuthLayout() {
  const { isSignedIn } = useAuth();
  const [isPresentingPaywall, setIsPresentingPaywall] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    setIsPresentingPaywall(true);
    const checkAccessAndShowPaywall = async () => {
      try {
        const customerInfo = await Purchases.getCustomerInfo();
        const hasProAccess = customerInfo.entitlements.active.pro !== undefined;

        if (!hasProAccess) {
          await Purchases.getOfferings();
          setShowPaywall(true);
        } else {
          setShowPaywall(false);
        }
      } catch (error) {
        console.error('[DEBUG-AUTH] Error checking access:', error);
        setShowPaywall(true);
      } finally {
        setIsPresentingPaywall(false);
      }
    };

    void checkAccessAndShowPaywall();
  }, [isSignedIn]);

  console.log(
    `[DEBUG-AUTH] AuthLayout render - isSignedIn=${isSignedIn}, showPaywall=${showPaywall}, isPresentingPaywall=${isPresentingPaywall}`
  );

  if (!isSignedIn) {
    console.log('[DEBUG-AUTH] Not signed in, redirecting to sign-in');
    return <Redirect href="/sign-in" />;
  }

  if (showPaywall) {
    console.log('[DEBUG-AUTH] Showing paywall');
    return <Paywall />;
  }

  console.log('[DEBUG-AUTH] Showing main app content');
  return (
    <AppContextProvider>
      {isPresentingPaywall ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <>
          <StatusBar backgroundColor={'white'} />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(dashboard)" />
            <Stack.Screen
              name="generated/[id]"
              options={{ presentation: 'modal' }}
            />
            <Stack.Screen name="category" options={{ presentation: 'modal' }} />
            <Stack.Screen
              name="exercise/[id]/index"
              options={{ presentation: 'modal' }}
            />
            <Stack.Screen
              name="support"
              options={{
                presentation: 'modal',
              }}
            />
          </Stack>
        </>
      )}
    </AppContextProvider>
  );
}
