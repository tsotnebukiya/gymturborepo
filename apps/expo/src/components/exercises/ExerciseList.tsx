import { StyleSheet, View } from 'react-native';
import { type RouterOutputs } from '~/utils/api';
import TopBar from '~/components/common/TopBar';
import { router } from 'expo-router';
import ExerciseItem from './ExerciseItem';
import ScrollView from '../common/ScrollView';
import { Text } from 'react-native-paper';
import ExerciseListSkeleton from './ExerciseSkeletonList';

function NoExercises() {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No exercises generated</Text>
    </View>
  );
}

interface Props {
  data?: NonNullable<RouterOutputs['generation']['getOne']>['exercise'];
  name?: string;
  loading: boolean;
  exercisePath: boolean;
  type?: 'default' | 'ai-generating';
}

export default function ExerciseList({
  data,
  name,
  loading,
  exercisePath,
  type = 'default',
}: Props) {
  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <TopBar
        statusBarHeight={0}
        title={name ? `${name}` : ''}
        borderBottomColor="#E0E0E0"
        backAction={{
          icon: 'arrow-left',
          onPress: handleBack,
        }}
      />
      <ScrollView>
        <View style={styles.exercisesContainer}>
          {loading ? (
            <ExerciseListSkeleton type={type} />
          ) : !data?.length ? (
            <NoExercises />
          ) : (
            data.map((exercise, index) => (
              <ExerciseItem
                data={exercise}
                key={index}
                exercisePath={exercisePath}
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    // gap: 32,
  },
  video: {
    alignSelf: 'center',
    width: 320,
    height: 200,
  },
  exercisesContainer: {
    marginTop: 32,
    gap: 16,
  },
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
  },
});
