import { type Subcategory } from '.prisma/client';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCategoryContext } from '~/components/context/CategoryContext';
import { useAppContext } from '~/components/context/AppContext';
import CategoriesView from '~/components/generation/CategoriesView';
import { api } from '~/utils/api';

export default function CategoryListScreen() {
  const { type } = useLocalSearchParams<{ type: 'new' | 'bookmarks' }>();
  const { setIsGenerating, setExercises } = useCategoryContext();
  const { setSubcategory } = useAppContext();
  const router = useRouter();
  const { mutate } = api.generation.createByCategory.useMutation({
    onMutate: () => {
      setIsGenerating(true);
    },
    onSuccess: (exercises) => {
      setExercises(exercises);
      setIsGenerating(false);
    },
    onError: () => {
      setIsGenerating(false);
    },
  });
  const handleCategory = (subcategory: Subcategory) => {
    if (type === 'bookmarks') {
      setSubcategory(subcategory);
      router.back();
    } else {
      router.push({
        pathname: '/(auth)/category/[subcategory]',
        params: { subcategory },
      });
      mutate({ subcategory });
    }
  };
  return <CategoriesView handleCategory={handleCategory} />;
}
