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

export default function HomeScreen() {
  const router = useRouter();
  const { language } = useCurrentLanguage();
  const { setWizardVisible } = useAppContext();
  const { data, isLoading, refetch } = api.generation.getAll.useQuery(
    {
      language,
    },
    {
      placeholderData: keepPreviousData,
    }
  );
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
    await refetch();
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
            isLoading={isLoading}
            data={data}
            handleCTA={handleCTA}
          />
          <MuscleCategories />
        </View>
      </ScrollView>
    </GradientLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
    paddingTop: 12,
  },
});
