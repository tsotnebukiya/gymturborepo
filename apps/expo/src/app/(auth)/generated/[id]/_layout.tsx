import { Stack } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { api } from '~/utils/api';
import ImageLayout from '~/components/generation/ImageLayout';
import { useCurrentLanguageEnum } from '~/i18n';
import { keepPreviousData } from '@tanstack/react-query';

export default function GenerationLayout() {
  const { id } = useLocalSearchParams();
  const language = useCurrentLanguageEnum();
  const { data } = api.generation.getOne.useQuery(
    {
      id: Number(id),
      language,
    },
    {
      placeholderData: keepPreviousData,
    }
  );
  return (
    <ImageLayout image={data?.image}>
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
