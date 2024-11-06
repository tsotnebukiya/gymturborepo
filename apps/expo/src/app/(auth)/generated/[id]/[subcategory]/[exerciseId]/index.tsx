import { router } from 'expo-router';
import { useGenerationContext } from '~/components/GenerationContext';
import { Text } from 'react-native-paper';

export default function ExerciseScreen() {
  const { generationData } = useGenerationContext();
  return <Text>Subcategory</Text>;
}
