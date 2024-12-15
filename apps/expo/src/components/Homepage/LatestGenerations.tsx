import { StyleSheet, View } from 'react-native';
import GenerationItem from '~/components/homepage/Item';
import { Text } from 'react-native-paper';
import CTABox from '~/components/shared/CTABox';
import GenerationSkeleton from '~/components/homepage/Skeleton';
import { useTranslation } from 'react-i18next';
import { fontFamilies, typography } from '~/lib/utils/typography';
import colors from '~/lib/utils/colors';
import { type RouterOutputs } from '@acme/api';

interface Props {
  isLoading: boolean;
  data?: RouterOutputs['generation']['getAll'];
  handleCTA: () => void;
}

export default function LatestGenerations({
  isLoading,
  data,
  handleCTA,
}: Props) {
  const { t } = useTranslation();
  return (
    <View style={styles.generations}>
      <Text style={styles.title}>{t('home.latestGenerations')}</Text>
      <View style={styles.generationsContainer}>
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <GenerationSkeleton key={index} />
          ))
        ) : data?.length ? (
          data.map((generation) => (
            <GenerationItem key={generation.id} data={generation} />
          ))
        ) : (
          <CTABox
            title={t('home.noGenerations')}
            description={t('home.createFirst')}
            buttonText={t('home.createFirstButton')}
            onPress={handleCTA}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  generations: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  generationsContainer: {
    gap: 20,
  },
  title: {
    fontSize: typography.h5.fontSize,
    lineHeight: typography.h5.lineHeight,
    fontFamily: fontFamilies.bold,
    color: colors.text.general.light,
  },
});
