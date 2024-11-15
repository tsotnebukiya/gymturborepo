import { StyleSheet, View } from 'react-native';
import { type RouterOutputs } from '~/utils/api';
import GenerationItem from './GenerationItem';
import { Text } from 'react-native-paper';
import SkeletonComp from './Skeleton';
import CTABox from '../common/CTABox';
import { useAppContext } from '../context/AppContext';

export default function LatestGenerations({
  data,
  loading,
}: {
  data?: RouterOutputs['generation']['getAll'];
  loading: boolean;
}) {
  const { setWizardVisible } = useAppContext();
  const handleCTA = () => setWizardVisible(true);
  return (
    <View style={styles.container}>
      <Text variant="titleLarge">Latest Generations</Text>
      <View style={styles.generationsContainer}>
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <SkeletonComp key={index} />
          ))
        ) : data?.length ? (
          data.map((generation) => (
            <GenerationItem key={generation.id} data={generation} />
          ))
        ) : (
          <CTABox
            title="No generations yet"
            description="Create your first AI generation and start exploring the possibilities!"
            buttonText="Create First Generation"
            onPress={handleCTA}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 32,
  },
  generationsContainer: {
    gap: 16,
  },
});
