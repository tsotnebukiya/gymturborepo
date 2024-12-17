import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { fontFamilies, typography } from '~/lib/utils/typography';
import colors from '~/lib/utils/colors';
import { type RouterOutputs } from '@acme/api';
import ExerciseListSkeleton from '../exercises/SkeletonList';
import ExerciseItem from '../exercises/Item';
import ViewAllButton from '../ui/ViewAllButton';
import { useRouter } from 'expo-router';

interface Props {
  isLoading: boolean;
  data?: RouterOutputs['exercise']['getRandom'];
}

export default function RecommendedExercises({ isLoading, data }: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const onPress = () => {
    router.push({ pathname: '/(auth)/category', params: { type: 'new' } });
  };
  return (
    <View style={styles.generations}>
      <View style={styles.topContainer}>
        <Text style={styles.title}>{t('home.recommendedExercises')}</Text>
        <ViewAllButton onPress={onPress} />
      </View>
      {isLoading ? (
        <ExerciseListSkeleton />
      ) : (
        <View style={styles.exercisesContainer}>
          {data?.map((exercise, index) => (
            <ExerciseItem data={exercise} key={index} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  generations: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exercisesContainer: {
    gap: 20,
  },
  title: {
    fontSize: typography.h5.fontSize,
    lineHeight: typography.h5.lineHeight,
    fontFamily: fontFamilies.bold,
    color: colors.text.general.light,
    flex: 1,
  },
});
