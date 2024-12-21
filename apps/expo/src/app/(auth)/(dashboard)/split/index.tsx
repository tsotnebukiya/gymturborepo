import { StyleSheet, FlatList, RefreshControl } from 'react-native';
import GradientLayout from '~/components/shared/GradientLayout';
import TopBar from '~/components/shared/TopBar';
import SplitItem from '~/components/splits/Item';
import CTABox from '~/components/shared/CTABox';
import { router } from 'expo-router';
import { api } from '~/lib/utils/api';
import { keepPreviousData } from '@tanstack/react-query';
import { useState } from 'react';
import SplitSkeleton from '~/components/splits/Skeleton';
import { useCurrentLanguage } from '~/i18n';
import { useTranslation } from 'react-i18next';

export default function SplitsHomeScreen() {
  const { language } = useCurrentLanguage();
  const { t } = useTranslation();
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = api.split.getAll.useInfiniteQuery(
    {
      language,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      placeholderData: keepPreviousData,
    }
  );
  const [refreshing, setRefreshing] = useState(false);
  const splits = data?.pages.flatMap((page) => page.splits) || [];
  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  };
  const handleCreateNew = () => {
    router.push('/(auth)/(dashboard)/split/new');
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  return (
    <GradientLayout>
      <TopBar
        title={t('splits.title')}
        inset={false}
        barBorder={true}
        logo={true}
        actions={[
          {
            icon: 'plus',
            onPress: handleCreateNew,
            mode: 'contained',
          },
        ]}
      />

      <FlatList
        data={splits}
        renderItem={({ item }) => <SplitItem item={item} />}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={() => (
          <>
            {isLoading ? (
              <SplitSkeleton />
            ) : (
              <CTABox
                buttonText={t('splits.createSplit')}
                description={t('splits.createDescription')}
                title={t('splits.noSplits')}
                onPress={handleCreateNew}
              />
            )}
          </>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListFooterComponent={() => (
          <>{isFetchingNextPage && <SplitSkeleton />}</>
        )}
      />
    </GradientLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingTop: 24,
    paddingBottom: 111,
    gap: 24,
  },
});
