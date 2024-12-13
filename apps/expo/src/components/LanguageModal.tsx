import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Divider, Text } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { changeLanguage, resources, type LanguageCode } from '~/i18n';
import { useTranslation } from 'react-i18next';
import { api } from '~/lib/utils/api';
import colors from '~/lib/utils/colors';
import { fontFamilies, typography } from '~/lib/utils/typography';
import Button from './ui/Button';
import Gradient from './ui/Gradient';

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
          <Gradient />
          <View style={styles.header}>
            <Text style={styles.headerText}>
              {t('settings.selectLanguage')}
            </Text>
          </View>
          <Divider style={styles.divider} />
          <Picker
            itemStyle={styles.pickerItem}
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
          <Divider style={styles.divider} />
          <Button onPress={handleConfirm}>{t('common.confirm')}</Button>
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
  divider: {
    backgroundColor: colors.border.light,
    height: 1.5,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: typography.h4.fontSize,
    lineHeight: typography.h4.lineHeight,
    fontFamily: fontFamilies.bold,
    color: colors.text.general.light,
  },
  modalContent: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: '90%',
    overflow: 'hidden',
  },
  pickerItem: {
    fontSize: typography.h4.fontSize,
    lineHeight: typography.h4.lineHeight,
    fontFamily: fontFamilies.semiBold,
    color: colors.text.general.brand,
  },
  closeButton: {
    position: 'absolute',
    borderWidth: 1.5,
    right: -12,
  },
  confirmButton: {
    marginTop: 20,
  },
});
