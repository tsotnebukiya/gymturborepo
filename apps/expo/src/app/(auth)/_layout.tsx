import { useAuth } from '@clerk/clerk-expo';
import { Redirect, Stack, useRouter } from 'expo-router';
import { StatusBar } from 'react-native';
import Purchases from 'react-native-purchases';
import { PAYWALL_RESULT } from 'react-native-purchases-ui';
import RevenueCatUI from 'react-native-purchases-ui';

import { AppContextProvider } from '~/lib/contexts/AppContext';

export default function AuthLayout() {
  const { isSignedIn, signOut } = useAuth();

  const router = useRouter();
  if (!isSignedIn) {
    return <Redirect href="/sign-in" />;
  }

  const presentPaywall = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      const paywallResult = await RevenueCatUI.presentPaywallIfNeeded({
        requiredEntitlementIdentifier: 'pro',
        offering: offerings.current!,
      });
      switch (paywallResult) {
        case PAYWALL_RESULT.ERROR:
        case PAYWALL_RESULT.CANCELLED:
          await signOut();
          router.replace('/sign-in');
          return;
        case PAYWALL_RESULT.NOT_PRESENTED:
        case PAYWALL_RESULT.PURCHASED:
        case PAYWALL_RESULT.RESTORED:
          break;
      }
    } catch (error) {
      console.error('Error presenting paywall:', error);
    }
  };
  void presentPaywall();

  return (
    <AppContextProvider>
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
    </AppContextProvider>
  );
}
