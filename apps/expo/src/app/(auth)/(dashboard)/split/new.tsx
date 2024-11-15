import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import GradientLayout from '~/components/common/GradientLayout';
import TopBar from '~/components/common/TopBar';

export default function Split() {
  return (
    <GradientLayout>
      <View style={styles.container}>
        <TopBar
          title="Create Split"
          statusBarHeight={0}
          borderBottomColor="#E0E0E0"
          backAction={{ icon: 'arrow-left', onPress: () => router.back() }}
          actions={[
            {
              icon: 'check',
              onPress: () => {
                // Handle create action
              },
              mode: 'contained',
            },
          ]}
        />
      </View>
    </GradientLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
  },
});
