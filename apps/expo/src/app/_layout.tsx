import { CLERK_PUBLISHABLE_KEY, tokenCache } from '~/utils/auth';
import theme from '~/utils/theme';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack, usePathname, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ActivityIndicator, PaperProvider } from 'react-native-paper';
import { TRPCProvider } from '~/utils/api';
import { View } from 'react-native';

void SplashScreen.preventAutoHideAsync();

function InitialLayout() {
  const pathname = usePathname();
  const [loaded, error] = useFonts({
    SpaceMono: require('~/assets/fonts/SpaceMono-Regular.ttf'),
  });
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      void SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (!isLoaded) return;
    const inAuthGroup = segments[0] === '(auth)';
    if (isSignedIn && !inAuthGroup) {
      router.navigate('/home');
    } else if (!isSignedIn && pathname !== '/') {
      router.navigate('/');
    }
  }, [isSignedIn]);

  if (!isLoaded)
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size={'large'} />
      </View>
    );

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="+not-found" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="index" />
      <Stack.Screen name="sign-in" />
    </Stack>
  );
}

export default function RootLayoutNav() {
  const queryClient = new QueryClient();
  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <QueryClientProvider client={queryClient}>
        <TRPCProvider>
          <PaperProvider theme={theme}>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <InitialLayout />
            </GestureHandlerRootView>
          </PaperProvider>
        </TRPCProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
