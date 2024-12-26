import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import GradientLayout from '~/components/shared/GradientLayout';
import TopBar from '~/components/shared/TopBar';
import { type SplitDayKey } from '~/lib/utils/constants';
import DayPickerModal from '~/components/splits/DayPickerModal';
import { useAppContext } from '~/lib/contexts/AppContext';
import { type GenerationData } from '~/components/exercises/Item';
import { api, type RouterOutputs } from '~/lib/utils/api';
import { useCurrentLanguage } from '~/i18n';
import { keepPreviousData } from '@tanstack/react-query';
import SplitIndividualSkeleton from '~/components/splits/IndividualSkeleton';
import ExerciseBottomSheet from '~/components/splits/BottomExerciseModal';
import { type BottomSheetModal } from '@gorhom/bottom-sheet';
import RepsSetsModal from '~/components/splits/RepsSetsModal';
import DraggableList from '~/components/splits/DraggableList';
import {
  type ReorderableListReorderEvent,
  reorderItems,
} from 'react-native-reorderable-list';

export default function SplitIndividualScreen() {
  const { language } = useCurrentLanguage();
  const { splitId } = useLocalSearchParams();
  const { data: split, isLoading } = api.split.getOne.useQuery(
    {
      id: Number(splitId),
      language,
    },
    {
      placeholderData: keepPreviousData,
    }
  );
  if (isLoading) return <SplitIndividualSkeleton />;
  if (!split) return null;

  return <LoadedSplitIndividual split={split} />;
}

type ExerciseGenerationData = GenerationData & {
  exerciseId?: number;
};

function LoadedSplitIndividual({
  split,
}: {
  split: RouterOutputs['split']['getOne'];
}) {
  const utils = api.useUtils();
  const [localExercises, setLocalExercises] = useState<
    ExerciseGenerationData[]
  >(split.exercises);
  const [repsSetsModalVisible, setRepsSetsModalVisible] = useState(false);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { setSplitExercises, splitExercises } = useAppContext();

  const [isNameInputVisible, setIsNameInputVisible] = useState(false);
  const [name, setName] = useState<string>(split.name);
  const [isDayPickerVisible, setIsDayPickerVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] =
    useState<ExerciseGenerationData | null>(null);
  const selectedDay = split.day;
  const { mutate: mutateReorder } = api.split.reorderExercise.useMutation({
    onSettled: () => {
      void utils.split.getOne.invalidate({ id: split.id });
    },
  });
  const { mutate: mutateDay, isPending: isPendingDay } =
    api.split.updateOne.useMutation({
      onSettled: async () => {
        await utils.split.getOne.invalidate({ id: split.id });
        setIsDayPickerVisible(false);
      },
    });
  const { mutate: mutateName, isPending: isPendingName } =
    api.split.updateOne.useMutation({
      onMutate: () => {
        setIsNameInputVisible(false);
      },
      onSettled: async () => {
        await utils.split.getOne.invalidate({ id: split.id });
        setIsDayPickerVisible(false);
      },
    });
  const { mutate: mutateExercises } = api.split.updateExercises.useMutation({
    onSettled: () => {
      void utils.split.getOne.invalidate({ id: split.id });
      void utils.split.getAll.invalidate();
    },
  });
  const { mutate: mutateExercise } = api.split.updateExercise.useMutation({
    onSettled: () => {
      void utils.split.getOne.invalidate({ id: split.id });
      void utils.split.getAll.invalidate();
    },
  });

  const handleDayChange = (day: SplitDayKey) => {
    mutateDay({ id: split.id, day });
  };
  const handleInputOpen = () => {
    setIsNameInputVisible(true);
  };
  const handleNameChange = () => {
    if (name === split.name) {
      setIsNameInputVisible(false);
      return;
    }
    if (!name.length) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }
    mutateName({ id: split.id, name });
  };
  const handleSelectExercise = () => {
    router.push('/(auth)/(dashboard)/split/exercises');
  };
  const handleChangeSetRep = () => {
    setRepsSetsModalVisible(true);
    bottomSheetRef.current?.close();
  };
  const handleBottomSheetClose = () => {
    bottomSheetRef.current?.close();
  };
  const handleSheetDelete = (id: number) => {
    deleteExercise(id);
    handleBottomSheetClose();
  };
  const changeSetRep = (reps: number, sets: number) => {
    setLocalExercises((prev) =>
      prev.map((ex) =>
        ex.id === selectedExercise!.id ? { ...ex, reps, sets } : ex
      )
    );
    setRepsSetsModalVisible(false);
    mutateExercise({
      exerciseId: selectedExercise!.exerciseId || selectedExercise!.id,
      reps,
      sets,
      splitId: split.id,
    });
  };
  const deleteExercise = (id: number) => {
    setLocalExercises((prev) =>
      prev.filter((ex) => ex.id !== id && ex.exerciseId !== id)
    );
    mutateExercises({
      splitId: split.id,
      exerciseId: id,
      type: 'remove',
    });
  };
  const handleMoreOptions = useCallback((exercise: GenerationData) => {
    setSelectedExercise(exercise);
    setTimeout(() => {
      bottomSheetRef.current?.present();
      bottomSheetRef.current?.snapToIndex(0);
    }, 0);
  }, []);
  const handleReorder = ({ from, to }: ReorderableListReorderEvent) => {
    const newData = reorderItems(localExercises, from, to);
    setLocalExercises(newData);

    const movedExercise = localExercises[from];
    const prevExercise = to > 0 ? newData[to - 1] : null;
    const nextExercise = to < newData.length - 1 ? newData[to + 1] : null;
    if (!movedExercise) {
      return;
    }
    mutateReorder({
      exerciseId: movedExercise.exerciseId || movedExercise.id,
      prevExerciseId: prevExercise?.exerciseId || prevExercise?.id || null,
      nextExerciseId: nextExercise?.exerciseId || nextExercise?.id || null,
      splitId: split.id,
    });
  };
  useEffect(() => {
    if (splitExercises.length > 0) {
      const newExercise = splitExercises[0];
      if (!newExercise) return;
      const exerciseExists = localExercises.some(
        (ex) => ex.id === newExercise.id
      );
      if (!exerciseExists) {
        setLocalExercises((prev) => [...prev, newExercise]);
        mutateExercises({
          splitId: split.id,
          exerciseId: newExercise.id,
          type: 'add',
        });
      }
      setSplitExercises([]);
    }
  }, [splitExercises]);

  return (
    <GradientLayout>
      <TopBar
        title={split.name}
        inset={false}
        barBorder={true}
        backAction={{ icon: 'arrow-left', onPress: () => router.back() }}
        actions={[
          {
            icon: isNameInputVisible ? 'check' : 'circle-edit-outline',
            onPress: isNameInputVisible ? handleNameChange : handleInputOpen,
            loading: isPendingName,
            mode: 'contained',
          },
        ]}
      />
      <DraggableList
        handleReorder={handleReorder}
        splitExercises={localExercises}
        type="edit"
        name={name}
        isNameInputVisible={isNameInputVisible}
        setName={setName}
        selectedDay={selectedDay}
        setIsDayPickerVisible={setIsDayPickerVisible}
        handleSelectExercise={handleSelectExercise}
        handleMoreOptions={handleMoreOptions}
      />

      {selectedExercise && (
        <ExerciseBottomSheet
          sheetRef={bottomSheetRef}
          handleChangeSetRep={handleChangeSetRep}
          handleDelete={() =>
            handleSheetDelete(
              selectedExercise.exerciseId || selectedExercise.id
            )
          }
        />
      )}
      <DayPickerModal
        visible={isDayPickerVisible}
        selectedDay={selectedDay}
        onSelectDay={handleDayChange}
        loading={isPendingDay}
      />
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
