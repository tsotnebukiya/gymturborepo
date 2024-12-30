import { View, StyleSheet, StatusBar, Image } from 'react-native';
import TopBar from '~/components/shared/TopBar';
import { useRouter } from 'expo-router';
import SocialIcon from '~/components/ui/SocialButton';
import { Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import Gradient from './ui/Gradient';
import { fontFamilies, typography } from '~/lib/utils/typography';
import colors from '~/lib/utils/colors';

interface Props {
  loading: {
    google?: boolean;
    apple?: boolean;
    facebook?: boolean;
  };
  onGooglePress: () => void;
  onApplePress: () => void;
  onFacebookPress: () => void;
}

export default function SignInComponent({
  loading,
  onGooglePress,
  onApplePress,
  onFacebookPress,
}: Props) {
  const router = useRouter();
  const { t } = useTranslation();
  const disabled = loading.google || loading.apple || loading.facebook || false;
  return (
    <View style={styles.outerContainer}>
      <Gradient />
      <StatusBar barStyle="dark-content" backgroundColor={'transparent'} />
      <TopBar
        backAction={{
          icon: 'close',
          mode: 'contained',
          onPress: () => {
            router.replace('/(app)');
          },
        }}
        languageButton={true}
      />
      <View style={styles.container}>
        <Image
          source={require('~/assets/logobig.png')}
          style={{ height: 100, width: 100 }}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{t('signIn.title')}</Text>
          <Text style={styles.subtitle}>{t('signIn.subtitle')}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <SocialIcon
            text={t('auth.continueWith.google')}
            icon="google"
            loading={loading.google}
            onPress={onGooglePress}
            disabled={disabled}
          />
          <SocialIcon
            text={t('auth.continueWith.apple')}
            icon="apple"
            loading={loading.apple}
            onPress={onApplePress}
            disabled={disabled}
          />
          <SocialIcon
            text={t('auth.continueWith.facebook')}
            icon="facebook"
            onPress={onFacebookPress}
            disabled={disabled}
            loading={loading.facebook}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
  },
  image: {
    height: 100,
    width: 74.33,
  },
  textContainer: {
    alignItems: 'center',
    marginVertical: 60,
    gap: 12,
  },
  title: {
    fontSize: typography.h3.fontSize,
    lineHeight: typography.h3.lineHeight,
    fontFamily: fontFamilies.bold,
    color: colors.text.general.light,
  },
  subtitle: {
    fontSize: typography.h6.fontSize,
    lineHeight: typography.h6.lineHeight,
    fontFamily: fontFamilies.regular,
    color: colors.text.general.greyscale,
  },
  buttonContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  button: {
    padding: 5,
  },
  googleButton: {
    backgroundColor: '#DB4437',
  },
  appleButton: {
    backgroundColor: '#000000',
  },
  facebookButton: {
    backgroundColor: '#4267B2',
  },
});
