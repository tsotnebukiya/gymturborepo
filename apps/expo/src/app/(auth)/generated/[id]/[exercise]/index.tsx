import ExerciseView from '~/components/exercises/ExerciseScreen';
import { useLocalSearchParams } from 'expo-router';
import { api } from '~/utils/api';

export default function ExerciseScreen() {
  const { exercise } = useLocalSearchParams();
  const { data, isLoading } = api.exercise.getOne.useQuery({
    id: Number(exercise),
  });
  if (!data && !isLoading) {
    return null;
  }
  return <ExerciseView data={data} />;
}
