import { TabBarIcon } from '~/components/common/TabBarIcon';
import WizardComponent from '~/components/generation/Wizard';
import { Tabs } from 'expo-router';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DashboardLayout() {
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
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
            title: 'Bookmarks',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? 'bookmarks' : 'bookmarks-outline'}
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
      <WizardComponent
        showModal={showModal}
        hideModal={hideModal}
        visible={visible}
      />
    </>
  );
}
