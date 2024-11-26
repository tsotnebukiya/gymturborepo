import { type Subcategory } from '.prisma/client';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCategoryContext } from '~/components/context/CategoryContext';
import { useAppContext } from '~/components/context/AppContext';
import CategoriesView from '~/components/generation/CategoriesView';
import { api } from '~/utils/api';

export default function CategoryListScreen() {
  const { type } = useLocalSearchParams<{
    type: 'new' | 'saved' | 'split';
  }>();
  const { setSubcategory, setSplitSubcategory } = useAppContext();
  const router = useRouter();

  const handleCategory = (subcategory: Subcategory) => {
    if (type === 'saved') {
      setSubcategory(subcategory);
      router.back();
    } else if (type === 'new') {
      router.push({
        pathname: '/(auth)/category/[subcategory]',
        params: { subcategory },
      });
      // WEAREHERE
    } else {
      setSplitSubcategory(subcategory);
      router.back();
    }
  };
  return <CategoriesView handleCategory={handleCategory} />;
}
