import { StyleSheet, View, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { type RouterOutputs } from '@acme/api';
import {
  useMusclesConstants,
  useSplitDayConstants,
} from '~/lib/utils/constants';
import { router } from 'expo-router';
import { api } from '~/lib/utils/api';
import { useCurrentLanguage } from '~/i18n';
import { useTranslation } from 'react-i18next';
import colors from '~/lib/utils/colors';
import { fontFamilies, typography } from '~/lib/utils/typography';

export default function SplitItem({
  item,
}: {
  item: RouterOutputs['split']['getAll']['splits'][number];
}) {
  const { language } = useCurrentLanguage();
  const musclesConstants = useMusclesConstants();
  const splitDayConstants = useSplitDayConstants();
  const { t } = useTranslation();
  api.split.getOne.usePrefetchQuery({ id: item.id, language });
  const handlePress = () => {
    router.push({
      pathname: '/(auth)/(dashboard)/split/[splitId]',
      params: { splitId: item.id },
    });
  };
  return (
    <Pressable
      style={({ pressed }) => [
        styles.splitItem,
        pressed && styles.splitItemPressed,
      ]}
      onPress={handlePress}
    >
      <View style={styles.row}>
        <Text style={styles.splitTitle}>{item.name}</Text>

        <View style={styles.dayContainer}>
          <Ionicons name="calendar-outline" size={20} color="#757575" />
          <Text style={styles.splitDay}>{splitDayConstants[item.day]}</Text>
        </View>
      </View>

      <View style={styles.detail}>
        <Ionicons name="barbell-outline" size={22} color="#757575" />
        <Text style={styles.detailText}>
          {item.exercisesCount} {t('exercises.exercises')}
        </Text>
      </View>

      <View style={styles.muscleGroups}>
        {item.subcategories.map((muscle, index) => (
          <View key={index} style={styles.muscleTag}>
            <Text style={styles.muscleText}>
              {musclesConstants[muscle].label}
            </Text>
          </View>
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  splitItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 6,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  splitItemPressed: {
    backgroundColor: '#f5f5f5',
  },
  splitContent: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  splitTitle: {
    fontSize: typography.h5.fontSize,
    lineHeight: typography.h5.lineHeight,
    fontFamily: fontFamilies.bold,
    flex: 1,
    color: colors.text.general.light,
  },
  dayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 6,
    height: 32,
    backgroundColor: '#F6F6F6',
    borderRadius: 8,
  },
  splitDay: {
    fontSize: typography.medium.fontSize,
    lineHeight: typography.medium.lineHeight,
    fontFamily: fontFamilies.semiBold,
    color: '#757575',
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: typography.medium.fontSize,
    lineHeight: typography.medium.lineHeight,
    fontFamily: fontFamilies.regular,
    color: '#757575',
  },
  muscleGroups: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  muscleTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  muscleText: {
    fontSize: typography.medium.fontSize,
    lineHeight: typography.medium.lineHeight,
    fontFamily: fontFamilies.semiBold,
    color: colors.text.general.light,
  },
});
