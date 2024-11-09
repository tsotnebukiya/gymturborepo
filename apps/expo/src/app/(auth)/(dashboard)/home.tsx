import Homepage from '~/components/homepage/Homepage';
import { api } from '~/utils/api';

export default function HomeScreen() {
  const { data, isLoading } = api.generation.getAll.useQuery();
  api.exercise.getAll.usePrefetchQuery({
    searchName: undefined,
    subcategory: undefined,
  });
  return <Homepage data={data} loading={isLoading} />;
}
