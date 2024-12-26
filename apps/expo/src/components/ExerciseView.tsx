import { StyleSheet, View, Image } from 'react-native';
import { api, type RouterOutputs } from '~/lib/utils/api';
import TopBar from '~/components/shared/TopBar';
import { router } from 'expo-router';
import { useMusclesConstants } from '~/lib/utils/constants';
import { Text } from 'react-native-paper';
import ExerciseSkeleton from './exercises/SkeletonItem';
import VideoPlayer from './exercises/VideoPlayer';
import ScrollView from './shared/ScrollView';
import { useCurrentLanguage } from '~/i18n';
import Gradient from './ui/Gradient';
import colors from '~/lib/utils/colors';
import { fontFamilies, typography } from '~/lib/utils/typography';

type ExerciseData = RouterOutputs['exercise']['getOne'];

interface Props {
  data?: ExerciseData;
}

export default function ExerciseView({ data }: Props) {
  const { language } = useCurrentLanguage();
  const musclesConstants = useMusclesConstants();
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
      <Gradient />
      <TopBar
        inset={false}
        title={`${data.name}`}
        barBorder={true}
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
                      {muscle.percentage}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
          <VideoPlayer
            videoId={data.videoId}
            startSeconds={data.videoStart}
            endSeconds={data.videoEnd}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 12,
  },
  contentContainer: {
    gap: 24,
    marginTop: 24,
    paddingHorizontal: 12,
  },
  rowContainer: {
    // flexDirection: 'row',
    gap: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  infoContainer: {
    flex: 1,
  },
  description: {
    fontSize: typography.large.fontSize,
    lineHeight: typography.large.lineHeight,
    fontFamily: fontFamilies.regular,
    textAlign: 'left',
    color: colors.text.general.greyscale,
  },
  percentagesContainer: {
    justifyContent: 'center',
  },
  percentagesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  percentageItem: {
    alignItems: 'center',
    gap: 4,
  },
  muscleIcon: {
    width: 48,
    height: 48,
  },
  percentageText: {
    fontSize: typography.medium.fontSize,
    lineHeight: typography.medium.lineHeight,
    fontFamily: fontFamilies.regular,
    color: colors.text.general.greyscale,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.border.light,
    // marginHorizontal: 12,
  },
});
