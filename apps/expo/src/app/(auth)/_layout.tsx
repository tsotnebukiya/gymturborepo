import { Stack } from 'expo-router';
import { AppContextProvider } from '~/lib/contexts/AppContext';

export default function AuthLayout() {
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
      </Stack>
    </AppContextProvider>
  );
}
