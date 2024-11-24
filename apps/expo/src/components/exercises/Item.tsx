import { Image, StyleSheet, View, Pressable } from 'react-native';
import { api, type RouterOutputs } from '~/utils/api';
import { router } from 'expo-router';
import { musclesConstants } from '~/utils/constants';
import { Text } from 'react-native-paper';
import { useAppContext } from '../context/AppContext';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useCurrentLanguageEnum } from '~/i18n';

export type GenerationData = NonNullable<
  RouterOutputs['generation']['getOne']
>['exercise'][number];

interface Props {
  data: GenerationData;
  type: 'generation' | 'saved' | 'split';
  onSwipe?: (id: number) => void;
}

export default function ExerciseItem({ data, type, onSwipe }: Props) {
  const { setSplitExercises } = useAppContext();
  const language = useCurrentLanguageEnum();
  api.exercise.getOne.usePrefetchQuery({ id: data.id, language });
  const exercise = data;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(0),
      },
    ],
  }));

  const renderRightActions = () => {
    return (
      <Animated.View style={[styles.deleteButton, animatedStyle]}>
        <Pressable
          onPress={() => {
            if (onSwipe) onSwipe(exercise.id);
          }}
          style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
      </Animated.View>
    );
  };

  const handlePress = (exerciseId: string) => {
    if (type === 'saved') {
      router.push({
        pathname: `/(auth)/exercise/[id]`,
        params: { id: exerciseId },
      });
    } else if (type === 'generation') {
      router.push({
        pathname: '/(auth)/generated/[id]/[exercise]',
        params: { exercise: exerciseId, id: data.id },
      });
    } else {
      setSplitExercises((prev) => {
        const exists = prev.some((ex) => ex.id === exercise.id);
        if (exists) return prev;
        return [...prev, exercise];
      });
      router.back();
    }
  };
  return (
    <View style={styles.container}>
      <Swipeable
        renderRightActions={renderRightActions}
        friction={2}
        rightThreshold={40}
        overshootRight={false}
        enabled={!!onSwipe}
      >
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
      </Swipeable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    backgroundColor: '#ffffff',
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    // Android shadow
    elevation: 5,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
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
  deleteButton: {
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    borderRadius: 16,
    paddingRight: 16,
  },
  deleteText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
