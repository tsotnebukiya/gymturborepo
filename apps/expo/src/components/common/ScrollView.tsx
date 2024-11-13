import { useState } from 'react';
import {
  ScrollView as ScrollViewNative,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ScrollView({
  children,
  onRefresh,
}: {
  children: React.ReactNode;
  onRefresh?: () => Promise<void>;
}) {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!onRefresh) return;
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  };

  return (
    <ScrollViewNative
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        ) : undefined
      }
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: insets.bottom }}
      style={styles.container}
    >
      {children}
    </ScrollViewNative>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
