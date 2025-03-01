import { useCallback, useEffect, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { useOAuth } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';
import * as Sentry from '@sentry/react-native';
import SignInComponent from '~/components/SignIn';

export const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  useWarmUpBrowser();
  const redirectUrl = Linking.createURL('home');
  const [loadingProvider, setLoadingProvider] = useState<
    'google' | 'apple' | 'facebook' | null
  >(null);
  const { startOAuthFlow: googleFlow } = useOAuth({
    strategy: 'oauth_google',
    redirectUrl,
  });
  const { startOAuthFlow: appleFlow } = useOAuth({
    strategy: 'oauth_apple',
    redirectUrl,
  });
  const { startOAuthFlow: facebookFlow } = useOAuth({
    strategy: 'oauth_facebook',
    redirectUrl,
  });
  const onPress = useCallback(
    async (provider: string) => {
      try {
        setLoadingProvider(
          provider.toLowerCase() as 'google' | 'apple' | 'facebook'
        );
        let flow;
        switch (provider) {
          case 'Google':
            flow = googleFlow;
            break;
          case 'Apple':
            flow = appleFlow;
            break;
          case 'Facebook':
            flow = facebookFlow;
            break;
          default:
            throw new Error(`Unsupported provider: ${provider}`);
        }
        const { createdSessionId, setActive } = await flow();
        if (createdSessionId && setActive) {
          await setActive({ session: createdSessionId });
        } else {
          //
        }
      } catch (err) {
        const clerkError = err as ClerkError;
        const message = clerkError.errors[0]?.longMessage ?? 'Unknown error';
        console.log('message', message);
        Sentry.captureException(message);
        console.error(`${provider} OAuth error`, err);
      } finally {
        setLoadingProvider(null);
      }
    },
    [appleFlow, facebookFlow, googleFlow]
  );
  return (
    <SignInComponent
      loading={{
        google: loadingProvider === 'google',
        apple: loadingProvider === 'apple',
        facebook: loadingProvider === 'facebook',
      }}
      onGooglePress={() => onPress('Google')}
      onApplePress={() => onPress('Apple')}
      onFacebookPress={() => onPress('Facebook')}
    />
  );
}
