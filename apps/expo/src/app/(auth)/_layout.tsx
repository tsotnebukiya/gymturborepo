import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(dashboard)" />
      <Stack.Screen name="generated/[id]" options={{ presentation: 'modal' }} />
      <Stack.Screen
        name="exercise/[id]/index"
        options={{ presentation: 'modal' }}
      />
    </Stack>
  );
}
