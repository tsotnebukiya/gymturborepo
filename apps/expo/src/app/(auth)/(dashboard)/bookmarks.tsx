import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { api } from '~/lib/utils/api';
import ExerciseItem from '~/components/exercises/Item';
import { useState } from 'react';
import { Text, TextInput } from 'react-native-paper';
import { keepPreviousData } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { router } from 'expo-router';
import ExerciseListSkeleton from '~/components/exercises/SkeletonList';
import { useAppContext } from '~/lib/contexts/AppContext';
import { useCurrentLanguage } from '~/i18n';
import GradientLayout from '~/components/shared/GradientLayout';
import { useTranslation } from 'react-i18next';
import TopBar from '~/components/shared/TopBar';

export default function SavedExercisesScreen() {
  const { language } = useCurrentLanguage();
  const { t } = useTranslation();
  const { setSubcategory, subcategory } = useAppContext();
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
  } = api.bookmark.getAll.useInfiniteQuery(
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

  const handleFilter = () => {
    if (subcategory) {
      setSubcategory(undefined);
    } else {
      router.push({
        pathname: '/(auth)/category',
        params: { type: 'saved' },
      });
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
    <GradientLayout>
      <View style={styles.container}>
        <TopBar
          inset={false}
          actions={[
            {
              icon: subcategory ? 'filter-remove' : 'filter-plus-outline',
              mode: 'outlined',
              onPress: handleFilter,
            },
          ]}
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
          renderItem={({ item }) => <ExerciseItem data={item} />}
          keyExtractor={(item, index) => String(index)}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={() => (
            <>
              {isLoading ? (
                <ExerciseListSkeleton />
              ) : searchInput || subcategory ? (
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
  },
  filterContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 16,
  },
  inputContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
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
  listContainer: {
    width: '100%',
    paddingTop: 24,
    paddingHorizontal: 12,
  },
  contentContainer: {
    gap: 20,
    paddingBottom: 111,
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
