import { type RouterOutputs } from '@acme/api';
import ImageLayout from '../generation/ImageLayout';
import ExerciseView from './ExerciseScreen';

type ExerciseData = RouterOutputs['exercise']['getOne'];

interface Props {
  data?: ExerciseData;
}

export default function FullExerciseView({ data }: Props) {
  return (
    <ImageLayout image={data?.generation.image}>
      <ExerciseView data={data} />
    </ImageLayout>
  );
}
