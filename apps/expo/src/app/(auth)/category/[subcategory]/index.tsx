import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { api } from '~/lib/utils/api';
import ExerciseItem from '~/components/exercises/Item';
import { useState } from 'react';
import { Text, TextInput } from 'react-native-paper';
import { keepPreviousData } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { router, useLocalSearchParams } from 'expo-router';
import ExerciseListSkeleton from '~/components/exercises/SkeletonList';
import { type Subcategory } from '@prisma/client';
import { useCurrentLanguage } from '~/i18n';
import { useTranslation } from 'react-i18next';
import Gradient from '~/components/ui/Gradient';
import TopBar from '~/components/shared/TopBar';

export default function MuscleExercisesScreen() {
  const { t } = useTranslation();
  const { subcategory } = useLocalSearchParams<{ subcategory: Subcategory }>();
  const { language } = useCurrentLanguage();
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

  const clearInput = () => {
    setSearchInput('');
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <Gradient />
      <View style={styles.outerContainer}>
        <TopBar
          inset={false}
          backAction={{
            icon: 'arrow-left',
            onPress: () => router.back(),
          }}
        >
          <View style={styles.inputContainer}>
            <TextInput
              dense={true}
              value={searchInput}
              autoFocus={false}
              mode="outlined"
              placeholder={t('exercises.exerciseName')}
              keyboardType="default"
              showSoftInputOnFocus={true}
              style={styles.searchInput}
              right={
                searchInput ? (
                  <TextInput.Icon icon="close" onPress={clearInput} />
                ) : undefined
              }
              outlineStyle={styles.searchOutline}
              onChangeText={setSearchInput}
            />
          </View>
        </TopBar>
        <FlatList
          style={styles.listContainer}
          contentContainerStyle={[styles.contentContainer]}
          data={exercises}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <ExerciseItem data={item} replace />}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 12,
  },
  outerContainer: {
    flex: 1,
  },
  inputContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  searchOutline: {
    borderRadius: 10,
  },
  searchInput: {
    alignSelf: 'stretch',
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
  listContainer: {},
  contentContainer: {
    gap: 20,
    paddingVertical: 24,
    paddingHorizontal: 12,
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.6,
  },
});
