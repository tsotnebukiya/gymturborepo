import ExerciseView from '~/components/ExerciseView';
import { useLocalSearchParams } from 'expo-router';
import { api } from '~/lib/utils/api';
import { useCurrentLanguage } from '~/i18n';
import { keepPreviousData } from '@tanstack/react-query';

export default function ExerciseScreen() {
  const { language } = useCurrentLanguage();
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
