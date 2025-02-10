import { Image, Pressable, StyleSheet, Modal, View } from 'react-native';
import colors from '~/lib/utils/colors';
import { Card, IconButton, Text } from 'react-native-paper';
import { useAppContext } from '~/lib/contexts/AppContext';
import { useTranslation } from 'react-i18next';
import { fontFamilies, typography } from '~/lib/utils/typography';
import { useState } from 'react';
import React from 'react';

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
  const [showImage, setShowImage] = useState(false);
  const handleImage = () => {
    setShowImage(true);
  };
  const closeImage = () => {
    setShowImage(false);
  };
  const hideModal = () => {
    setShowImage(false);
    setWizardVisible(false);
  };
  return (
    <Modal
      visible={wizardVisible}
      transparent
      statusBarTranslucent
      presentationStyle="overFullScreen"
      onRequestClose={hideModal}
      onDismiss={onDismiss}
    >
      <Pressable style={styles.modalOverlay} onPress={hideModal}>
        <View
          style={styles.modalContent}
          onStartShouldSetResponder={() => true}
        >
          {showImage ? (
            <View style={styles.imageContainer}>
              <Image
                style={{
                  width: '100%',
                  height: '100%',
                  resizeMode: 'cover',
                }}
                width={340}
                height={245}
                source={require('~/assets/example.jpg')}
              />

              <IconButton
                icon={'close'}
                style={styles.closeButton}
                onPress={closeImage}
              />
            </View>
          ) : (
            <>
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
              <View style={styles.infoContainer}>
                <Text style={styles.infoText}>
                  {t(
                    'wizard.guide',
                    'Take a clear photo of the gym equipment from the side in good lighting'
                  )}
                </Text>
                <IconButton
                  icon="information"
                  onPress={handleImage}
                  size={24}
                />
              </View>
            </>
          )}
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
    overflow: 'visible',
    bottom: 132,
    position: 'absolute',
    width: '85%',
    zIndex: 0,
  },
  icon: {
    width: 60,
    height: 60,
    alignSelf: 'center',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
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
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFEFD',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 20,
    width: 290,
    alignSelf: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  infoText: {
    textAlign: 'center',
    flex: 1,
    color: 'black',
    fontSize: typography.medium.fontSize,
    lineHeight: typography.medium.lineHeight,
    fontFamily: fontFamilies.medium,
  },
  imageContainer: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    height: 270,
    zIndex: 1,
    overflow: 'hidden',
    borderRadius: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});
