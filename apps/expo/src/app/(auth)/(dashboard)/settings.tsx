import { useAuth } from '@clerk/clerk-expo';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import GradientLayout from '~/components/shared/GradientLayout';
import { useTranslation } from 'react-i18next';
import LanguageModal from '~/components/LanguageModal';
import { useState } from 'react';

export default function SettingsScreen() {
  const { signOut } = useAuth();
  const { t } = useTranslation();
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const toggleLanguageModal = () => setLanguageModalVisible((prev) => !prev);
  return (
    <GradientLayout>
      <View style={styles.container}>
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => setLanguageModalVisible(true)}
        >
          {t('settings.changeLanguage')}
        </Button>
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => signOut()}
        >
          {t('settings.signOut')}
        </Button>
      </View>
      <LanguageModal
        visible={languageModalVisible}
        onClose={toggleLanguageModal}
      />
    </GradientLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 20,
  },
  button: {
    width: '100%',
  },
});
