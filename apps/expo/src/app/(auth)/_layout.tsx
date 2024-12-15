import { useAuth } from '@clerk/clerk-expo';
import { Redirect, Stack } from 'expo-router';
import { AppContextProvider } from '~/lib/contexts/AppContext';

export default function AuthLayout() {
  const { isSignedIn } = useAuth();
  if (!isSignedIn) {
    return <Redirect href="/sign-in" />;
  }
  return (
    <AppContextProvider>
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
        <Stack.Screen name="support" options={{ presentation: 'modal' }} />
      </Stack>
    </AppContextProvider>
  );
}
