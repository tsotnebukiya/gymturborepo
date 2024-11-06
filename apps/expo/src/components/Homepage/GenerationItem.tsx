import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { api, type RouterOutputs } from '~/utils/api';
import LottieView from 'lottie-react-native';
import { Skeleton } from 'moti/skeleton';
import { useRouter } from 'expo-router';

export default function GenerationItem({
  data,
}: {
  data: RouterOutputs['generation']['getAll'][number];
}) {
  const router = useRouter();
  const completed = data.status === 'COMPLETED' && data.name !== null;
  const onPress = () => {
    if (completed) {
      router.push(`/generated/${data.id}`);
    }
  };
  if (completed) {
    api.generation.getOne.usePrefetchQuery({ id: data.id });
  }
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: data.image }}
          style={[
            styles.image,
            { opacity: data.status === 'PENDING' ? 0.5 : 1 },
          ]}
        />
        <View style={styles.lottieContainer}>
          {data.status === 'PENDING' ? (
            <LottieView
              source={require('~/assets/scanner.json')}
              style={{ width: '100%', height: '100%' }}
              speed={0.7}
              autoPlay
              loop
            />
          ) : null}
        </View>
      </View>
      <View style={styles.contentContainer}>
        {data.status === 'PENDING' ? (
          <>
            <Skeleton colorMode={'light'} width={150} height={20} />
            <Skeleton colorMode={'light'} width={'100%'} height={40} />
          </>
        ) : null}
        {data.status === 'FAILED' ? (
          <Text variant="titleLarge" style={styles.errorText}>
            Invalid Image
          </Text>
        ) : null}
        {data.status === 'COMPLETED' ? (
          <>
            <Text variant="titleLarge" numberOfLines={1} ellipsizeMode="tail">
              {data.name}
            </Text>
            <Text variant="bodyMedium" numberOfLines={2} ellipsizeMode="middle">
              {data.description}
            </Text>
          </>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 16,
    alignSelf: 'center',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 5,
  },
  imageContainer: {
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  lottieContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  image: {
    width: 110,
    height: 110,
  },
  contentContainer: {
    padding: 12,
    flex: 1,
    gap: 12,
  },
  bodyContainer: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
  },
});

export { styles as generationItemStyles };
