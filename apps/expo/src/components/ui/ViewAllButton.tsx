import { Pressable, StyleSheet } from 'react-native';
import { Icon, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { fontFamilies, typography } from '~/lib/utils/typography';
import colors from '~/lib/utils/colors';

export default function ViewAllButton({ onPress }: { onPress: () => void }) {
  const { t } = useTranslation();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.viewAllButton, pressed && styles.pressed]}
    >
      <Text style={styles.buttonText}>{t('home.viewAll')}</Text>
      <Icon source="arrow-right" size={24} color={colors.text.general.light} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
    gap: 8,
  },
  buttonText: {
    fontSize: typography.large.fontSize,
    lineHeight: typography.large.lineHeight,
    fontFamily: fontFamilies.bold,
    color: colors.text.general.brand,
  },
  pressed: {
    borderBottomWidth: 1,
    borderBottomColor: colors.text.general.greyscale,
  },
});
