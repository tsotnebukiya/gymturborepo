import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import TopActions from './TopActions';

interface Props {
  handleInfoClose: () => void;
}

export default function Info({ handleInfoClose }: Props) {
  return (
    <>
      <TopActions handleBack={handleInfoClose} />
      <View style={styles.container}>
        <Text style={{ color: 'black' }} variant="titleLarge">
          INFO HERE
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
