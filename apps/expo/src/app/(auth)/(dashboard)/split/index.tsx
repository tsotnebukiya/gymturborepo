import { StyleSheet, View, FlatList, RefreshControl } from 'react-native';
import GradientLayout from '~/components/shared/GradientLayout';
import TopBar from '~/components/shared/TopBar';
import SplitItem from '~/components/splits/Item';
import CTABox from '~/components/shared/CTABox';
import { router } from 'expo-router';
import { api } from '~/lib/utils/api';
import { keepPreviousData } from '@tanstack/react-query';
import { useState } from 'react';
import SplitSkeleton from '~/components/splits/Skeleton';
import { useCurrentLanguageEnum } from '~/i18n';

export default function SplitsHomeScreen() {
  const language = useCurrentLanguageEnum();
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
      <View style={styles.container}>
        <TopBar
          title="Splits List"
          statusBarHeight={0}
          borderBottomColor="#E0E0E0"
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
                  buttonText="Create Split"
                  description="Create a new split to start training with AI"
                  title="No splits yet"
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
      </View>
    </GradientLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
    gap: 16,
  },
});
