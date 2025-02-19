import { keepPreviousData } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import ExerciseView from '~/components/ExerciseView';
import { useCurrentLanguage } from '~/i18n';
import { api } from '~/lib/utils/api';

export default function ExerciseScreen() {
  const { language } = useCurrentLanguage();
  const { id } = useLocalSearchParams();
  const { data } = api.exercise.getOne.useQuery(
    {
      id: Number(id),
      language,
    },
    {
      placeholderData: keepPreviousData,
    }
  );
  return <ExerciseView data={data} />;
}
