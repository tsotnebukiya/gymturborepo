import { TabBarIcon, TabBarLabel } from '~/components/ui/TabBar';
import WizardComponent from '~/components/wizard/Wizard';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import TabBarSVG from '~/components/ui/TabBarSVG';
import colors from '~/lib/utils/colors';

export default function DashboardLayout() {
  const { t } = useTranslation();
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,

          tabBarStyle: {
            position: 'absolute',
            height: 107,
            paddingBottom: 0,
            paddingTop: 37,
            borderColor: 'transparent',
            backgroundColor: 'transparent',
            elevation: 0,
            zIndex: 1,
          },
          tabBarItemStyle: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            tabBarActiveTintColor: colors.menuBarIcon.active,
            tabBarInactiveTintColor: colors.menuBarIcon.inactive,

            tabBarLabel: ({ focused }) => (
              <TabBarLabel label={t('tabs.home')} active={focused} />
            ),
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
            tabBarActiveTintColor: colors.menuBarIcon.active,
            tabBarInactiveTintColor: colors.menuBarIcon.inactive,
            tabBarItemStyle: {
              marginRight: 25,
            },
            tabBarLabel: ({ focused }) => (
              <TabBarLabel label={t('tabs.bookmarks')} active={focused} />
            ),
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
            tabBarActiveTintColor: colors.menuBarIcon.active,
            tabBarInactiveTintColor: colors.menuBarIcon.inactive,
            tabBarItemStyle: {
              marginLeft: 25,
            },
            tabBarLabel: ({ focused }) => (
              <TabBarLabel label={t('tabs.splits')} active={focused} />
            ),
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
            tabBarActiveTintColor: colors.menuBarIcon.active,
            tabBarInactiveTintColor: colors.menuBarIcon.inactive,
            tabBarLabel: ({ focused }) => (
              <TabBarLabel label={t('tabs.settings')} active={focused} />
            ),
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? 'settings' : 'settings-outline'}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
      <TabBarSVG />
      <WizardComponent />
    </View>
  );
}
