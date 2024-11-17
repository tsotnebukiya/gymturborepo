import { Stack } from 'expo-router';

export default function SplitLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="new" />
      <Stack.Screen name="exercises" />
      <Stack.Screen name="[splitId]/index" />
    </Stack>
  );
}
