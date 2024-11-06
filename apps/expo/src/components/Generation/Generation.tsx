import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { type RouterOutputs } from '~/utils/api';
import Gradient from '~/components/Gradient';
import { useState } from 'react';
import CategoriesView from './CategoriesView';
import ExerciseListView from './ExerciseListView';
import ExerciseView from './ExerciseView';

const { height } = Dimensions.get('window');

type GenerationData = RouterOutputs['generation']['getOne'];

interface Props {
  data: NonNullable<GenerationData>;
  handleBack: () => void;
}

export default function Generation({ data, handleBack }: Props) {
  const [steps] = useState(0);
  const renderStep = () => {
    switch (steps) {
      case 0:
        return <CategoriesView data={data} handleBack={handleBack} />;
      case 1:
        return <ExerciseListView data={data} handleBack={handleBack} />;
      case 2:
        return <ExerciseView data={data} handleBack={handleBack} />;
      default:
        return <CategoriesView data={data} handleBack={handleBack} />;
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: data.image }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View style={[styles.contentOuter]}>
        <Gradient>{renderStep()}</Gradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  imageContainer: {
    height: height * 0.25,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentOuter: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
});
