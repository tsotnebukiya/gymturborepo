import { useCallback } from 'react';
import { Divider, Text } from 'react-native-paper';

import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '~/lib/utils/colors';
import { fontFamilies, typography } from '~/lib/utils/typography';
import Button from './ui/Button';

export default function DeleteAccountModal({
  sheetRef,
  handleClose,
  isDeleting,
  handleDeleteAccount,
}: {
  sheetRef: React.RefObject<BottomSheetModal>;
  handleClose: () => void;
  isDeleting: boolean;
  handleDeleteAccount: () => void;
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
      enableDynamicSizing
    >
      <BottomSheetView
        style={[styles.container, { paddingBottom: insets.bottom }]}
      >
        <Text style={styles.title}>{t('settings.deleteAccount')}</Text>
        <Divider style={styles.divider} />
        <Text style={styles.subtitle} numberOfLines={2}>
          {t('support.deleteAccount')}
        </Text>
        <Divider style={styles.divider} />
        <View style={styles.buttonContainer}>
          <Button type="secondary" flex={true} onPress={handleClose}>
            {t('support.cancel')}
          </Button>
          <Button
            flex={true}
            onPress={handleDeleteAccount}
            loading={isDeleting}
          >
            {t('support.yesDelete')}
          </Button>
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
    color: '#F75555',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: typography.h5.fontSize,
    lineHeight: typography.h5.lineHeight,
    fontFamily: fontFamilies.regular,
    color: colors.text.general.light,
  },
  divider: {
    backgroundColor: colors.border.light,
    height: 1.5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
});
