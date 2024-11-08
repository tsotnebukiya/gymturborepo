import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Gradient from './Gradient';

export default function GradientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return (
    <Gradient>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {children}
      </View>
    </Gradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
