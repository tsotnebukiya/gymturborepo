import { keepPreviousData } from '@tanstack/react-query';
import GradientLayout from '~/components/shared/GradientLayout';
import ScrollView from '~/components/shared/ScrollView';
import { useCurrentLanguage } from '~/i18n';
import { api } from '~/lib/utils/api';
import { useAppContext } from '~/lib/contexts/AppContext';
import TopBar from '~/components/shared/TopBar';
import LatestGenerations from '~/components/Homepage/LatestGenerations';
import MuscleCategories from '~/components/Homepage/MuscleCategories';
import { StyleSheet, View } from 'react-native';
import RecommendedExercises from '~/components/Homepage/RecommendedEx';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { language } = useCurrentLanguage();
  const { setWizardVisible } = useAppContext();
  const {
    data: generationData,
    isLoading: generationIsLoading,
    refetch: generationRefetch,
  } = api.generation.getAll.useQuery(
    {
      language,
    },
    {
      placeholderData: keepPreviousData,
    }
  );
  const {
    data: exData,
    isLoading: exIsLoading,
    refetch: exRefetch,
  } = api.exercise.getRandom.useQuery({ language });
  api.bookmark.getAll.usePrefetchInfiniteQuery(
    {
      searchName: undefined,
      subcategory: undefined,
      language,
    },
    {}
  );
  api.split.getAll.usePrefetchInfiniteQuery({ language }, {});
  const handleRefresh = async () => {
    await Promise.all([generationRefetch(), exRefetch()]);
  };
  const handleCTA = () => setWizardVisible(true);
  const handleSupport = () => {
    router.push('/support');
  };
  return (
    <GradientLayout>
      <TopBar
        logo={true}
        title={'GymLead AI'}
        inset={false}
        barBorder={true}
        actions={[
          {
            icon: require('~/assets/icons/chat.png'),
            mode: 'contained',
            onPress: handleSupport,
          },
        ]}
      />
      <ScrollView onRefresh={handleRefresh}>
        <View style={styles.container}>
          <LatestGenerations
            isLoading={generationIsLoading}
            data={generationData}
            handleCTA={handleCTA}
          />
          <MuscleCategories />
          <RecommendedExercises isLoading={exIsLoading} data={exData} />
        </View>
      </ScrollView>
    </GradientLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
    paddingTop: 24,
    paddingHorizontal: 12,
  },
});
