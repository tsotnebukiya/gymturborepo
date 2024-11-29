import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  visible: boolean;
  onClose: () => void;
  initialReps: number;
  initialSets: number;
  onConfirm: (reps: number, sets: number) => void;
  isLoading?: boolean;
}

export default function RepsSetsModal({
  visible,
  onClose,
  initialReps,
  initialSets,
  onConfirm,
  isLoading,
}: Props) {
  const [tempReps, setTempReps] = useState(initialReps);
  const [tempSets, setTempSets] = useState(initialSets);
  const { t } = useTranslation();

  const handleConfirm = () => {
    onConfirm(tempReps, tempSets);
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
            <Text variant="titleMedium">{t('splits.repsAndSets.title')}</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Text style={styles.closeButton}>{t('common.close')}</Text>
            </Pressable>
          </View>

          <View style={styles.pickersContainer}>
            <View style={styles.pickerWrapper}>
              <Text variant="labelMedium">{t('splits.repsAndSets.sets')}</Text>
              <Picker
                selectedValue={tempSets}
                onValueChange={(value) => setTempSets(Number(value))}
                style={styles.picker}
              >
                {Array.from({ length: 5 }, (_, i) => i + 1).map((num) => (
                  <Picker.Item key={num} label={num.toString()} value={num} />
                ))}
              </Picker>
            </View>
            <View style={styles.pickerWrapper}>
              <Text variant="labelMedium">{t('splits.repsAndSets.reps')}</Text>
              <Picker
                selectedValue={tempReps}
                onValueChange={(value) => setTempReps(Number(value))}
                style={styles.picker}
              >
                {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                  <Picker.Item key={num} label={num.toString()} value={num} />
                ))}
              </Picker>
            </View>
          </View>

          <Button
            mode="contained"
            onPress={handleConfirm}
            style={styles.confirmButton}
            loading={isLoading}
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
  pickersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  pickerWrapper: {
    flex: 1,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  picker: {
    width: '100%',
  },
  confirmButton: {
    marginTop: 8,
  },
});
