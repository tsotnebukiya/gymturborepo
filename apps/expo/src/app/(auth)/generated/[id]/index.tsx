import { router } from 'expo-router';
import { useGenerationContext } from '~/components/GenerationContext';
import CategoriesView from '~/components/Generation/CategoriesView';

export default function GeneratedItemScreen() {
  const { generationData } = useGenerationContext();
  const handleBack = () => {
    router.back();
  };

  return <CategoriesView data={generationData} handleBack={handleBack} />;
}
