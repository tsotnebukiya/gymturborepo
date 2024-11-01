import { StyleSheet, View } from 'react-native';
import { type RouterOutputs } from '~/utils/api';
import GenerationItem from './GenerationItem';
import { Text } from 'react-native-paper';

export default function LatestGenerations({
  data,
}: {
  data: RouterOutputs['generation']['getAll'];
}) {
  return (
    <View style={styles.container}>
      <Text variant="titleLarge">Latest Generations</Text>
      {data.map((generation) => (
        <GenerationItem key={generation.id} data={generation} />
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
