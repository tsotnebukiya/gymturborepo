import { Dimensions, Image, StyleSheet, View } from 'react-native';
import Gradient from '~/components/common/Gradient';
import { Skeleton } from 'moti/skeleton';
import { useState } from 'react';

const { height } = Dimensions.get('window');
interface Props {
  children: React.ReactNode;
  image?: string;
}

export default function ImageLayout({ children, image }: Props) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {!image ? (
          <Skeleton width="100%" height="100%" colorMode={'light'} />
        ) : (
          <Image
            source={{ uri: image }}
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
