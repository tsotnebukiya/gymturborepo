import GradientLayout from '~/components/common/GradientLayout';
import ScrollView from '~/components/common/ScrollView';
import LatestGenerations from '~/components/homepage/LatestGenerations';
import { api } from '~/utils/api';

export default function HomeScreen() {
  const { data, isLoading, refetch } = api.generation.getAll.useQuery();
  api.exercise.getAll.usePrefetchQuery({
    searchName: undefined,
    subcategory: undefined,
  });
  const handleRefresh = async () => {
    await refetch();
  };
  return (
    <GradientLayout>
      <ScrollView onRefresh={handleRefresh}>
        <LatestGenerations data={data} loading={isLoading} />
      </ScrollView>
    </GradientLayout>
  );
}
