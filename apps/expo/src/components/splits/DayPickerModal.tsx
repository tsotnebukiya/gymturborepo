import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Divider, Text } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { useSplitDayConstants, type SplitDayKey } from '~/lib/utils/constants';
import { useState, useEffect } from 'react';
import colors from '~/lib/utils/colors';
import Gradient from '../ui/Gradient';
import { typography } from '~/lib/utils/typography';
import { fontFamilies } from '~/lib/utils/typography';
import Button from '../ui/Button';
import { useTranslation } from 'react-i18next';

interface Props {
  visible: boolean;
  loading?: boolean;
  onClose?: () => void;
  selectedDay?: SplitDayKey;
  onSelectDay: (day: SplitDayKey) => void;
}

export default function DayPickerModal({
  visible,
  loading,
  onClose,
  selectedDay,
  onSelectDay,
}: Props) {
  const splitDayConstants = useSplitDayConstants();
  const { t } = useTranslation();
  const [tempSelectedDay, setTempSelectedDay] = useState<
    SplitDayKey | undefined
  >(selectedDay);

  useEffect(() => {
    setTempSelectedDay(selectedDay);
  }, [selectedDay]);

  const handleConfirm = () => {
    if (tempSelectedDay) {
      onSelectDay(tempSelectedDay);
      onClose?.();
    }
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
            <Text style={styles.headerText}>{t('splits.selectWeekday')}</Text>
          </View>
          <Divider style={styles.divider} />
          <Picker
            itemStyle={styles.pickerItem}
            selectedValue={tempSelectedDay}
            onValueChange={(value) => {
              setTempSelectedDay(value as SplitDayKey);
            }}
          >
            {Object.entries(splitDayConstants).map(([key, label]) => (
              <Picker.Item key={key} label={label} value={key} />
            ))}
          </Picker>
          <Divider style={styles.divider} />

          <Button
            onPress={handleConfirm}
            loading={loading}
            style={styles.confirmButton}
          >
            {t('common.confirm')}
          </Button>
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
  modalContent: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: '90%',
    overflow: 'hidden',
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
  divider: {
    backgroundColor: colors.border.light,
    height: 1.5,
  },
  pickerItem: {
    fontSize: typography.h4.fontSize,
    lineHeight: typography.h4.lineHeight,
    fontFamily: fontFamilies.semiBold,
    color: colors.text.general.brand,
  },
  confirmButton: {
    marginTop: 20,
  },
});
