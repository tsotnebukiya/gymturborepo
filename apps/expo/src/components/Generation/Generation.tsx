import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { type RouterOutputs } from '~/utils/api';
import Gradient from '~/components/Gradient';

const { height } = Dimensions.get('window');

type GenerationData = RouterOutputs['generation']['getOne'];

interface Props {
  data: NonNullable<GenerationData>;
  children: React.ReactNode;
}

export default function Generation({ data, children }: Props) {
  // const renderStep = () => {
  //   switch (steps) {
  //     case 0:
  //       return <CategoriesView data={data} handleBack={handleBack} />;
  //     case 1:
  //       return <ExerciseListView data={data} handleBack={handleBack} />;
  //     case 2:
  //       return <ExerciseView data={data} handleBack={handleBack} />;
  //     default:
  //       return <CategoriesView data={data} handleBack={handleBack} />;
  //   }
  // };
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
        <Gradient>
          {/* {renderStep()} */}
          {children}
        </Gradient>
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
