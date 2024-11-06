import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';

export default function Gradient({ children }: { children: React.ReactNode }) {
  return (
    <LinearGradient
      colors={['#f5f8ff', 'white']}
      style={styles.background}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
});
