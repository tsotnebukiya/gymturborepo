import { useLocalSearchParams } from 'expo-router';
import { useGenerationContext } from '~/components/GenerationContext';
import CategoriesView from '~/components/Generation/CategoriesView';

export default function GeneratedItemScreen() {
  const { id } = useLocalSearchParams();
  const { generationData } = useGenerationContext();

  return <CategoriesView data={generationData} id={id as string} />;
}
