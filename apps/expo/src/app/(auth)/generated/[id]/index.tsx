import { useLocalSearchParams } from 'expo-router';
import ExerciseList from '~/components/generation/ExerciseList';
import { api } from '~/utils/api';

export default function GeneratedItemScreen() {
  const { id } = useLocalSearchParams();
  const { data } = api.generation.getOne.useQuery({
    id: Number(id),
  });
  return <ExerciseList data={data} />;
}
