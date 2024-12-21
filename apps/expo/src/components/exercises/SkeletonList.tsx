import { StyleSheet, View } from 'react-native';
import { Skeleton } from 'moti/skeleton';
import colors from '~/lib/utils/colors';

interface ExerciseListSkeletonProps {
  type?: 'default' | 'ai-generating';
  count?: number;
}

export default function ExerciseListSkeleton({
  count = 5,
}: ExerciseListSkeletonProps) {
  const getRandomWidth = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  return (
    <View style={{ gap: 16 }}>
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <View key={index} style={styles.exerciseItem}>
            <Skeleton
              width={100}
              height={100}
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
                <Skeleton
                  width={48}
                  height={48}
                  radius={24}
                  colorMode="light"
                />
                <Skeleton
                  width={100}
                  height={15}
                  radius={4}
                  colorMode="light"
                />
              </View>
            </View>
          </View>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 2,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border.light,
    gap: 16,
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
});
