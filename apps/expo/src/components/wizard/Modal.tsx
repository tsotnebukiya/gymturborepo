import { Image, Modal, Pressable, StyleSheet, View } from 'react-native';
import colors from '~/lib/utils/colors';
import { Card, Text } from 'react-native-paper';
import { useAppContext } from '~/lib/contexts/AppContext';
import { useTranslation } from 'react-i18next';
import { fontFamilies, typography } from '~/lib/utils/typography';

export default function WizardModal({
  handleGallery,
  handleCamera,
  onDismiss,
}: {
  handleGallery: () => void;
  handleCamera: () => void;
  onDismiss?: () => void;
}) {
  const { t } = useTranslation();
  const { wizardVisible, setWizardVisible } = useAppContext();
  const hideModal = () => {
    setWizardVisible(false);
  };

  return (
    <Modal
      visible={wizardVisible}
      transparent
      statusBarTranslucent
      animationType="fade"
      presentationStyle="overFullScreen"
      onRequestClose={hideModal}
      onDismiss={onDismiss}
    >
      <Pressable style={styles.modalOverlay} onPress={hideModal}>
        <View
          style={styles.modalContent}
          onStartShouldSetResponder={() => true}
        >
          <View style={styles.topRow}>
            <Pressable
              onPress={handleGallery}
              style={({ pressed }) => [pressed && styles.pressed]}
            >
              <Card style={styles.card}>
                <Image
                  source={require('~/assets/icons/gallery.png')}
                  style={styles.icon}
                />
                <Text style={styles.text}>{t('wizard.gallery')}</Text>
              </Card>
            </Pressable>
            <Pressable
              onPress={handleCamera}
              style={({ pressed }) => [pressed && styles.pressed]}
            >
              <Card style={styles.card}>
                <Image
                  source={require('~/assets/icons/camera.png')}
                  style={styles.icon}
                />
                <Text style={styles.text}>{t('wizard.takePhoto')}</Text>
              </Card>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    transform: [{ scale: 0.95 }],
  },
  modalContent: {
    overflow: 'hidden',
    bottom: 132,
    position: 'absolute',
  },
  icon: {
    width: 60,
    height: 60,
    alignSelf: 'center',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  card: {
    width: 125,
    height: 125,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFEFD',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  text: {
    textAlign: 'center',
    fontSize: typography.medium.fontSize,
    lineHeight: typography.medium.lineHeight,
    fontFamily: fontFamilies.semiBold,
    color: colors.primary[900],
  },
});
