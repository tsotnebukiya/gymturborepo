import { StyleSheet } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';

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
    <Card style={styles.emptyCard}>
      <Card.Content style={styles.cardContent}>
        <Text variant="titleMedium" style={styles.cardTitle}>
          {title}
        </Text>
        <Text variant="bodyMedium" style={styles.cardDescription}>
          {description}
        </Text>
        <Button mode="contained" style={styles.button} onPress={onPress}>
          {buttonText}
        </Button>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  emptyCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  cardContent: {
    alignItems: 'center',
    padding: 24,
  },
  cardTitle: {
    marginBottom: 8,
  },
  cardDescription: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#6c757d',
  },
  button: {
    marginTop: 8,
  },
});
