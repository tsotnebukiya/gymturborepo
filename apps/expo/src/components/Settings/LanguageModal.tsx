import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { changeLanguage, resources, type LanguageCode } from '~/i18n';
import { useTranslation } from 'react-i18next';
import { api } from '~/utils/api';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function LanguageModal({ visible, onClose }: Props) {
  const utils = api.useUtils();
  const { t, i18n } = useTranslation();
  const [tempSelectedLang, setTempSelectedLang] = useState<LanguageCode>(
    i18n.language as LanguageCode
  );

  const handleConfirm = async () => {
    await changeLanguage(tempSelectedLang);
    void utils.invalidate();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="fade"
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View
          style={styles.modalContent}
          onStartShouldSetResponder={() => true}
        >
          <View style={styles.header}>
            <Text variant="titleMedium">{t('settings.selectLanguage')}</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Text style={styles.closeButton}>✕</Text>
            </Pressable>
          </View>

          <Picker
            selectedValue={tempSelectedLang}
            onValueChange={(value) =>
              setTempSelectedLang(value as LanguageCode)
            }
          >
            {(Object.keys(resources) as LanguageCode[]).map((langCode) => (
              <Picker.Item
                key={langCode}
                label={t(`language.${langCode}`)}
                value={langCode}
              />
            ))}
          </Picker>
          <Button
            mode="contained"
            onPress={handleConfirm}
            style={styles.confirmButton}
          >
            Confirm
          </Button>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: '80%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginBottom: 16,
  },
  closeButton: {
    fontSize: 20,
    color: '#666',
  },
  confirmButton: {
    // marginTop: 16,
  },
});
