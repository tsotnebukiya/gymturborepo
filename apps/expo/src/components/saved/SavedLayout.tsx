import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { api } from '~/utils/api';
import ExerciseItem from '../exercises/ExerciseItem';
import { useState } from 'react';
import { IconButton, Text, TextInput } from 'react-native-paper';
import { keepPreviousData } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { router } from 'expo-router';
import ExerciseListSkeleton from '../exercises/ExerciseSkeletonList';
import { useAppContext } from '../context/AppContext';

export default function SavedLayout() {
  const [searchInput, setSearchInput] = useState<string | undefined>(undefined);
  const [debouncedSearch] = useDebounce(searchInput, 1000);
  const { subcategory, setSubcategory } = useAppContext();
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
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      placeholderData: keepPreviousData,
    }
  );

  const exercises = data?.pages.flatMap((page) => page.exercises) || [];
  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  };

  const handleFilter = () => {
    router.push({
      pathname: '/(auth)/category',
      params: { type: 'bookmarks' },
    });
  };
  const clearFilters = () => {
    setSearchInput('');
    setSubcategory(undefined);
  };
  console.log(subcategory);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TextInput
          label="Exercise Name"
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
          {(searchInput || subcategory) && (
            <IconButton
              icon="close"
              mode="contained"
              style={styles.filterIcon}
              onPress={clearFilters}
            />
          )}
          <IconButton
            icon={subcategory ? 'filter' : 'filter-plus-outline'}
            mode="contained"
            style={styles.filterIcon}
            onPress={handleFilter}
          />
        </View>
      </View>
      <FlatList
        style={styles.listContainer}
        contentContainerStyle={[styles.contentContainer]}
        data={exercises}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ExerciseItem data={item} exercisePath={true} />
        )}
        keyExtractor={(item, index) => String(index)}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={() => (
          <>
            {isLoading ? (
              <ExerciseListSkeleton />
            ) : (
              <Text style={styles.emptyText}>No exercises found</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,
    gap: 16,
  },
  filterContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  searchOutline: {
    borderRadius: 100,
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
  },
  contentContainer: {
    gap: 16,
  },
  iconContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.6,
  },
});
