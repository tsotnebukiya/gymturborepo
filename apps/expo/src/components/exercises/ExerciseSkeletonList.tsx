import { StyleSheet, View } from 'react-native';
import { Skeleton } from 'moti/skeleton';

interface ExerciseListSkeletonProps {
  type?: 'default' | 'ai-generating';
  count?: number;
}

export default function ExerciseListSkeleton({
  type = 'default',
  count = 5,
}: ExerciseListSkeletonProps) {
  const getRandomWidth = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  if (type === 'ai-generating') {
    return Array(count)
      .fill(0)
      .map((_, index) => (
        <View style={styles.aiContainer} key={index}>
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <View key={index} style={styles.aiLine}>
                <Skeleton
                  width={getRandomWidth(120, 220)}
                  height={12}
                  radius={6}
                  colorMode="light"
                  transition={{
                    duration: 1000 + index * 200, // Staggered animation
                  }}
                />
              </View>
            ))}
        </View>
      ));
  }

  return Array(count)
    .fill(0)
    .map((_, index) => (
      <View key={index} style={styles.exerciseItem}>
        <Skeleton
          width={140}
          height={90}
          radius={12}
          colorMode="light"
          transition={{
            duration: 1500,
          }}
        />
        <View style={styles.exerciseContent}>
          <Skeleton
            width={getRandomWidth(140, 180)}
            height={20}
            radius={4}
            colorMode="light"
            transition={{
              duration: 1500,
            }}
          />
          <View style={styles.muscleGroup}>
            <Skeleton width={48} height={48} radius={24} colorMode="light" />
            <Skeleton width={100} height={15} radius={4} colorMode="light" />
          </View>
        </View>
      </View>
    ));
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
  exerciseContent: {
    flex: 1,
    gap: 10,
    justifyContent: 'center',
    height: 90,
  },
  muscleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aiContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 122,
    justifyContent: 'center',
  },
  aiLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
