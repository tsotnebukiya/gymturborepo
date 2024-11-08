import { Stack } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { api } from '~/utils/api';
import ImageLayout from '~/components/generation/ImageLayout';

export default function GenerationLayout() {
  const { id } = useLocalSearchParams();
  const { data } = api.generation.getOne.useQuery({
    id: Number(id),
  });

  return (
    <ImageLayout data={data}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="[exercise]/index" />
      </Stack>
    </ImageLayout>
  );
}
