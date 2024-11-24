import { keepPreviousData } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import ExerciseList from '~/components/exercises/List';
import { useCurrentLanguageEnum } from '~/i18n';
import { api } from '~/utils/api';

export default function GeneratedItemScreen() {
  const { id } = useLocalSearchParams();
  const language = useCurrentLanguageEnum();
  const { data, isLoading } = api.generation.getOne.useQuery(
    {
      id: Number(id),
      language,
    },
    {
      placeholderData: keepPreviousData,
    }
  );
  return (
    <ExerciseList
      itemType="generation"
      data={data?.exercise}
      name={data?.name || undefined}
      loading={isLoading}
    />
  );
}
