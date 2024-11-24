import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import GradientLayout from '~/components/common/GradientLayout';
import TopBar from '~/components/common/TopBar';
import { splitDayConstants, type SplitDayKey } from '~/utils/constants';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DayPickerModal from './DayPickerModal';
import { useAppContext } from '../context/AppContext';
import ExerciseItem from '../exercises/Item';
import ScrollView from '../common/ScrollView';
import { api } from '~/utils/api';

export default function SplitNew() {
  const utils = api.useUtils();
  const [name, setName] = useState<string | undefined>();
  const { splitExercises, setSplitExercises } = useAppContext();
  const [selectedDay, setSelectedDay] = useState<SplitDayKey>('MONDAY');
  const [isDayPickerVisible, setIsDayPickerVisible] = useState(false);
  const { mutate, isPending } = api.split.createOne.useMutation({
    onSuccess: () => {
      void utils.split.getAll.invalidate();
      router.back();
    },
    onError: () => {
      Alert.alert('Error', 'Failed to create split');
    },
  });
  const handleCreate = () => {
    if (!name) {
      Alert.alert('Error', 'Split name is required');
      return;
    }
    mutate({
      name,
      day: selectedDay,
      exerciseIds: splitExercises.map((el) => el.id),
    });
  };

  const handleSelectExercise = () => {
    router.push('/(auth)/(dashboard)/split/exercises');
  };
  const onSwipe = (id: number) => {
    setSplitExercises((prev) => prev.filter((el) => el.id !== id));
  };
  useEffect(() => {
    return () => {
      setSplitExercises([]);
    };
  }, []);
  return (
    <GradientLayout>
      <View style={styles.container}>
        <TopBar
          title="Create Split"
          statusBarHeight={0}
          borderBottomColor="#E0E0E0"
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
        <ScrollView>
          <View style={styles.content}>
            <View style={styles.filterContainer}>
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
              onClose={() => setIsDayPickerVisible(false)}
              selectedDay={selectedDay}
              onSelectDay={setSelectedDay}
            />
            {splitExercises.map((el, index) => (
              <ExerciseItem
                data={el}
                key={index}
                type={'saved'}
                onSwipe={onSwipe}
              />
            ))}
            <Button
              mode="outlined"
              onPress={handleSelectExercise}
              icon="plus"
              style={styles.exerciseButton}
              contentStyle={styles.exerciseButtonContent}
              labelStyle={styles.exerciseButtonLabel}
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
    // paddingHorizontal: 16,
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
    padding: 16,
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
});
