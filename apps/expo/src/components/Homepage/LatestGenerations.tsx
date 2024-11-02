import { StyleSheet, View } from 'react-native';
import { type RouterOutputs } from '~/utils/api';
import GenerationItem from './GenerationItem';
import { Text } from 'react-native-paper';
import SkeletonComp from './Skeleton';

export default function LatestGenerations({
  data,
  loading,
}: {
  data?: RouterOutputs['generation']['getAll'];
  loading: boolean;
}) {
  return (
    <View style={styles.container}>
      <Text variant="titleLarge">Latest Generations</Text>
      {data
        ? data.map((generation) => (
            <GenerationItem key={generation.id} data={generation} />
          ))
        : null}
      {loading &&
        Array.from({ length: 3 }).map((_, index) => (
          <SkeletonComp key={index} />
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 32,
  },
});
