import { StyleSheet, View, Dimensions } from 'react-native';
import { Skeleton } from 'moti/skeleton';
import TopBar from '../common/TopBar';
import { router } from 'expo-router';

const horizontalPadding = 32;
const containerWidth = Dimensions.get('window').width - horizontalPadding;
const videoHeight = (containerWidth / 16) * 9;

export default function ExerciseSkeleton() {
  const handleBack = () => {
    router.back();
  };
  return (
    <View>
      <TopBar
        statusBarHeight={0}
        title={''}
        borderBottomColor="#E0E0E0"
        backAction={{
          icon: 'arrow-left',
          onPress: handleBack,
        }}
      />
      <View style={styles.container}>
        <View style={styles.rowContainer}>
          <View style={styles.infoContainer}>
            {/* Description placeholder */}
            <Skeleton colorMode="light" width={200} height={20} radius={4} />
            <View style={{ height: 8 }} />
            <Skeleton colorMode="light" width={240} height={20} radius={4} />
            <View style={{ height: 8 }} />
            <Skeleton colorMode="light" width={180} height={20} radius={4} />
          </View>
          <View style={styles.divider} />
          <View style={styles.percentagesContainer}>
            <View style={styles.percentagesGrid}>
              {/* Muscle percentages placeholders */}
              {Array(4)
                .fill(0)
                .map((_, index) => (
                  <View key={index} style={styles.percentageItem}>
                    <Skeleton
                      colorMode="light"
                      width={48}
                      height={48}
                      radius={24}
                    />
                    <Skeleton
                      colorMode="light"
                      width={30}
                      height={16}
                      radius={4}
                    />
                  </View>
                ))}
            </View>
          </View>
        </View>

        {/* Video placeholder */}
        <View style={[styles.videoContainer, { height: videoHeight }]}>
          <Skeleton colorMode="light" width="100%" height="100%" radius={16} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderRadius: 16,
    padding: 16,
  },
  infoContainer: {
    flex: 1,
  },
  percentagesContainer: {
    width: 124,
  },
  percentagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'flex-end',
  },
  percentageItem: {
    alignItems: 'center',
    gap: 4,
    width: 56,
  },
  videoContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  divider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 16,
  },
});
