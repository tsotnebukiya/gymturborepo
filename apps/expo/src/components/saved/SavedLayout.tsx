import { View, StyleSheet, FlatList } from 'react-native';
import { api } from '~/utils/api';
import ExerciseItem from '../exercises/ExerciseItem';
import { useState } from 'react';
import { IconButton, Modal, Text, TextInput } from 'react-native-paper';
import { type Subcategory } from '@prisma/client';
import { keepPreviousData } from '@tanstack/react-query';
import CategoriesView from './CategoriesView';
import { useDebounce } from 'use-debounce';

export default function SavedLayout() {
  const [searchInput, setSearchInput] = useState<string | undefined>(undefined);
  const [debouncedSearch] = useDebounce(searchInput, 1000);
  const [subcategory, setSubcategory] = useState<Subcategory | undefined>();
  const [visible, setVisible] = useState(false);
  const { data: exercises } = api.exercise.getAll.useQuery(
    {
      searchName: debouncedSearch,
      subcategory,
    },
    {
      placeholderData: keepPreviousData,
    }
  );
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const clearFilters = () => {
    setSearchInput(undefined);
    setSubcategory(undefined);
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
          {(searchInput ?? subcategory) && (
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
            onPress={showModal}
          />
        </View>
      </View>
      <FlatList
        style={styles.listContainer}
        contentContainerStyle={[styles.contentContainer]}
        data={exercises}
        renderItem={({ item }) => <ExerciseItem data={item} fullPath={true} />}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No exercises found</Text>
        )}
      />
      <Modal
        visible={visible}
        onDismiss={hideModal}
        dismissableBackButton={true}
        style={styles.modal}
        contentContainerStyle={styles.modalContainer}
      >
        <CategoriesView
          hideModal={hideModal}
          subcategory={subcategory}
          setSubcategory={setSubcategory}
        />
      </Modal>
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
