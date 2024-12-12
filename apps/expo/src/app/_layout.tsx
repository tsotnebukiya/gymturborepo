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
  const { isLoaded } = useAuth();
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded && isLoaded) {
      void SplashScreen.hideAsync();
    }
  }, [loaded, isLoaded]);

  return <Slot />;
}

export default function RootLayoutNav() {
  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <TRPCProvider>
        <PaperProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
              <InitialLayout />
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </PaperProvider>
      </TRPCProvider>
    </ClerkProvider>
  );
}
