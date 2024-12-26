import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import GradientLayout from '~/components/shared/GradientLayout';
import TopBar from '~/components/shared/TopBar';
import { type SplitDayKey } from '~/lib/utils/constants';
import { useAppContext } from '~/lib/contexts/AppContext';
import { type GenerationData } from '~/components/exercises/Item';
import { api } from '~/lib/utils/api';
import { type BottomSheetModal } from '@gorhom/bottom-sheet';
import ExerciseBottomSheet from '~/components/splits/BottomExerciseModal';
import RepsSetsModal from '~/components/splits/RepsSetsModal';
import { useTranslation } from 'react-i18next';
import DraggableList from '~/components/splits/DraggableList';
import DayPickerModal from '~/components/splits/DayPickerModal';
import { reorderItems } from 'react-native-reorderable-list';
import { type ReorderableListReorderEvent } from 'react-native-reorderable-list';

export default function SplitNewScreen() {
  const { t } = useTranslation();
  const utils = api.useUtils();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [repsSetsModalVisible, setRepsSetsModalVisible] = useState(false);
  const [name, setName] = useState<string>('');
  const { splitExercises, setSplitExercises } = useAppContext();
  const [selectedDay, setSelectedDay] = useState<SplitDayKey>('MONDAY');
  const [isDayPickerVisible, setIsDayPickerVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] =
    useState<GenerationData | null>(null);
  const { mutate, isPending } = api.split.createOne.useMutation({
    onSuccess: () => {
      void utils.split.getAll.invalidate();
      router.back();
    },
    onError: () => {
      Alert.alert(t('splits.errors.error'), t('splits.errors.createError'));
    },
  });
  const handleCreate = () => {
    if (!name) {
      Alert.alert(t('splits.errors.error'), t('splits.errors.nameRequired'));
      return;
    }
    mutate({
      name,
      day: selectedDay,
      exercises: splitExercises.map((el) => ({
        id: el.id,
        sets: el.sets,
        reps: el.reps,
      })),
    });
  };
  const handleSelectExercise = () => {
    router.push('/(auth)/(dashboard)/split/exercises');
  };
  const handleChangeSetRep = () => {
    setRepsSetsModalVisible(true);
    bottomSheetRef.current?.close();
  };

  const changeSetRep = (reps: number, sets: number) => {
    if (!selectedExercise) return;

    setSplitExercises((prev) =>
      prev.map((exercise) =>
        exercise.id === selectedExercise.id
          ? { ...exercise, reps, sets }
          : exercise
      )
    );
    setRepsSetsModalVisible(false);
  };
  const deleteExercise = (id: number) => {
    setSplitExercises((prev) => prev.filter((el) => el.id !== id));
    bottomSheetRef.current?.close();
  };

  const handleMoreOptions = (exercise: GenerationData) => {
    setSelectedExercise(exercise);
    setTimeout(() => {
      bottomSheetRef.current?.present();
      bottomSheetRef.current?.snapToIndex(0); // Changed from 1 to 0 since snapPoints only has ['50%']
    }, 0);
  };
  const handleSelectDay = (selectedDay: SplitDayKey) => {
    setSelectedDay(selectedDay);
    setIsDayPickerVisible(false);
  };
  const handleReorder = ({ from, to }: ReorderableListReorderEvent) => {
    const newData = reorderItems(splitExercises, from, to);
    setSplitExercises(newData);
  };
  useEffect(() => {
    return () => {
      setSplitExercises([]);
    };
  }, []);
  return (
    <GradientLayout>
      <TopBar
        title={t('splits.createSplit')}
        barBorder={true}
        inset={false}
        backAction={{ icon: 'arrow-left', onPress: () => router.back() }}
        actions={[
          {
            icon: 'check',
            onPress: handleCreate,
            mode: 'contained',
            loading: isPending,
          },
        ]}
      />

      <DraggableList
        type="new"
        splitExercises={splitExercises}
        name={name}
        setName={setName}
        selectedDay={selectedDay}
        setIsDayPickerVisible={setIsDayPickerVisible}
        handleSelectExercise={handleSelectExercise}
        handleMoreOptions={handleMoreOptions}
        handleReorder={handleReorder}
      />
      <DayPickerModal
        visible={isDayPickerVisible}
        onClose={() => setIsDayPickerVisible(false)}
        selectedDay={selectedDay}
        onSelectDay={handleSelectDay}
      />
      {selectedExercise && (
        <ExerciseBottomSheet
          sheetRef={bottomSheetRef}
          handleChangeSetRep={handleChangeSetRep}
          handleDelete={() => deleteExercise(selectedExercise.id)}
        />
      )}
      {selectedExercise && (
        <RepsSetsModal
          visible={repsSetsModalVisible}
          onClose={() => setRepsSetsModalVisible(false)}
          initialReps={selectedExercise.reps}
          initialSets={selectedExercise.sets}
          onConfirm={changeSetRep}
        />
      )}
    </GradientLayout>
  );
}
