import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { fontFamilies, typography } from '~/lib/utils/typography';
import colors from '~/lib/utils/colors';
import { type RouterOutputs } from '@acme/api';
import ExerciseListSkeleton from '../exercises/SkeletonList';
import ExerciseItem from '../exercises/Item';

interface Props {
  isLoading: boolean;
  data?: RouterOutputs['exercise']['getRandom'];
}

export default function RecommendedExercises({ isLoading, data }: Props) {
  const { t } = useTranslation();
  return (
    <View style={styles.generations}>
      <Text style={styles.title}>{t('home.recommendedExercises')}</Text>
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
  exercisesContainer: {
    gap: 20,
  },
  title: {
    fontSize: typography.h5.fontSize,
    lineHeight: typography.h5.lineHeight,
    fontFamily: fontFamilies.bold,
    color: colors.text.general.light,
  },
});
