import { keepPreviousData } from '@tanstack/react-query';
import GradientLayout from '~/components/shared/GradientLayout';
import ScrollView from '~/components/shared/ScrollView';
import { useCurrentLanguage } from '~/i18n';
import { api } from '~/lib/utils/api';
import { useAppContext } from '~/lib/contexts/AppContext';
import TopBar from '~/components/shared/TopBar';
import { useRouter } from 'expo-router';
import LatestGenerations from '~/components/homepage/LatestGenerations';
import MuscleCategories from '~/components/homepage/MuscleCategories';
import { StyleSheet, View } from 'react-native';
import RecommendedExercises from '~/components/homepage/RecommendedEx';

export default function HomeScreen() {
  const router = useRouter();
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
    router.push('/(auth)/support');
  };
  return (
    <GradientLayout>
      <ScrollView onRefresh={handleRefresh}>
        <TopBar
          logo={true}
          title={'GymLead AI'}
          inset={false}
          barBorder={true}
          actions={[
            {
              icon: require('~/assets/icons/chat.png'),
              mode: 'outlined',
              onPress: handleSupport,
            },
          ]}
        />
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
    paddingTop: 12,
    paddingHorizontal: 12,
  },
});
