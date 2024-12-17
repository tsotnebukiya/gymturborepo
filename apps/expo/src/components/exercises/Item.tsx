import { Image, StyleSheet, View, Pressable } from 'react-native';
import { api, type RouterOutputs } from '~/lib/utils/api';
import { router } from 'expo-router';
import { useMusclesConstants } from '~/lib/utils/constants';
import { Text, IconButton } from 'react-native-paper';
import { useCurrentLanguage } from '~/i18n';
import { useTranslation } from 'react-i18next';
import colors from '~/lib/utils/colors';
import { fontFamilies, typography } from '~/lib/utils/typography';

export type GenerationData = NonNullable<
  RouterOutputs['generation']['getOne']
>['exercise'][number];

interface Props {
  data: GenerationData;
  showSets?: boolean;
  onSwipe?: (id: number) => void;
  handlePress?: (id: number, exercise: GenerationData) => void;
  handleMoreOptions?: (id: number, exercise: GenerationData) => void;
  replace?: boolean;
}

export default function ExerciseItem({
  data,
  showSets,
  handlePress,
  handleMoreOptions,
}: Props) {
  const { language } = useCurrentLanguage();
  const { t } = useTranslation();
  const musclesConstants = useMusclesConstants();
  api.exercise.getOne.usePrefetchQuery({ id: data.id, language });
  const exercise = data;

  const handleItemPress = (id: number) => {
    if (handlePress) {
      handlePress(id, exercise);
    } else {
      router.push({
        pathname: `/(auth)/exercise/[id]`,
        params: { id },
      });
    }
  };
  return (
    <Pressable
      onPress={() => handleItemPress(exercise.id)}
      style={({ pressed }) => [
        styles.exerciseItem,
        pressed && styles.exerciseItemPressed,
      ]}
    >
      <Image
        source={{
          uri: `https://img.youtube.com/vi/${data.videoId}/maxresdefault.jpg`,
        }}
        style={styles.exerciseImage}
      />
      <View style={styles.exerciseContent}>
        <Text
          style={styles.exerciseTitle}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {exercise.name}
        </Text>
        {showSets ? (
          <View style={styles.setsContainerBordered}>
            <View style={styles.setRepBordered}>
              <Text style={styles.setRepTextBordered}>{data.sets}</Text>
              <Text style={styles.setRepLabelBordered}>
                {t('splits.repsAndSets.sets')}
              </Text>
            </View>
            <View style={styles.setRepBordered}>
              <Text style={styles.setRepTextBordered}>{data.reps}</Text>
              <Text style={styles.setRepLabelBordered}>
                {t('splits.repsAndSets.reps')}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.muscleGroup}>
            <Image
              source={musclesConstants[exercise.subcategory].icon}
              style={styles.muscleIcon}
            />
            <Text
              variant="bodyMedium"
              style={styles.muscleText}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {musclesConstants[exercise.subcategory].label}
            </Text>
          </View>
        )}
      </View>
      {handleMoreOptions ? (
        <IconButton
          icon="dots-vertical"
          size={24}
          style={styles.kebabButton}
          iconColor={colors.text.general.light}
          onPress={() => handleMoreOptions(exercise.id, exercise)}
        />
      ) : (
        <IconButton
          iconColor={colors.text.general.light}
          icon="chevron-right"
          size={24}
          style={styles.kebabButton}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 2,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  exerciseItemPressed: {
    backgroundColor: colors.surfaceLight,
  },
  exerciseImage: {
    width: 100,
    height: 100,
    borderRadius: 6,
  },
  exerciseContent: {
    flex: 1,
    marginLeft: 16,
    gap: 6,
    alignSelf: 'stretch',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
  },
  kebabButton: {
    margin: 0,
  },
  exerciseTitle: {
    fontSize: typography.h5.fontSize,
    lineHeight: typography.h5.lineHeight,
    fontFamily: fontFamilies.bold,
    color: colors.text.general.light,
  },
  muscleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  muscleIcon: {
    width: 48,
    height: 48,
  },
  muscleText: {
    fontSize: typography.medium.fontSize,
    lineHeight: typography.medium.lineHeight,
    fontFamily: fontFamilies.regular,
    color: colors.text.general.greyscale,
    flex: 1,
  },
  setsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  setsContainerBordered: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  setRepBordered: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 6,
    minWidth: 60,
    alignItems: 'center',
  },
  setRepTextBordered: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  setRepLabelBordered: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});
