import { Image, StyleSheet, View, Pressable } from 'react-native';
import { api, type RouterOutputs } from '~/lib/utils/api';
import { router } from 'expo-router';
import { musclesConstants } from '~/lib/utils/constants';
import { Text, IconButton } from 'react-native-paper';
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
  showSets?: boolean;
  onSwipe?: (id: number) => void;
  handlePress?: (id: number, exercise: GenerationData) => void;
  handleMoreOptions?: (id: number, exercise: GenerationData) => void;
}

export default function ExerciseItem({
  data,
  showSets,
  onSwipe,
  handlePress,
  handleMoreOptions,
}: Props) {
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
  const handleItemPress = (id: number) => {
    if (handlePress) {
      handlePress(id, exercise);
    } else {
      router.push({
        pathname: `/(auth)/exercise/[id]`,
        params: { id },
      });
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
          onPress={() => handleItemPress(exercise.id)}
          style={({ pressed }) => [
            styles.exerciseItem,
            pressed && styles.exerciseItemPressed,
          ]}
        >
          <Image
            source={{
              uri: `https://img.youtube.com/vi/${data.videoId}/maxresdefault.jpg`,
            }}
            style={styles.exerciseImage}
          />
          <View style={styles.exerciseContent}>
            <Text
              style={styles.exerciseTitle}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {exercise.name}
            </Text>
            {showSets ? (
              <View style={styles.setsContainerBordered}>
                <View style={styles.setRepBordered}>
                  <Text style={styles.setRepTextBordered}>{data.sets}</Text>
                  <Text style={styles.setRepLabelBordered}>Sets</Text>
                </View>
                <View style={styles.setRepBordered}>
                  <Text style={styles.setRepTextBordered}>{data.reps}</Text>
                  <Text style={styles.setRepLabelBordered}>Reps</Text>
                </View>
              </View>
            ) : (
              <View style={styles.muscleGroup}>
                <Image
                  source={musclesConstants[exercise.subcategory].icon}
                  style={styles.muscleIcon}
                />
                <Text variant="bodyMedium" style={styles.muscleText}>
                  {musclesConstants[exercise.subcategory].label}
                </Text>
              </View>
            )}
          </View>
          {handleMoreOptions && (
            <View>
              <IconButton
                icon="dots-vertical"
                size={24}
                style={styles.kebabButton}
                onPress={() => handleMoreOptions(exercise.id, exercise)}
              />
            </View>
          )}
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
    padding: 8,
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
    marginVertical: 0,
    marginLeft: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  kebabButton: {
    margin: 0,
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
    marginRight: 8,
  },
  muscleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
  setsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  setsContainerBordered: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  setRepBordered: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 6,
    minWidth: 60,
    alignItems: 'center',
  },
  setRepTextBordered: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  setRepLabelBordered: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});
