import { Alert, Image, Pressable, StyleSheet, View } from 'react-native';
import { useAppContext } from '../../lib/contexts/AppContext';
import { useTranslation } from 'react-i18next';
import colors from '~/lib/utils/colors';

export default function WizardButton({ isPending }: { isPending: boolean }) {
  const { t } = useTranslation();
  const { setWizardVisible } = useAppContext();
  const showModal = () => setWizardVisible(true);

  const handleFAB = () => {
    if (isPending) {
      Alert.alert(t('wizard.generationInProgress'), t('wizard.waitMessage'), [
        { text: t('buttons.ok') },
      ]);
      return;
    }
    showModal();
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handleFAB}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Image
          style={styles.image}
          source={require('~/assets/icons/wizard.png')}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 45,
    zIndex: 1,
    left: '50%',
    transform: [{ translateX: -27.5 }],
  },
  button: {
    width: 55,
    height: 55,
    borderRadius: 50,
    backgroundColor: colors.primary[400],
    shadowColor: colors.primary[400],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.9,
  },
  image: {
    width: 30,
    height: 25,
  },
});
