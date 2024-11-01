import TopBar from '~/components/TopBar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text } from 'react-native-paper';

export default function GeneratedScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  return (
    <>
      <TopBar
        title="Generated"
        backAction={{ icon: 'arrow-left', onPress: handleBack }}
      />
      <Text>{id}</Text>
    </>
  );
}
