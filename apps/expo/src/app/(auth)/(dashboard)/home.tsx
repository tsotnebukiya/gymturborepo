import { keepPreviousData } from '@tanstack/react-query';
import GradientLayout from '~/components/shared/GradientLayout';
import ScrollView from '~/components/shared/ScrollView';
import { useCurrentLanguageEnum } from '~/i18n';
import { api } from '~/lib/utils/api';
import { StyleSheet, View } from 'react-native';
import GenerationItem from '~/components/homepage/Item';
import { Text } from 'react-native-paper';
import CTABox from '~/components/shared/CTABox';
import { useAppContext } from '~/lib/contexts/AppContext';
import GenerationSkeleton from '~/components/homepage/Skeleton';

export default function HomeScreen() {
  const language = useCurrentLanguageEnum();
  const { setWizardVisible } = useAppContext();
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
  const handleCTA = () => setWizardVisible(true);
  return (
    <GradientLayout>
      <ScrollView onRefresh={handleRefresh}>
        <View style={styles.container}>
          <Text variant="titleLarge">Latest Generations</Text>
          <View style={styles.generationsContainer}>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <GenerationSkeleton key={index} />
              ))
            ) : data?.length ? (
              data.map((generation) => (
                <GenerationItem key={generation.id} data={generation} />
              ))
            ) : (
              <CTABox
                title="No generations yet"
                description="Create your first AI generation and start exploring the possibilities!"
                buttonText="Create First Generation"
                onPress={handleCTA}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </GradientLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 32,
  },
  generationsContainer: {
    gap: 16,
  },
});
