import type { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'GymLead AI',
  slug: 'gymapp',
  scheme: 'gymapp',
  version: '0.1.0',
  orientation: 'portrait',
  icon: './src/assets/icon.png',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  updates: {
    fallbackToCacheTimeout: 0,
    url: 'https://u.expo.dev/b436b234-7f6e-47be-8c02-1a6bc764ee08',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    bundleIdentifier: 'com.slai.gymapp',
    supportsTablet: true,
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
  android: {
    package: 'com.slai.gymapp',
    adaptiveIcon: {
      foregroundImage: './src/assets/foreground.png',
      backgroundImage: './src/assets/background.png',
    },
  },
  extra: {
    eas: {
      projectId: 'b436b234-7f6e-47be-8c02-1a6bc764ee08',
    },
  },
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
  },
  plugins: [
    'expo-router',
    'expo-secure-store',
    'expo-localization',
    'expo-font',
    [
      'expo-splash-screen',
      {
        android: {
          image: './src/assets/splash-icon.png',
          backgroundColor: '#232323',
          imageWidth: 200,
        },
        ios: {
          image: './src/assets/splash.png',
          enableFullScreenImage_legacy: true,
          backgroundColor: '#232323',
        },
      },
    ],
  ],
});
