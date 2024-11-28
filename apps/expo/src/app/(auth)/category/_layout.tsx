import { Stack } from 'expo-router';
import { CategoryProvider } from '~/lib/contexts/CategoryContext';

export default function GenerationLayout() {
  return (
    <CategoryProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="[subcategory]/index" />
      </Stack>
    </CategoryProvider>
  );
}
