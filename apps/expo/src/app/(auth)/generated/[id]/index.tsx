import { router, useLocalSearchParams } from 'expo-router';
import { api } from '~/utils/api';
import Generation from '~/components/Generation/Generation';

export default function GeneratedItemScreen() {
  const { id } = useLocalSearchParams();
  const { data } = api.generation.getOne.useQuery({
    id: Number(id),
  });
  const handleBack = () => {
    router.back();
  };
  if (!data) return null;

  return <Generation data={data} handleBack={handleBack} />;
}
