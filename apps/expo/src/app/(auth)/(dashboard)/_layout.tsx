import { TabBarIcon } from '~/components/common/TabBarIcon';
import WizardComponent from '~/components/generation/Wizard';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DashboardLayout() {
  const insets = useSafeAreaInsets();
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
            title: 'Home',
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
            title: 'Saved',
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
            title: 'Splits',
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
            title: 'Settings',
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
