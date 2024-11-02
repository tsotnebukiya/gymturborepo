import { Image, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { type RouterOutputs } from '~/utils/api';

export default function GenerationItem({
  data,
}: {
  data: RouterOutputs['generation']['getAll'][number];
}) {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: data.image! }} style={styles.image} />
      </View>
      <View style={styles.contentContainer}>
        {data.status === 'FAILED' ? <Text>fail</Text> : null}
        {data.status === 'PENDING' ? (
          <ActivityIndicator />
        ) : (
          <>
            <Text variant="titleLarge" numberOfLines={1} ellipsizeMode="tail">
              {data.name}
            </Text>
            <Text variant="bodyMedium" numberOfLines={2} ellipsizeMode="middle">
              {data.description}
            </Text>
          </>
        )}
      </View>
    </View>
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
});

export { styles as generationItemStyles };
