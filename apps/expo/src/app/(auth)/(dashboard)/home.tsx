import { keepPreviousData } from '@tanstack/react-query';
import { Button } from 'react-native-paper';
import GradientLayout from '~/components/common/GradientLayout';
import ScrollView from '~/components/common/ScrollView';
import LatestGenerations from '~/components/homepage/LatestGenerations';
import { useCurrentLanguageEnum } from '~/i18n';
import { api } from '~/utils/api';

export default function HomeScreen() {
  const language = useCurrentLanguageEnum();
  const { data, isLoading, refetch } = api.generation.getAll.useQuery(
    {
      language,
    },
    {
      placeholderData: keepPreviousData,
    }
  );
  api.bookmark.getAll.usePrefetchInfiniteQuery(
    {
      searchName: undefined,
      subcategory: undefined,
      language,
    },
    {}
  );
  api.split.getAll.usePrefetchInfiniteQuery({ language }, {});
  const handleRefresh = async () => {
    await refetch();
  };
  return (
    <GradientLayout>
      <ScrollView onRefresh={handleRefresh}>
        <Button onPress={() => refetch()}>Refetch</Button>
        <LatestGenerations data={data} loading={isLoading} />
      </ScrollView>
    </GradientLayout>
  );
}
