import { useAuth } from '@clerk/clerk-expo';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import GradientLayout from '../common/GradientLayout';

export default function Settings() {
  const { signOut } = useAuth();
  return (
    <GradientLayout>
      <View style={styles.container}>
        <Button
          mode="contained-tonal"
          style={styles.button}
          onPress={() => signOut()}
        >
          Sign Out
        </Button>
      </View>
    </GradientLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    width: '100%',
  },
});
