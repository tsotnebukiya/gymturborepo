import { StyleSheet, View } from 'react-native';
import { type RouterOutputs } from '~/utils/api';
import TopBar from '~/components/common/TopBar';
import { router } from 'expo-router';
import ExerciseItem from '../exercises/ExerciseItem';
import { Skeleton } from 'moti/skeleton';
import ScrollView from '../common/ScrollView';

type GenerationData = RouterOutputs['generation']['getOne'];

function ExerciseListSkeleton() {
  return Array(4)
    .fill(0)
    .map((_, index) => (
      <View key={index} style={styles.exerciseItem}>
        <Skeleton width={140} height={90} radius={12} colorMode="light" />
        <View style={styles.exerciseContent}>
          <Skeleton width={160} height={20} radius={4} colorMode="light" />
          <View style={styles.muscleGroup}>
            <Skeleton width={48} height={48} radius={24} colorMode="light" />
            <Skeleton width={100} height={15} radius={4} colorMode="light" />
          </View>
        </View>
      </View>
    ));
}

interface Props {
  data?: GenerationData;
}

export default function ExerciseList({ data }: Props) {
  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <TopBar
        statusBarHeight={0}
        title={data ? `${data.name}` : ''}
        borderBottomColor="#E0E0E0"
        backAction={{
          icon: 'arrow-left',
          onPress: handleBack,
        }}
      />
      <ScrollView>
        {!data ? (
          <ExerciseListSkeleton />
        ) : (
          data.exercise.map((exercise, index) => (
            <ExerciseItem data={exercise} key={index} fullPath={false} />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  video: {
    alignSelf: 'center',
    width: 320,
    height: 200,
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
});
