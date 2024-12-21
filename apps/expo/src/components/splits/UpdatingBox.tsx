import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { View } from 'react-native';
import { Text } from 'react-native-paper';
import colors from '~/lib/utils/colors';

export default function UpdatingBox() {
  const { t } = useTranslation();
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="small" color={colors.menuBarIcon.active} />
      <Text>{t('splits.updatingExercises')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    padding: 16,
    backgroundColor: colors.secondary[100],
    borderRadius: 12,
  },
});
