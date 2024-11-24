import ExerciseView from '~/components/exercises/ExerciseScreen';
import { useLocalSearchParams } from 'expo-router';
import { api } from '~/utils/api';
import { useCurrentLanguageEnum } from '~/i18n';
import { keepPreviousData } from '@tanstack/react-query';

export default function ExerciseScreen() {
  const language = useCurrentLanguageEnum();
  const { exercise } = useLocalSearchParams();
  const { data, isLoading } = api.exercise.getOne.useQuery(
    {
      id: Number(exercise),
      language,
    },
    {
      placeholderData: keepPreviousData,
    }
  );
  if (!data && !isLoading) {
    return null;
  }
  return <ExerciseView data={data} />;
}
