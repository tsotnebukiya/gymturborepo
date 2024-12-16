import { View } from 'react-native';
import { Skeleton } from 'moti/skeleton';
import { generationItemStyles as styles } from './Item';

export default function GenerationSkeleton() {
  const colorMode = 'light';
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Skeleton colorMode={colorMode} height={100} width={100} />
      </View>
      <View style={styles.contentContainer}>
        <Skeleton colorMode={colorMode} width={150} height={20} />
        <Skeleton colorMode={colorMode} width={'80%'} height={15} />
        <Skeleton colorMode={colorMode} width={'80%'} height={15} />
      </View>
    </View>
  );
}
