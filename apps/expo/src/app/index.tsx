import theme from '~/lib/utils/theme';
import { Link } from 'expo-router';
import {
  Dimensions,
  Image,
  type ImageSourcePropType,
  StyleSheet,
  View,
} from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

const { height } = Dimensions.get('window');

export default function IntroScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('~/assets/images/intro.jpeg') as ImageSourcePropType}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View style={[styles.content, { paddingBottom: insets.bottom }]}>
        <Text variant="headlineLarge" style={styles.title}>
          {t('intro.title')}
        </Text>
        <Link href="/sign-in" style={styles.link} asChild>
          <Button mode="contained" style={styles.button}>
            <Text variant="headlineSmall" style={styles.buttonText}>
              {t('intro.start')}
            </Text>
          </Button>
        </Link>
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
    height: height * 0.5,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
  },
  title: {
    marginBottom: 20,
  },
  link: {
    width: '100%',
  },
  button: {},
  buttonText: {
    color: theme.colors.inverseOnSurface,
  },
});
