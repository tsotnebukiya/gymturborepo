import { useAuth, useUser } from '@clerk/clerk-expo';
import { Image, StyleSheet, View, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import GradientLayout from '~/components/shared/GradientLayout';
import { useTranslation } from 'react-i18next';
import LanguageModal from '~/components/LanguageModal';
import { useRef, useState } from 'react';
import ScrollView from '~/components/shared/ScrollView';
import TopBar from '~/components/shared/TopBar';
import { router } from 'expo-router';
import { fontFamilies, typography } from '~/lib/utils/typography';
import colors from '~/lib/utils/colors';
import TextButton from '~/components/ui/TextButon';
import * as WebBrowser from 'expo-web-browser';
import { type BottomSheetModal } from '@gorhom/bottom-sheet';
import DeleteAccountModal from '~/components/DeleteAccountModal';
import { api } from '~/lib/utils/api';

export default function SettingsScreen() {
  const { signOut } = useAuth();
  const { t } = useTranslation();
  const { user } = useUser();
  const [isDeleting, setIsDeleting] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const showLanguageModal = () => setLanguageModalVisible(true);
  const hideLanguageModal = () => setLanguageModalVisible(false);

  const { mutate } = api.support.deleteAccount.useMutation({
    onMutate() {
      setIsDeleting(true);
    },
    onSuccess: async () => {
      await signOut();
      Alert.alert('Account deleted');
    },
  });
  const handleSupport = () => {
    router.push('/support');
  };
  const handleTerms = async () => {
    await WebBrowser.openBrowserAsync('https://www.gymleadai.app/terms');
  };
  const handlePrivacy = async () => {
    await WebBrowser.openBrowserAsync('https://www.gymleadai.app/privacy');
  };
  const handleDeleteAccount = () => {
    mutate();
  };
  const handleShowBottomSheet = () => {
    setTimeout(() => {
      bottomSheetRef.current?.present();
      bottomSheetRef.current?.snapToIndex(0); // Changed from 1 to 0 since snapPoints only has ['50%']
    }, 0);
  };
  const handleCloseBottomSheet = () => {
    bottomSheetRef.current?.close();
  };
  return (
    <GradientLayout>
      <TopBar
        logo={true}
        title={'GymLead AI'}
        inset={false}
        barBorder={true}
        actions={[
          {
            icon: require('~/assets/icons/chat.png'),
            mode: 'contained',
            onPress: handleSupport,
          },
        ]}
      />
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.userContainer}>
            {user?.imageUrl ? (
              <Image
                source={{
                  uri: user.imageUrl,
                }}
                style={styles.userImage}
              />
            ) : (
              <Image
                source={require('~/assets/avatar.png')}
                style={styles.userImage}
              />
            )}
            <View style={styles.userDetails}>
              <Text style={styles.userName}>
                {user?.firstName} {user?.lastName}
              </Text>
              <Text style={styles.userEmail}>
                {user?.emailAddresses[0]?.emailAddress}
              </Text>
            </View>
          </View>
          <View style={styles.actionsContainer}>
            <TextButton
              onPress={showLanguageModal}
              leftIcon="language"
              rightIcon={true}
            >
              {t('settings.changeLanguage')}
            </TextButton>
            <TextButton
              onPress={handleSupport}
              leftIcon="reader-outline"
              rightIcon={true}
            >
              {t('settings.helpSupport')}
            </TextButton>
            <TextButton onPress={handleTerms} leftIcon="list" rightIcon={true}>
              {t('settings.termsAndConditions')}
            </TextButton>
            <TextButton onPress={handlePrivacy} leftIcon="eye" rightIcon={true}>
              {t('settings.privacyPolicy')}
            </TextButton>
            <TextButton onPress={signOut} leftIcon="exit" color="#F75555">
              {t('settings.exitAccount')}
            </TextButton>
            <TextButton
              onPress={handleShowBottomSheet}
              leftIcon="person-remove-outline"
              color="#F75555"
            >
              {t('settings.deleteAccount')}
            </TextButton>
          </View>
        </View>
      </ScrollView>
      <LanguageModal
        visible={languageModalVisible}
        onClose={hideLanguageModal}
      />
      <DeleteAccountModal
        sheetRef={bottomSheetRef}
        handleClose={handleCloseBottomSheet}
        isDeleting={isDeleting}
        handleDeleteAccount={handleDeleteAccount}
      />
    </GradientLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 24,
    paddingHorizontal: 12,
    gap: 24,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 100,
  },
  userDetails: {
    flex: 1,
    gap: 4,
  },
  userName: {
    fontSize: typography.h6.fontSize,
    lineHeight: typography.h6.lineHeight,
    fontFamily: fontFamilies.bold,
    color: colors.text.general.light,
  },
  userEmail: {
    fontSize: typography.medium.fontSize,
    lineHeight: typography.medium.lineHeight,
    fontFamily: fontFamilies.regular,
    color: colors.text.general.greyscale,
  },
  actionsContainer: {
    gap: 32,
    flex: 1,
    width: '100%',
  },
  button: {
    width: '100%',
  },
});
