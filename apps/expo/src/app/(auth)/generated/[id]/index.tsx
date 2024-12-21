import { keepPreviousData } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { api } from '~/lib/utils/api';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import Gradient from '~/components/ui/Gradient';
import { Skeleton } from 'moti/skeleton';
import TopBar from '~/components/shared/TopBar';
import { router } from 'expo-router';
import ExerciseItem from '~/components/exercises/Item';
import ScrollView from '~/components/shared/ScrollView';
import { Text } from 'react-native-paper';
import ExerciseListSkeleton from '~/components/exercises/SkeletonList';
import { useCurrentLanguage } from '~/i18n';
import { useTranslation } from 'react-i18next';

const { height } = Dimensions.get('window');

function NoExercises() {
  const { t } = useTranslation();
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{t('errors.noExercisesGenerated')}</Text>
    </View>
  );
}

export default function GeneratedItemScreen() {
  const { id } = useLocalSearchParams();
  const { language } = useCurrentLanguage();
  const { data, isLoading } = api.generation.getOne.useQuery(
    {
      id: Number(id),
      language,
    },
    {
      placeholderData: keepPreviousData,
    }
  );
  const handleBack = () => {
    router.back();
  };
  const handleSupport = () => {
    router.push({
      pathname: '/(auth)/support',
      params: { generationId: id },
    });
  };
  const handleItemPress = (id: number) => {
    router.push({
      pathname: '/(auth)/generated/[id]/[exercise]',
      params: { exercise: id, id },
    });
  };
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {!data?.image ? (
          <Skeleton width="100%" height="100%" colorMode={'light'} />
        ) : (
          <Image
            source={{ uri: data.image }}
            style={[styles.image]}
            resizeMode="cover"
          />
        )}
      </View>
      <View style={[styles.contentOuter]}>
        <Gradient />
        <View style={styles.listContainer}>
          <TopBar
            inset={false}
            title={data?.name ? `${data.name}` : ''}
            barBorder={true}
            backAction={{
              icon: 'arrow-left',
              onPress: handleBack,
            }}
            actions={[
              {
                icon: 'alert-circle',
                onPress: handleSupport,
              },
            ]}
          />
          <ScrollView tabBarPadding={false}>
            <View style={styles.contentContainer}>
              {isLoading ? (
                <ExerciseListSkeleton />
              ) : !data?.exercise.length ? (
                <NoExercises />
              ) : (
                <View style={styles.exercisesContainer}>
                  {data.exercise.map((exercise, index) => (
                    <ExerciseItem
                      data={exercise}
                      key={index}
                      handlePress={handleItemPress}
                    />
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    height: height * 0.25,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentOuter: {
    flex: 1,
  },
  hidden: {
    opacity: 0,
  },
  listContainer: {
    flex: 1,
  },
  video: {
    alignSelf: 'center',
    width: 320,
    height: 200,
  },
  contentContainer: {
    paddingHorizontal: 12,
    paddingTop: 24,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
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
  exerciseItemPressed: {
    backgroundColor: '#f5f5f5',
  },
  exerciseImage: {
    width: 140,
    height: 90,
    borderRadius: 12,
  },
  exercisesContainer: {
    gap: 20,
  },
  exerciseContent: {
    flex: 1,
    gap: 10,
    justifyContent: 'center',
    height: 90,
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  muscleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  muscleIcon: {
    width: 48,
    height: 48,
  },
  muscleText: {
    color: '#666666',
    fontSize: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
  },
});
