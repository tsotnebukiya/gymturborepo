import { keepPreviousData } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import FullExerciseView from '~/components/exercises/ScreenWrapper';
import { useCurrentLanguageEnum } from '~/i18n';
import { api } from '~/utils/api';

export default function ExerciseView() {
  const language = useCurrentLanguageEnum();
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
  console.log(id);
  return <FullExerciseView data={data} />;
}
