import { StyleSheet, View } from 'react-native';
import { Text, Card } from 'react-native-paper';
import colors from '~/lib/utils/colors';
import { fontFamilies, typography } from '~/lib/utils/typography';
import Button from '../ui/Button';

export default function CTABox({
  title,
  description,
  buttonText,
  onPress,
}: {
  title: string;
  description: string;
  buttonText: string;
  onPress: () => void;
}) {
  return (
    <Card style={styles.emptyCard} mode="contained">
      <Card.Content style={styles.cardContent}>
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardDescription}>{description}</Text>
        </View>
        <Button onPress={onPress}>{buttonText}</Button>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  emptyCard: {
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderColor: colors.border.light,
    borderWidth: 1,
  },
  cardContent: {
    alignItems: 'center',
    gap: 44,
  },
  cardText: { gap: 16 },
  cardTitle: {
    textAlign: 'center',
    fontSize: typography.h6.fontSize,
    lineHeight: typography.h6.lineHeight,
    fontFamily: fontFamilies.bold,
    color: colors.text.general.light,
  },
  cardDescription: {
    textAlign: 'center',
    fontSize: typography.h6.fontSize,
    lineHeight: typography.h6.lineHeight,
    fontFamily: fontFamilies.regular,
    color: colors.text.general.greyscale,
  },
});
