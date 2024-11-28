import { StyleSheet, View } from 'react-native';
import { Skeleton } from 'moti/skeleton';

interface SplitSkeletonProps {
  count?: number;
}

export default function SplitSkeleton({ count = 5 }: SplitSkeletonProps) {
  return Array(count)
    .fill(0)
    .map((_, index) => (
      <View key={index} style={styles.splitItem}>
        <View style={styles.splitContent}>
          <View style={styles.row}>
            <Skeleton width={180} height={24} radius={4} colorMode="light" />
            <Skeleton width={80} height={28} radius={12} colorMode="light" />
          </View>

          <View style={styles.detailsRow}>
            <Skeleton width={100} height={18} radius={4} colorMode="light" />
          </View>

          <View style={styles.muscleGroups}>
            {Array(3)
              .fill(0)
              .map((_, idx) => (
                <Skeleton
                  key={idx}
                  width={60}
                  height={24}
                  radius={8}
                  colorMode="light"
                />
              ))}
          </View>
        </View>
      </View>
    ));
}

const styles = StyleSheet.create({
  splitItem: {
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
  splitContent: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailsRow: {
    marginTop: 8,
  },
  muscleGroups: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
});
