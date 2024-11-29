import { View, StyleSheet } from 'react-native';
import TopBar from '~/components/shared/TopBar';
import { useRouter } from 'expo-router';
import SocialIcon from '~/components/ui/SocialButton';
import { Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

interface Props {
  loading: boolean;
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
  return (
    <>
      <TopBar
        backAction={{
          icon: 'close',
          mode: 'contained-tonal',
          onPress: () => {
            router.navigate('/');
          },
        }}
      />
      <View style={styles.container}>
        <Text style={styles.title}>{t('signIn.title')}</Text>
        <View style={styles.buttonContainer}>
          <SocialIcon
            text={t('auth.continueWith.google')}
            icon="google"
            localStyles={{
              wrapper: { ...styles.button, ...styles.googleButton },
            }}
            onPress={onGooglePress}
            disabled={loading}
          />
          <SocialIcon
            text={t('auth.continueWith.apple')}
            icon="apple"
            localStyles={{
              wrapper: { ...styles.button, ...styles.appleButton },
            }}
            onPress={onApplePress}
            disabled={loading}
          />
          <SocialIcon
            text={t('auth.continueWith.facebook')}
            icon="facebook"
            localStyles={{
              wrapper: { ...styles.button, ...styles.facebookButton },
            }}
            onPress={onFacebookPress}
            disabled={loading}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
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
