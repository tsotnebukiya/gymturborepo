import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import GradientLayout from '~/components/shared/GradientLayout';
import TopBar from '~/components/shared/TopBar';
import { type SplitDayKey } from '~/lib/utils/constants';
import DayPickerModal from '~/components/splits/DayPickerModal';
import { useAppContext } from '~/lib/contexts/AppContext';
import ExerciseItem, { type GenerationData } from '~/components/exercises/Item';
import ScrollView from '~/components/shared/ScrollView';
import { api, type RouterOutputs } from '~/lib/utils/api';
import { useCurrentLanguage } from '~/i18n';
import { keepPreviousData } from '@tanstack/react-query';
import SplitIndividualSkeleton from '~/components/splits/IndividualSkeleton';
import ExerciseBottomSheet from '~/components/splits/BottomExerciseModal';
import { type BottomSheetModal } from '@gorhom/bottom-sheet';
import RepsSetsModal from '~/components/splits/RepsSetsModal';
import WeekdayButton from '~/components/splits/WeekdayButton';
import UpdatingBox from '~/components/splits/UpdatingBox';
import Button from '~/components/ui/Button';
import { useTranslation } from 'react-i18next';

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

function LoadedSplitIndividual({
  split,
}: {
  split: RouterOutputs['split']['getOne'];
}) {
  const utils = api.useUtils();
  const { t } = useTranslation();
  const [repsSetsModalVisible, setRepsSetsModalVisible] = useState(false);
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
  const handleMoreOptions = (exercise: GenerationData) => {
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
      <ScrollView onRefresh={handleRefresh}>
        <View style={styles.content}>
          {isNameInputVisible ? (
            <View style={styles.inputContainer}>
              <TextInput
                dense={true}
                value={name}
                autoFocus={false}
                mode="outlined"
                placeholder={'Split Name'}
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
          ) : null}
          {isUpdatingExercises && <UpdatingBox />}
          <WeekdayButton
            selectedDay={selectedDay}
            onPress={() => setIsDayPickerVisible(true)}
          />

          {split.exercises.map((el) => (
            <ExerciseItem
              showSets={true}
              data={el}
              key={el.id}
              handleMoreOptions={handleMoreOptions}
            />
          ))}
          <Button
            icon={'plus'}
            onPress={handleSelectExercise}
            disabled={isUpdatingExercises}
          >
            {t('exercises.selectSavedExercise')}
          </Button>
        </View>
      </ScrollView>

      {selectedExercise && (
        <ExerciseBottomSheet
          sheetRef={bottomSheetRef}
          handleChangeSetRep={handleChangeSetRep}
          handleDelete={() => handleSheetDelete(selectedExercise.id)}
        />
      )}
      <DayPickerModal
        visible={isDayPickerVisible}
        selectedDay={selectedDay}
        onSelectDay={handleDayChange}
        loading={isPendingDay}
        onClose={() => setIsDayPickerVisible(false)}
      />
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
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
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
  content: {
    gap: 24,
    paddingTop: 24,
    paddingHorizontal: 12,
  },
});
