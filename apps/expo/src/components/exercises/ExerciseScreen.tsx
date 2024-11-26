import { StyleSheet, View, Image } from 'react-native';
import { api, type RouterOutputs } from '~/utils/api';
import TopBar from '~/components/common/TopBar';
import { router } from 'expo-router';
import { musclesConstants } from '~/utils/constants';
import { Text } from 'react-native-paper';
import ExerciseSkeleton from './SkeletonItem';
import VideoPlayer from './VideoPlayer';
import ScrollView from '../common/ScrollView';
import { useCurrentLanguageEnum } from '~/i18n';

type GenerationData = RouterOutputs['exercise']['getOne'];

interface Props {
  data?: GenerationData;
}

export default function ExerciseView({ data }: Props) {
  const language = useCurrentLanguageEnum();
  const utils = api.useUtils();
  const { mutate: bookmark, isPending } = api.bookmark.bookmark.useMutation({
    onSettled: async () => {
      void utils.bookmark.getAll.invalidate({});
      await utils.exercise.getOne.invalidate({
        id: data?.exerciseId,
        language,
      });
    },
  });

  if (!data) {
    return <ExerciseSkeleton />;
  }

  const handleBookmark = () => {
    bookmark({ exerciseId: data.exerciseId });
  };
  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <TopBar
        statusBarHeight={0}
        title={`${data.name}`}
        borderBottomColor="#E0E0E0"
        backAction={{
          icon: 'arrow-left',
          onPress: handleBack,
        }}
        actions={[
          {
            icon: data.isSaved ? 'bookmark' : 'bookmark-outline',
            onPress: handleBookmark,
            loading: isPending,
          },
        ]}
      />
      <ScrollView>
        <View style={styles.contentContainer}>
          <View style={styles.rowContainer}>
            <View style={styles.infoContainer}>
              <Text style={styles.description}>{data.description}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.percentagesContainer}>
              <View style={styles.percentagesGrid}>
                {data.musclePercentages.map((muscle, index) => (
                  <View key={index} style={styles.percentageItem}>
                    <Image
                      source={musclesConstants[muscle.subcategory].icon}
                      style={styles.muscleIcon}
                    />
                    <Text style={styles.percentageText}>
                      {muscle.percentage}%
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
          <VideoPlayer />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    gap: 32,
    marginTop: 32,
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
  description: {
    fontSize: 15,
    textAlign: 'auto',
    color: '#666666',
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
  muscleIcon: {
    width: 48,
    height: 48,
  },
  percentageText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '600',
  },
  divider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 16,
  },
});
