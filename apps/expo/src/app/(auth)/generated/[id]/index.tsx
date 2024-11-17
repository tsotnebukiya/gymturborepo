import { useLocalSearchParams } from 'expo-router';
import ExerciseList from '~/components/exercises/List';
import { api } from '~/utils/api';

export default function GeneratedItemScreen() {
  const { id } = useLocalSearchParams();
  const { data, isLoading } = api.generation.getOne.useQuery({
    id: Number(id),
  });
  return (
    <ExerciseList
      itemType="generation"
      data={data?.exercise}
      name={data?.name || undefined}
      loading={isLoading}
    />
  );
}
