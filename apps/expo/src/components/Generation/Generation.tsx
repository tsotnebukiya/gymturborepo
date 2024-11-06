import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { type RouterOutputs } from '~/utils/api';
import Gradient from '~/components/Gradient';

const { height } = Dimensions.get('window');

type GenerationData = RouterOutputs['generation']['getOne'];

interface Props {
  data: NonNullable<GenerationData>;
  children: React.ReactNode;
}

export default function Generation({ data, children }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: data.image }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View style={[styles.contentOuter]}>
        <Gradient>{children}</Gradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  imageContainer: {
    height: height * 0.25,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentOuter: {
    flex: 1,
  },
});
