import { useState } from 'react';
import {
  ScrollView as ScrollViewNative,
  StyleSheet,
  RefreshControl,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ANDROID_BOTTOM_PADDING } from '~/lib/utils/constants';

export default function ScrollView({
  children,
  onRefresh,
  tabBarPadding = true,
}: {
  children: React.ReactNode;
  onRefresh?: () => Promise<void>;
  tabBarPadding?: boolean;
}) {
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();
  const handleRefresh = async () => {
    if (!onRefresh) return;
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  };
  return (
    <ScrollViewNative
      overScrollMode="never"
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        ) : undefined
      }
      showsVerticalScrollIndicator={false}
      contentContainerStyle={
        tabBarPadding
          ? styles.paddingBottom
          : {
              paddingBottom:
                Platform.OS === 'ios' ? insets.bottom : ANDROID_BOTTOM_PADDING,
            }
      }
      style={styles.container}
    >
      {children}
    </ScrollViewNative>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  paddingBottom: {
    paddingBottom: 131,
  },
});
