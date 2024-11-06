import { useGenerationContext } from '~/components/GenerationContext';
import ExerciseListView from '~/components/Generation/ExerciseListView';
import { useLocalSearchParams } from 'expo-router';

export default function SubcategoryScreen() {
  const { id, subcategory } = useLocalSearchParams();
  const { generationData } = useGenerationContext();
  return (
    <ExerciseListView
      data={generationData}
      id={id as string}
      subcategory={subcategory as string}
    />
  );
}
