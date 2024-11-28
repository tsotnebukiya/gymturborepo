import { Stack } from 'expo-router';

export default function GenerationLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="[exercise]/index" />
    </Stack>
  );
}
