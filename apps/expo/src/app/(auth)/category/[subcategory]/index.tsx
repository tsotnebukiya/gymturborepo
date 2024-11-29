import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { api } from '~/lib/utils/api';
import ExerciseItem from '~/components/exercises/Item';
import { useState } from 'react';
import { IconButton, Text, TextInput } from 'react-native-paper';
import { keepPreviousData } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { router, useLocalSearchParams } from 'expo-router';
import ExerciseListSkeleton from '~/components/exercises/SkeletonList';
import { type Subcategory } from '@prisma/client';
import { useCurrentLanguageEnum } from '~/i18n';
import GradientLayout from '~/components/shared/GradientLayout';
import { useTranslation } from 'react-i18next';

export default function MuscleExercisesScreen() {
  const { t } = useTranslation();
  const { subcategory } = useLocalSearchParams<{ subcategory: Subcategory }>();
  const language = useCurrentLanguageEnum();
  const [searchInput, setSearchInput] = useState<string | undefined>(undefined);
  const [debouncedSearch] = useDebounce(searchInput, 1000);
  const [refreshing, setRefreshing] = useState(false);
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = api.exercise.getAll.useInfiniteQuery(
    {
      searchName: debouncedSearch,
      subcategory,
      language,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      placeholderData: keepPreviousData,
    }
  );

  const exercises = data?.pages.flatMap((page) => page.result) || [];
  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  };

  const clearFilters = () => {
    setSearchInput('');
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <GradientLayout>
      <View style={styles.container}>
        <View style={styles.filterContainer}>
          <IconButton
            icon={'arrow-left'}
            mode="contained"
            onPress={() => router.back()}
          />

          <TextInput
            label={t('exercises.exerciseName')}
            value={searchInput}
            autoFocus={false}
            mode="outlined"
            keyboardType="default"
            showSoftInputOnFocus={true}
            style={styles.searchInput}
            outlineStyle={styles.searchOutline}
            onChangeText={setSearchInput}
          />
          <View style={styles.iconContainer}>
            {searchInput && (
              <IconButton
                icon="close"
                mode="contained"
                style={styles.filterIcon}
                onPress={clearFilters}
              />
            )}
          </View>
        </View>
        <FlatList
          style={styles.listContainer}
          contentContainerStyle={[styles.contentContainer]}
          data={exercises}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <ExerciseItem data={item} />}
          keyExtractor={(item, index) => String(index)}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={() => (
            <>
              {isLoading ? (
                <ExerciseListSkeleton />
              ) : searchInput ? (
                <Text style={styles.emptyText}>No exercises found</Text>
              ) : (
                <Text>No exercises</Text>
              )}
            </>
          )}
          ListFooterComponent={() => (
            <>{isFetchingNextPage && <ExerciseListSkeleton />}</>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      </View>
    </GradientLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,
    // gap: 16,
  },
  filterContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 16,
  },
  searchOutline: {
    borderRadius: 16,
  },
  searchInput: {
    flex: 1,
  },
  modal: {
    height: '100%',
  },
  modalContainer: {
    height: '100%',
  },
  filterIcon: {
    borderWidth: 0,
  },
  tabsContainer: {
    paddingHorizontal: 16,
  },
  listContainer: {
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  contentContainer: {
    gap: 16,
  },
  iconContainer: {
    flexDirection: 'row',
    gap: 8,
    height: 'auto',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.6,
  },
});
