import { StyleSheet, View } from 'react-native';
import { Skeleton } from 'moti/skeleton';
import GradientLayout from '~/components/shared/GradientLayout';
import ExerciseListSkeleton from '../exercises/SkeletonList';

export default function SplitIndividualSkeleton() {
  return (
    <GradientLayout>
      <View style={styles.container}>
        {/* TopBar Skeleton */}
        <View style={styles.topBar}>
          <Skeleton width={200} height={32} radius={4} colorMode="light" />
          <Skeleton width={40} height={40} radius={20} colorMode="light" />
        </View>

        <View style={styles.content}>
          {/* Day Selector Skeleton */}
          <View style={styles.daySelector}>
            <Skeleton width={24} height={24} radius={12} colorMode="light" />
            <Skeleton width={120} height={24} radius={4} colorMode="light" />
          </View>

          {/* Exercise Items Skeleton */}
          <ExerciseListSkeleton count={3} />
        </View>
      </View>
    </GradientLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
  },
  topBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: 'white',
  },
  content: {
    gap: 16,
    paddingHorizontal: 12,
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
});
