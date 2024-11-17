import { useLocalSearchParams } from 'expo-router';
import SplitIndividual from '~/components/splits/SplitIndividual';
import SplitIndividualSkeleton from '~/components/splits/SplitIndividualSkeleton';
import { api } from '~/utils/api';

export default function SplitScreen() {
  const { splitId } = useLocalSearchParams();
  const { data: split, isLoading } = api.split.getOne.useQuery({
    id: Number(splitId),
  });
  if (isLoading) return <SplitIndividualSkeleton />;
  if (!split) return null;
  return <SplitIndividual split={split} />;
}
