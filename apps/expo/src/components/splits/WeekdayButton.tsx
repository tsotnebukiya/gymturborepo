import { Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from 'react-native-paper';
import { useSplitDayConstants, type SplitDayKey } from '~/lib/utils/constants';
import { fontFamilies, typography } from '~/lib/utils/typography';
import colors from '~/lib/utils/colors';

export default function WeekdayButton({
  selectedDay,
  onPress,
}: {
  selectedDay: SplitDayKey;
  onPress: () => void;
}) {
  const splitDayConstants = useSplitDayConstants();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.daySelector,
        pressed && styles.daySelectorPressed,
      ]}
      onPress={onPress}
    >
      <MaterialCommunityIcons name="calendar" size={24} color="#757575" />
      <Text style={styles.daySelectorText}>
        {splitDayConstants[selectedDay]}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  daySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 16,
    gap: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  daySelectorPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
    backgroundColor: '#f5f5f5',
  },
  daySelectorText: {
    fontSize: typography.large.fontSize,
    lineHeight: typography.large.lineHeight,
    fontFamily: fontFamilies.bold,
    color: colors.text.general.brand,
  },
});
