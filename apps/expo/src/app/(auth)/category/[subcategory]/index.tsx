import { useLocalSearchParams } from 'expo-router';
import ExerciseList from '~/components/exercises/List';
import { useCategoryContext } from '~/components/context/CategoryContext';
import { musclesConstants } from '~/utils/constants';

export default function ExerciseScreen() {
  const { subcategory } = useLocalSearchParams();
  const { isGenerating, exercises } = useCategoryContext();
  const name =
    musclesConstants[subcategory as keyof typeof musclesConstants].label;
  return (
    <ExerciseList
      type={isGenerating ? 'ai-generating' : 'default'}
      itemType="saved"
      data={exercises}
      name={name}
      loading={isGenerating}
    />
  );
}
