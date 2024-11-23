import { View } from 'react-native';
import { Text } from 'react-native-paper';
import GradientLayout from '~/components/common/GradientLayout';
import ScrollView from '~/components/common/ScrollView';
import LatestGenerations from '~/components/homepage/LatestGenerations';
import { api } from '~/utils/api';

export default function HomeScreen() {
  // const { data, isLoading, refetch } = api.generation.getAll.useQuery();
  // api.exercise.getAll.usePrefetchInfiniteQuery(
  //   {
  //     searchName: undefined,
  //     subcategory: undefined,
  //   },
  //   {}
  // );
  // api.split.getAll.usePrefetchInfiniteQuery({}, {});
  // const handleRefresh = async () => {
  //   await refetch();
  // };
  return (
    <GradientLayout>
      <View>
        <Text>Home</Text>
      </View>
      {/* <ScrollView onRefresh={handleRefresh}>
        <LatestGenerations data={data} loading={isLoading} />
      </ScrollView> */}
    </GradientLayout>
  );
}
