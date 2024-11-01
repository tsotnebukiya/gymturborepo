import { type RouterOutputs } from '~/utils/api';
import GradientLayout from '../GradientLayout';
import LatestGenerations from './LatestGenerations';
import { ScrollView, StyleSheet } from 'react-native';

export default function Homepage({
  data,
}: {
  data: RouterOutputs['generation']['getAll'];
}) {
  return (
    <GradientLayout>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={[styles.scrollContainer]}
      >
        <LatestGenerations data={data} />
      </ScrollView>
    </GradientLayout>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
