import { View } from 'react-native';
import { Skeleton } from 'moti/skeleton';
import { generationItemStyles as styles } from './GenerationItem';

export default function SkeletonComp() {
  const colorMode = 'light';
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Skeleton colorMode={colorMode} height={110} width={110} />
      </View>
      <View style={styles.contentContainer}>
        <Skeleton colorMode={colorMode} width={150} height={20} />
        <Skeleton colorMode={colorMode} width={'100%'} height={40} />
      </View>
    </View>
  );
}
