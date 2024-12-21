import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

export default function SelectButton({
  onPress,
  disabled,
}: {
  onPress: () => void;
  disabled: boolean;
}) {
  const { t } = useTranslation();
  return (
    <Button
      mode="outlined"
      onPress={onPress}
      icon="plus"
      style={styles.exerciseButton}
      contentStyle={styles.exerciseButtonContent}
      labelStyle={styles.exerciseButtonLabel}
      disabled={disabled}
    >
      {t('exercises.selectSavedExercise')}
    </Button>
  );
}

const styles = StyleSheet.create({
  exerciseButton: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  exerciseButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    height: 56,
  },
  exerciseButtonLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});
