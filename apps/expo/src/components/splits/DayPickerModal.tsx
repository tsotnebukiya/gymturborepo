import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { useSplitDayConstants, type SplitDayKey } from '~/lib/utils/constants';
import { useState, useEffect } from 'react';

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
          <View style={styles.header}>
            <Text variant="titleMedium">Select Weekday</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Text style={styles.closeButton}>✕</Text>
            </Pressable>
          </View>

          <Picker
            selectedValue={tempSelectedDay}
            onValueChange={(value) => {
              setTempSelectedDay(value as SplitDayKey);
            }}
          >
            {Object.entries(splitDayConstants).map(([key, label]) => (
              <Picker.Item key={key} label={label} value={key} />
            ))}
          </Picker>
          <Button
            mode="contained"
            onPress={handleConfirm}
            style={styles.confirmButton}
            loading={loading}
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
