import { ScrollView, View } from 'react-native';
import { Text } from 'react-native-paper';
import { type RouterOutputs } from '~/utils/api';
import TopBar from '~/components/TopBar';

type GenerationData = RouterOutputs['generation']['getOne'];

interface Props {
  data: NonNullable<GenerationData>;
  handleBack: () => void;
}

export default function ExerciseView({ data, handleBack }: Props) {
  return (
    <View style={{ flex: 1 }}>
      <TopBar
        statusBarHeight={0}
        title={data.name!}
        backAction={{
          icon: 'arrow-left',
          onPress: handleBack,
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        {data.exercise.map((el, i) => (
          <View key={i} style={{ marginBottom: 100 }}>
            <Text>{el.category}</Text>
            <Text>{el.subcategory}</Text>
            <Text>{el.name}</Text>
            <Text>{el.description}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
