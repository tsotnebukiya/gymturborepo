import { CLERK_PUBLISHABLE_KEY, tokenCache } from '~/lib/utils/auth';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import {
  useFonts,
  Urbanist_400Regular,
  Urbanist_500Medium,
  Urbanist_600SemiBold,
  Urbanist_700Bold,
} from '@expo-google-fonts/urbanist';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { TRPCProvider } from '~/lib/utils/api';
import '~/i18n';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import theme from '~/lib/utils/theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Purchases from 'react-native-purchases';
import { Platform } from 'react-native';

const apiKey =
  Platform.OS === 'ios'
    ? process.env.EXPO_PUBLIC_REVENUE_APPLE_API_KEY!
    : process.env.EXPO_PUBLIC_REVENUE_ANDROID_API_KEY!;

if (!apiKey) {
  throw new Error('RevenueCat API key is not set');
}

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

void SplashScreen.preventAutoHideAsync();

function InitialLayout() {
  const [loaded, error] = useFonts({
    Urbanist_400Regular,
    Urbanist_500Medium,
    Urbanist_600SemiBold,
    Urbanist_700Bold,
  });
  const { isLoaded, userId } = useAuth();

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded && isLoaded) {
      void SplashScreen.hideAsync();
      void Purchases.setLogLevel(Purchases.LOG_LEVEL.VERBOSE);
      Purchases.configure({ apiKey, appUserID: userId });
    }
  }, [loaded, isLoaded, userId]);

  return <Slot />;
}

export default function RootLayoutNav() {
  return (
    <SafeAreaProvider>
      <ClerkProvider
        publishableKey={CLERK_PUBLISHABLE_KEY!}
        tokenCache={tokenCache}
      >
        <TRPCProvider>
          <PaperProvider theme={theme}>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <BottomSheetModalProvider>
                <InitialLayout />
              </BottomSheetModalProvider>
            </GestureHandlerRootView>
          </PaperProvider>
        </TRPCProvider>
      </ClerkProvider>
    </SafeAreaProvider>
  );
}
