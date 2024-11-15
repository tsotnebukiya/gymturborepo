import { type RouterOutputs } from '@acme/api';
import ImageLayout from '../generation/ImageLayout';
import ExerciseView from './ExerciseScreen';

type ExerciseData = RouterOutputs['exercise']['getOne'];

interface Props {
  data?: ExerciseData;
}

export default function FullExerciseView({ data }: Props) {
  return (
    <>
      {data?.generation ? (
        <ImageLayout image={data.generation.image}>
          <ExerciseView data={data} />
        </ImageLayout>
      ) : (
        <ExerciseView data={data} />
      )}
    </>
  );
}
