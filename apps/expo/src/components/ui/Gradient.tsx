import { StyleSheet, View } from 'react-native';
import { RadialGradient } from 'react-native-gradients';
import colors from '~/lib/utils/colors';

const colorList = [
  { offset: '0%', color: colors.beige, opacity: '1' },
  { offset: '100%', color: 'white', opacity: '1' },
];

export default function Gradient() {
  return (
    <View style={styles.gradientContainer}>
      <RadialGradient x="50%" y="50%" rx="50%" ry="50%" colorList={colorList} />
    </View>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'red',
  },
});
