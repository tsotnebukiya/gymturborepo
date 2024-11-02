import Homepage from '~/components/Homepage/Homepage';
import { api } from '~/utils/api';

export default function HomeScreen() {
  const { data, isLoading } = api.generation.getAll.useQuery();
  return <Homepage data={data} loading={isLoading} />;
}
