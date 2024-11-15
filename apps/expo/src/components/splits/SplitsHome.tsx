import { StyleSheet, View, FlatList } from 'react-native';
import GradientLayout from '~/components/common/GradientLayout';
import TopBar from '~/components/common/TopBar';
import SplitItem from './SplitItem';
import CTABox from '../common/CTABox';
import { router } from 'expo-router';

const splits = [
  {
    id: 1,
    name: 'Push/Pull/Legs',
    exerciseCount: 10,
    targetMuscles: ['Chest', 'Back', 'Legs'],
    duration: 60,
  },
  {
    id: 2,
    name: 'Upper/Lower',
    day: 'Tuesday',
    exerciseCount: 10,
    targetMuscles: ['Chest', 'Back', 'Legs'],
    duration: 60,
  },
  {
    id: 3,
    name: 'Full Body',
    day: 'Friday',
    exerciseCount: 10,
    targetMuscles: ['Chest', 'Back', 'Legs'],
    duration: 60,
  },
];

export default function SplitsHome() {
  const handleCreateNew = () => {
    router.navigate('/(auth)/split/new');
  };
  const renderItem = ({ item }: { item: { id: number; name: string } }) => (
    <SplitItem item={item} />
  );
  return (
    <GradientLayout>
      <View style={styles.container}>
        <TopBar
          title="Splits List"
          statusBarHeight={0}
          borderBottomColor="#E0E0E0"
          actions={[
            {
              icon: 'plus',
              onPress: handleCreateNew,
              mode: 'contained',
            },
          ]}
        />
        <FlatList
          data={splits}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={() => (
            <CTABox
              buttonText="Create Split"
              description="Create a new split to start training with AI"
              title="No splits yet"
              onPress={handleCreateNew}
            />
          )}
        />
      </View>
    </GradientLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
  },
  listContainer: {
    padding: 16,
    gap: 16,
  },
});
