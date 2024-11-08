import ExerciseView from '~/components/exercises/ExerciseScreen';
import { useLocalSearchParams } from 'expo-router';
import { api } from '~/utils/api';
import ExerciseSkeleton from '~/components/exercises/ExerciseSkeleton';

export default function ExerciseScreen() {
  const { exercise } = useLocalSearchParams();
  const { data, isLoading } = api.exercise.getOne.useQuery({
    id: Number(exercise),
  });
  if (!data && !isLoading) {
    return null;
  }
  return !data ? <ExerciseSkeleton /> : <ExerciseView data={data} />;
}
