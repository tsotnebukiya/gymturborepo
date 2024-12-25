import { Image, Pressable, StyleSheet, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { api, type RouterOutputs } from '~/lib/utils/api';
import LottieView from 'lottie-react-native';
import { Skeleton } from 'moti/skeleton';
import { useRouter } from 'expo-router';
import { useCurrentLanguage } from '~/i18n';
import colors from '~/lib/utils/colors';
import { fontFamilies, typography } from '~/lib/utils/typography';

export default function GenerationItem({
  data,
}: {
  data: RouterOutputs['generation']['getAll'][number];
}) {
  const router = useRouter();
  const { language } = useCurrentLanguage();
  const completed = data.status === 'COMPLETED' || data.status === 'FAILED';
  const onPress = () => {
    if (completed) {
      router.push(`/generated/${data.id}`);
    }
  };
  if (completed) {
    api.generation.getOne.usePrefetchQuery({ id: data.id, language });
  }
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && completed ? styles.pressed : null,
      ]}
      onPress={onPress}
    >
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
          <Text variant="titleLarge" style={styles.errorTitle}>
            Invalid Image
          </Text>
        ) : null}
        {data.status === 'COMPLETED' ? (
          <>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {data.name}
            </Text>
            <Text
              style={styles.subtitle}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {data.description}
            </Text>
          </>
        ) : null}
      </View>
      <View style={styles.iconContainer}>
        {completed ? (
          <IconButton
            icon="chevron-right"
            size={24}
            iconColor={colors.text.general.light}
            style={styles.icon}
          />
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
    alignSelf: 'center',
    borderRadius: 6,
    shadowColor: '#000000',
    shadowOffset: {
      width: 1.95,
      height: 1.95,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2.6,
    elevation: 4,
  },
  imageContainer: {
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
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
    width: 100,
    height: 100,
  },
  contentContainer: {
    flex: 1,
    gap: 6,
    paddingTop: 6,
    marginLeft: 16,
  },
  pressed: {
    opacity: 0.6,
  },
  title: {
    fontSize: typography.h5.fontSize,
    lineHeight: typography.h5.lineHeight,
    fontFamily: fontFamilies.bold,
    color: colors.text.general.light,
  },
  subtitle: {
    fontSize: typography.medium.fontSize,
    lineHeight: typography.medium.lineHeight,
    fontFamily: fontFamilies.regular,
    color: colors.text.general.greyscale,
  },
  errorTitle: {
    fontSize: typography.h5.fontSize,
    lineHeight: typography.h5.lineHeight,
    fontFamily: fontFamilies.bold,
    color: 'red',
  },
  iconContainer: {
    justifyContent: 'center',
  },
  icon: {
    padding: 0,
    margin: 0,
  },
});

export { styles as generationItemStyles };
