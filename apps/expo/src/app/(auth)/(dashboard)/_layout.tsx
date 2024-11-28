import { TabBarIcon } from '~/components/ui/TabBarIcon';
import WizardComponent from '~/components/wizard/Wizard';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

export default function DashboardLayout() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            height: 50 + insets.bottom,
            paddingBottom: insets.bottom,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: t('tabs.home'),
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? 'home' : 'home-outline'}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="bookmarks"
          options={{
            title: t('tabs.bookmarks'),
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? 'bookmarks' : 'bookmarks-outline'}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="split"
          options={{
            title: t('tabs.splits'),
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? 'grid' : 'grid-outline'}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: t('tabs.settings'),
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? 'settings' : 'settings-outline'}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
      <WizardComponent />
    </>
  );
}
