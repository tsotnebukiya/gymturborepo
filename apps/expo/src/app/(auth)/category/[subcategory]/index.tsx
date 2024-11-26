import { useLocalSearchParams } from 'expo-router';
import { type Subcategory } from '@prisma/client';
import GradientLayout from '~/components/common/GradientLayout';
import ByMuscleList from '~/components/generation/ByMuscle';

export default function ExerciseScreen() {
  const { subcategory } = useLocalSearchParams();
  return (
    <GradientLayout>
      <ByMuscleList subcategory={subcategory as Subcategory} />
    </GradientLayout>
  );
}
