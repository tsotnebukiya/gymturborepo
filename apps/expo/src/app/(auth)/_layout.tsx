import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(dashboard)" />
      <Stack.Screen name="generated/[id]/index" />
      <Stack.Screen name="camera" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
