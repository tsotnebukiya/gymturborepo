import { Image, StyleSheet, View, Pressable } from 'react-native';
import { api, type RouterOutputs } from '~/utils/api';
import { router } from 'expo-router';
import { musclesConstants } from '~/utils/constants';
import { Text } from 'react-native-paper';

type GenerationData = NonNullable<
  RouterOutputs['generation']['getOne']
>['exercise'][number];

interface Props {
  data: GenerationData;
  fullPath: boolean;
}

export default function ExerciseItem({ data, fullPath }: Props) {
  api.exercise.getOne.usePrefetchQuery({ id: data.id });
  const exercise = data;
  const handlePress = (exerciseId: string) => {
    router.push(
      fullPath
        ? {
            pathname: `/(auth)/exercise/[id]`,
            params: { id: exerciseId },
          }
        : {
            pathname: '/(auth)/generated/[id]/[exercise]',
            params: { exercise: exerciseId, id: data.id },
          }
    );
  };
  return (
    <Pressable
      onPress={() => handlePress(exercise.id.toString())}
      style={({ pressed }) => [
        styles.exerciseItem,
        pressed && styles.exerciseItemPressed,
      ]}
    >
      <Image
        source={{
          uri: 'https://img.youtube.com/vi/T3N-TO4reLQ/maxresdefault.jpg',
        }}
        style={styles.exerciseImage}
      />
      <View style={styles.exerciseContent}>
        <Text style={styles.exerciseTitle}>{exercise.name}</Text>
        <View style={styles.muscleGroup}>
          <Image
            source={musclesConstants[exercise.subcategory].icon}
            style={styles.muscleIcon}
          />
          <Text variant="bodyMedium" style={styles.muscleText}>
            {musclesConstants[exercise.subcategory].label}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exerciseItemPressed: {
    backgroundColor: '#f5f5f5',
  },
  exerciseImage: {
    width: 140,
    height: 90,
    borderRadius: 12,
  },
  exerciseContent: {
    flex: 1,
    gap: 10,
    justifyContent: 'center',
    height: 90,
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  muscleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  muscleIcon: {
    width: 48,
    height: 48,
  },
  muscleText: {
    color: '#666666',
    fontSize: 15,
  },
});
