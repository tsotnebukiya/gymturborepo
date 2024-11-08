import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { type RouterOutputs } from '~/utils/api';
import Gradient from '~/components/common/Gradient';
import { Skeleton } from 'moti/skeleton';
import { useState } from 'react';

const { height } = Dimensions.get('window');

type GenerationData = RouterOutputs['generation']['getOne'];

interface Props {
  data?: GenerationData;
  children: React.ReactNode;
}

export default function ImageLayout({ data, children }: Props) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {!data ? (
          <Skeleton width="100%" height="100%" colorMode={'light'} />
        ) : (
          <Image
            source={{ uri: data.image }}
            style={[styles.image, isLoading && styles.hidden]}
            resizeMode="cover"
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
          />
        )}
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
  hidden: {
    opacity: 0,
  },
});
