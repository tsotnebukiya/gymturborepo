import GradientLayout from '~/components/common/GradientLayout';
import { useAppContext } from '~/components/context/AppContext';
import ListFilter from '~/components/exercises/ListFilter';

export default function BookmarksScreen() {
  const { setSubcategory, subcategory } = useAppContext();
  return (
    <GradientLayout>
      <ListFilter
        subcategory={subcategory}
        setSubcategory={setSubcategory}
        categoryFilterType="saved"
      />
    </GradientLayout>
  );
}
