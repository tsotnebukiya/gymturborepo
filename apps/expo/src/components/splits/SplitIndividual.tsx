import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { TextInput, Button, Text, ActivityIndicator } from 'react-native-paper';
import GradientLayout from '~/components/common/GradientLayout';
import TopBar from '~/components/common/TopBar';
import { splitDayConstants, type SplitDayKey } from '~/utils/constants';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DayPickerModal from './DayPickerModal';
import { useAppContext } from '../context/AppContext';
import ExerciseItem from '../exercises/Item';
import ScrollView from '../common/ScrollView';
import { api, type RouterOutputs } from '~/utils/api';

export default function SplitIndividual({
  split,
}: {
  split: RouterOutputs['split']['getOne'];
}) {
  const utils = api.useUtils();
  const { setSplitExercises, splitExercises } = useAppContext();
  const [isNameInputVisible, setIsNameInputVisible] = useState(false);
  const [name, setName] = useState<string | undefined>(split.name);
  const [isDayPickerVisible, setIsDayPickerVisible] = useState(false);

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
    if (!name?.length) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }
    mutateName({ id: split.id, name });
  };
  const handleSelectExercise = () => {
    router.push('/(auth)/(dashboard)/split/exercises');
  };
  const handleDelete = (id: number) => {
    mutateExercises({
      splitId: split.id,
      exerciseId: id,
      type: 'remove',
    });
  };
  const handleRefresh = async () => {
    await utils.split.getOne.invalidate({ id: split.id });
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
                data={el}
                key={el.id}
                type={'saved'}
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
