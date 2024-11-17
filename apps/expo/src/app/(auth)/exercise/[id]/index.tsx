import { useLocalSearchParams } from 'expo-router';
import FullExerciseView from '~/components/exercises/ScreenWrapper';
import { api } from '~/utils/api';

export default function ExerciseView() {
  const { id } = useLocalSearchParams();
  const { data } = api.exercise.getOne.useQuery({ id: Number(id) });
  return <FullExerciseView data={data} />;
}
