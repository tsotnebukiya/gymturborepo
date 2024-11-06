import { Stack } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { api } from '~/utils/api';
import { GenerationContext } from '~/components/GenerationContext';
import Generation from '~/components/Generation/Generation';

export default function GenerationLayout() {
  const { id } = useLocalSearchParams();
  const { data } = api.generation.getOne.useQuery({
    id: Number(id),
  });

  if (!data) return null;

  return (
    <GenerationContext.Provider value={{ generationData: data }}>
      <Generation data={data}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="[subcategory]/subcategory" />
          <Stack.Screen name="[subcategory]/[exerciseId]/exercise" />
        </Stack>
      </Generation>
    </GenerationContext.Provider>
  );
}
