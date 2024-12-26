import React, { type Dispatch, type SetStateAction } from 'react';
import ExerciseItem, { type GenerationData } from '~/components/exercises/Item';
import { type ListRenderItemInfo, StyleSheet, View } from 'react-native';
import ReorderableList, {
  ReorderableListItem,
  type ReorderableListReorderEvent,
  useReorderableDrag,
} from 'react-native-reorderable-list';
import { type PrismaTypes } from '@acme/api';
import { TextInput } from 'react-native-paper';
import WeekdayButton from './WeekdayButton';
import Button from '../ui/Button';
import { useTranslation } from 'react-i18next';

interface CardProps {
  id: number;
  subcategory: PrismaTypes.Subcategory;
  name: string;
  videoId: string;
  sets: number;
  reps: number;
}

const Card: React.FC<{
  item: CardProps;
  handleMoreOptions: (exercise: GenerationData) => void;
}> = React.memo(({ item, handleMoreOptions }) => {
  const drag = useReorderableDrag();
  return (
    <ReorderableListItem style={styles.listItem}>
      <ExerciseItem
        showSets={true}
        data={item}
        handleMoreOptions={handleMoreOptions}
        onLongPress={drag}
      />
    </ReorderableListItem>
  );
});

export default function DraggableList({
  type,
  isNameInputVisible,
  selectedDay,
  name,
  setName,
  setIsDayPickerVisible,
  handleSelectExercise,
  handleMoreOptions,
  splitExercises,
  handleReorder,
}: {
  type: 'new' | 'edit';
  isNameInputVisible?: boolean;
  name?: string;
  selectedDay: PrismaTypes.SplitWeekDay;
  splitExercises: GenerationData[];
  setName: Dispatch<SetStateAction<string>>;
  setIsDayPickerVisible: Dispatch<SetStateAction<boolean>>;
  handleSelectExercise: () => void;
  handleMoreOptions: (exercise: GenerationData) => void;
  handleReorder: ({ from, to }: ReorderableListReorderEvent) => void;
}) {
  const newSplit = type === 'new';
  const editSplit = type === 'edit';
  const { t } = useTranslation();
  // const { splitExercises, setSplitExercises } = useAppContext();
  const renderItem = ({ item }: ListRenderItemInfo<CardProps>) => (
    <Card item={item} handleMoreOptions={handleMoreOptions} />
  );

  return (
    <ReorderableList
      ListHeaderComponent={
        <View style={styles.headerContainer}>
          {(newSplit || (editSplit && isNameInputVisible)) && (
            <View style={styles.inputContainer}>
              <TextInput
                dense={true}
                value={name}
                autoFocus={false}
                mode="outlined"
                placeholder={t('splits.splitName')}
                keyboardType="default"
                showSoftInputOnFocus={true}
                style={styles.searchInput}
                right={
                  name ? (
                    <TextInput.Icon icon="close" onPress={() => setName('')} />
                  ) : undefined
                }
                outlineStyle={styles.searchOutline}
                onChangeText={setName}
              />
            </View>
          )}
          <WeekdayButton
            selectedDay={selectedDay}
            onPress={() => setIsDayPickerVisible(true)}
          />
        </View>
      }
      ListFooterComponentStyle={styles.footer}
      maxToRenderPerBatch={5}
      ListFooterComponent={
        <Button icon={'plus'} onPress={handleSelectExercise} disabled={false}>
          {t('exercises.selectSavedExercise')}
        </Button>
      }
      showsVerticalScrollIndicator={false}
      data={splitExercises}
      onReorder={handleReorder}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      style={styles.listContainer}
      contentContainerStyle={[styles.contentContainer]}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 12,
    paddingTop: 24,
    paddingBottom: 131,
  },
  footer: {
    marginTop: 20,
  },
  listItem: {
    marginTop: 20,
  },
  headerContainer: {
    gap: 24,
  },
  inputContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchOutline: {
    borderRadius: 10,
  },
  searchInput: {
    alignSelf: 'stretch',
  },
});
