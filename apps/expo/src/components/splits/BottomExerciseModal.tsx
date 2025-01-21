import { useCallback } from 'react';
import { Divider, Text } from 'react-native-paper';

import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { Platform, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fontFamilies, typography } from '~/lib/utils/typography';
import colors from '~/lib/utils/colors';
import Button from '../ui/Button';
import { ANDROID_BOTTOM_PADDING } from '~/lib/utils/constants';

export default function ExerciseBottomSheet({
  sheetRef,
  handleChangeSetRep,
  handleDelete,
}: {
  sheetRef: React.RefObject<BottomSheetModal>;
  handleChangeSetRep: () => void;
  handleDelete: () => void;
}) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
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
      enableDynamicSizing={true}
    >
      <BottomSheetView
        style={[
          styles.container,
          {
            paddingBottom:
              Platform.OS === 'ios' ? insets.bottom : ANDROID_BOTTOM_PADDING,
          },
        ]}
      >
        <Text style={styles.title}>{t('splits.exerciseSettings')}</Text>
        <Divider style={styles.divider} />
        <View style={styles.buttonContainer}>
          <Button onPress={handleChangeSetRep} type="secondary">
            {t('exercises.changeSetRep')}
          </Button>
          <Button onPress={handleDelete}>{t('exercises.delete')}</Button>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 24,
  },
  title: {
    textAlign: 'center',
    fontSize: typography.h4.fontSize,
    lineHeight: typography.h4.lineHeight,
    fontFamily: fontFamilies.bold,
    color: colors.text.general.light,
  },
  divider: {
    backgroundColor: colors.border.light,
    height: 1.5,
  },
  buttonContainer: {
    justifyContent: 'space-between',
    gap: 16,
  },
});
