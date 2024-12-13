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

export default function SplitItem({
  item,
}: {
  item: RouterOutputs['split']['getAll']['splits'][number];
}) {
  const { language } = useCurrentLanguage();
  const musclesConstants = useMusclesConstants();
  const splitDayConstants = useSplitDayConstants();
  const { t } = useTranslation();
  console.log(splitDayConstants);
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
      <View style={styles.splitContent}>
        <View style={styles.row}>
          <Text style={styles.splitTitle} variant="titleMedium">
            {item.name}
          </Text>

          <View style={styles.dayContainer}>
            <Ionicons name="calendar-outline" size={14} color="#666666" />
            <Text style={styles.splitDay} variant="bodyMedium">
              {splitDayConstants[item.day]}
            </Text>
          </View>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detail}>
            <Ionicons name="barbell-outline" size={14} color="#666666" />
            <Text style={styles.detailText}>
              {item.exercisesCount} {t('exercises.exercises')}
            </Text>
          </View>
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
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  splitItem: {
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
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
  },
  dayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
  splitDay: {
    fontSize: 14,
    color: '#666666',
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#666666',
  },
  muscleGroups: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  muscleTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  muscleText: {
    fontSize: 14,
    color: '#4a4a4a',
  },
});
