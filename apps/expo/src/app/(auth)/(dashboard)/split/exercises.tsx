import GradientLayout from '~/components/common/GradientLayout';
import { useAppContext } from '~/components/context/AppContext';
import SplitExercisesList from '~/components/splits/ExercisesList';

export default function SplitExercisesScreen() {
  const { setSplitSubcategory, splitSubcategory } = useAppContext();
  return (
    <GradientLayout>
      <SplitExercisesList
        subcategory={splitSubcategory}
        setSubcategory={setSplitSubcategory}
      />
    </GradientLayout>
  );
}
