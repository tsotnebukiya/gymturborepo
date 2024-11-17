import GradientLayout from '~/components/common/GradientLayout';
import { useAppContext } from '~/components/context/AppContext';
import ListFilter from '~/components/exercises/ListFilter';

export default function SplitExercisesScreen() {
  const { setSplitSubcategory, splitSubcategory } = useAppContext();
  return (
    <GradientLayout>
      <ListFilter
        subcategory={splitSubcategory}
        setSubcategory={setSplitSubcategory}
        categoryFilterType="split"
        backAction={true}
      />
    </GradientLayout>
  );
}
