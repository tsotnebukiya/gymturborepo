import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { TextInput, Button, Text, ActivityIndicator } from 'react-native-paper';
import GradientLayout from '~/components/shared/GradientLayout';
import TopBar from '~/components/shared/TopBar';
import { useSplitDayConstants, type SplitDayKey } from '~/lib/utils/constants';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DayPickerModal from '~/components/splits/DayPickerModal';
import { useAppContext } from '~/lib/contexts/AppContext';
import ExerciseItem, { type GenerationData } from '~/components/exercises/Item';
import ScrollView from '~/components/shared/ScrollView';
import { api, type RouterOutputs } from '~/lib/utils/api';
import { useCurrentLanguageEnum } from '~/i18n';
import { keepPreviousData } from '@tanstack/react-query';
import SplitIndividualSkeleton from '~/components/splits/IndividualSkeleton';
import ExerciseBottomSheet from '~/components/splits/BottomExerciseModal';
import { type BottomSheetModal } from '@gorhom/bottom-sheet';
import RepsSetsModal from '~/components/splits/RepsSetsModal';

export default function SplitIndividualScreen() {
  const language = useCurrentLanguageEnum();
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

function LoadedSplitIndividual({
  split,
}: {
  split: RouterOutputs['split']['getOne'];
}) {
  const utils = api.useUtils();
  const [repsSetsModalVisible, setRepsSetsModalVisible] = useState(false);
  const splitDayConstants = useSplitDayConstants();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { setSplitExercises, splitExercises } = useAppContext();
  const [isNameInputVisible, setIsNameInputVisible] = useState(false);
  const [name, setName] = useState<string>(split.name);
  const [isDayPickerVisible, setIsDayPickerVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] =
    useState<GenerationData | null>(null);
  const selectedDay = split.day;

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
  const { mutate: mutateExercises, isPending: isUpdatingExercises } =
    api.split.updateExercises.useMutation({
      onSettled: async () => {
        await utils.split.getOne.invalidate({ id: split.id });
      },
    });
  const { mutate: mutateExercise, isPending: isUpdatingExercise } =
    api.split.updateExercise.useMutation({
      onSettled: async () => {
        setRepsSetsModalVisible(false);
        await utils.split.getOne.invalidate({ id: split.id });
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
  const handleDelete = (id: number) => {
    mutateExercises({
      splitId: split.id,
      exerciseId: id,
      type: 'remove',
    });
  };
  const handleBottomSheetClose = () => {
    bottomSheetRef.current?.close();
  };
  const handleSheetDelete = (id: number) => {
    deleteExercise(id);
    handleBottomSheetClose();
  };
  const handleRefresh = async () => {
    await utils.split.getOne.invalidate({ id: split.id });
  };
  const changeSetRep = (reps: number, sets: number) => {
    mutateExercise({
      exerciseId: selectedExercise!.id,
      reps,
      sets,
    });
  };
  const deleteExercise = (id: number) => {
    mutateExercises({
      splitId: split.id,
      exerciseId: id,
      type: 'remove',
    });
  };
  const handleMoreOptions = (id: number, exercise: GenerationData) => {
    setSelectedExercise(exercise);
    setTimeout(() => {
      bottomSheetRef.current?.present();
      bottomSheetRef.current?.snapToIndex(0); // Changed from 1 to 0 since snapPoints only has ['50%']
    }, 0);
  };
  useEffect(() => {
    if (splitExercises.length > 0) {
      const exerciseId = splitExercises[0]?.id;
      if (!exerciseId) return;
      mutateExercises({
        splitId: split.id,
        exerciseId,
        type: 'add',
      });
      setSplitExercises([]);
    }
  }, [splitExercises]);

  return (
    <GradientLayout>
      <View style={styles.container}>
        <TopBar
          title={split.name}
          statusBarHeight={0}
          borderBottomColor="#E0E0E0"
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

        <ScrollView onRefresh={handleRefresh}>
          <View style={styles.content}>
            <View style={styles.filterContainer}>
              {isNameInputVisible && (
                <TextInput
                  label="Split Name"
                  value={name}
                  autoFocus={false}
                  mode="outlined"
                  keyboardType="default"
                  showSoftInputOnFocus={true}
                  style={styles.searchInput}
                  outlineStyle={styles.searchOutline}
                  onChangeText={setName}
                />
              )}
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.daySelector,
                pressed && styles.daySelectorPressed,
              ]}
              onPress={() => setIsDayPickerVisible(true)}
            >
              <MaterialCommunityIcons
                name="calendar"
                size={24}
                color="rgb(0, 104, 116)"
              />
              <Text style={styles.daySelectorText}>
                {splitDayConstants[selectedDay]}
              </Text>
            </Pressable>

            <DayPickerModal
              visible={isDayPickerVisible}
              selectedDay={selectedDay}
              onSelectDay={handleDayChange}
              loading={isPendingDay}
            />

            {isUpdatingExercises && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" />
                <Text>Updating exercises...</Text>
              </View>
            )}

            {split.exercises.map((el) => (
              <ExerciseItem
                showSets={true}
                data={el}
                key={el.id}
                handleMoreOptions={handleMoreOptions}
                onSwipe={handleDelete}
              />
            ))}

            <Button
              mode="outlined"
              onPress={handleSelectExercise}
              icon="plus"
              style={styles.exerciseButton}
              contentStyle={styles.exerciseButtonContent}
              labelStyle={styles.exerciseButtonLabel}
              disabled={isUpdatingExercises}
            >
              Select Saved Exercise
            </Button>
          </View>
        </ScrollView>
      </View>
      {selectedExercise && (
        <ExerciseBottomSheet
          sheetRef={bottomSheetRef}
          handleChangeSetRep={handleChangeSetRep}
          handleDelete={() => handleSheetDelete(selectedExercise.id)}
        />
      )}
      {selectedExercise && (
        <RepsSetsModal
          visible={repsSetsModalVisible}
          onClose={() => setRepsSetsModalVisible(false)}
          initialReps={selectedExercise.reps}
          initialSets={selectedExercise.sets}
          onConfirm={changeSetRep}
          isLoading={isUpdatingExercise}
        />
      )}
    </GradientLayout>
  );
}

const styles = StyleSheet.create({
  modal: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    margin: 0,
    backgroundColor: 'white',
  },
  modalContent: {
    flex: 1,
  },
  container: {
    flex: 1,
    gap: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },

  // Update searchOutline and searchInput
  searchOutline: {
    borderRadius: 16,
  },
  searchInput: {
    flex: 1,
  },
  content: {
    gap: 16,
  },
  daysContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  dayButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgb(0, 104, 116)', // primary
    minWidth: 70,
    alignItems: 'center',
  },
  dayButtonSelected: {
    backgroundColor: 'rgb(0, 104, 116)', // primary
  },
  dayButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  dayButtonText: {
    color: 'rgb(0, 104, 116)', // primary
    fontSize: 14,
    fontWeight: '500',
  },
  dayButtonTextSelected: {
    color: 'rgb(255, 255, 255)', // onPrimary
  },

  daySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  daySelectorPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
    backgroundColor: '#f5f5f5',
  },
  daySelectorText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },

  exerciseButton: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  exerciseButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    height: 56,
  },
  exerciseButtonLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },

  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 8,
    backgroundColor: 'rgba(0, 104, 116, 0.1)',
    borderRadius: 8,
  },
});
