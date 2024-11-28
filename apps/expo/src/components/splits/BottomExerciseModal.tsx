import { useCallback, useMemo } from 'react';
import { Text } from 'react-native-paper';

import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { Pressable, StyleSheet } from 'react-native';

export default function ExerciseBottomSheet({
  sheetRef,
  handleChangeSetRep,
  handleDelete,
}: {
  sheetRef: React.RefObject<BottomSheetModal>;
  handleChangeSetRep: () => void;
  handleDelete: () => void;
}) {
  const snapPoints = useMemo(() => ['20%'], []);
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={sheetRef}
      backdropComponent={renderBackdrop}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
    >
      <BottomSheetView style={styles.container}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.changeButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleChangeSetRep}
        >
          <Text style={styles.buttonText}>Change Set/Rep</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.deleteButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleDelete}
        >
          <Text style={[styles.buttonText]}>Delete</Text>
        </Pressable>
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  button: {
    width: '100%',
    padding: 14,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  changeButton: {
    backgroundColor: '#6842FF', // Your primary color
  },
  deleteButton: {
    backgroundColor: '#DC2626', // Darker red
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});
