import { ScrollView, StyleSheet, View } from 'react-native';
import { type RouterOutputs } from '~/utils/api';
import TopBar from '~/components/TopBar';
import { router } from 'expo-router';
import { musclesConstants } from '~/utils/constants';
import { PrismaTypes } from '@acme/api';

type GenerationData = RouterOutputs['generation']['getOne'];

interface Props {
  data: NonNullable<GenerationData>;
  subcategory: string;
  id: string;
}

export default function ExerciseListView({ data, subcategory, id }: Props) {
  const subcategoryTyped = subcategory as PrismaTypes.$Enums.Subcategory;
  const subcategoryName = musclesConstants[subcategoryTyped].label;
  const exercises = data.exercise.filter(
    (el) => el.subcategory === subcategoryTyped
  );
  const handleBack = () => {
    router.back();
  };
  return (
    <View style={styles.container}>
      <TopBar
        statusBarHeight={0}
        title={`${subcategoryName} Exercises`}
        borderBottomColor="#E0E0E0"
        backAction={{
          icon: 'arrow-left',
          onPress: handleBack,
        }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
        style={styles.scrollView}
      ></ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
  },
});
