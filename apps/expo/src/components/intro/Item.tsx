import {
  StyleSheet,
  useWindowDimensions,
  View,
  type ImageSourcePropType,
} from 'react-native';
import { Text } from 'react-native-paper';
import colors from '~/lib/utils/colors';
import { fontFamilies, typography } from '~/lib/utils/typography';

export interface CarouselData {
  id: number;
  image: ImageSourcePropType;
  title: string;
  subtitle: string;
}

export default function IntroItem({ item }: { item: CarouselData }) {
  const { width } = useWindowDimensions();
  return (
    <View style={[styles.textContainer, { width }]}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subTitle}>{item.subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    gap: 12,
    paddingHorizontal: 12,
  },
  title: {
    textAlign: 'center',
    color: colors.text.general.light,
    fontSize: typography.h3.fontSize,
    fontFamily: fontFamilies.bold,
    lineHeight: typography.h3.lineHeight,
  },
  subTitle: {
    textAlign: 'center',
    color: colors.text.general.greyscale,
    fontSize: typography.h6.fontSize,
    fontFamily: fontFamilies.regular,
    lineHeight: typography.h6.lineHeight,
  },
});
