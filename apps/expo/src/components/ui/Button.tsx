import { Pressable, StyleSheet, type ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import colors from '~/lib/utils/colors';
import { fontFamilies, typography } from '~/lib/utils/typography';

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  type?: 'primary' | 'secondary';
  style?: ViewStyle;
  disabled?: boolean;
}

export default function Button({
  children,
  onPress,
  type = 'primary',
  style,
  disabled = false,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        type === 'primary' && styles.primary,
        type === 'secondary' && styles.secondary,
        pressed && styles.pressed,
        disabled &&
          (type === 'primary'
            ? styles.disabledPrimary
            : styles.disabledSecondary),
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          type === 'primary' && styles.textPrimary,
          type === 'secondary' && styles.textSecondary,
          disabled &&
            (type === 'primary'
              ? styles.textDisabledPrimary
              : styles.textDisabledSecondary),
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  primary: {
    backgroundColor: colors.primary[900],
  },
  secondary: {
    backgroundColor: colors.secondary[100],
  },
  pressed: {
    opacity: 0.8,
  },
  disabledPrimary: {
    backgroundColor: colors.primary[200],
  },
  disabledSecondary: {
    backgroundColor: colors.secondary[50],
  },
  text: {
    fontSize: typography.large.fontSize,
    lineHeight: typography.large.lineHeight,
    fontFamily: fontFamilies.bold,
  },
  textPrimary: {
    color: 'white',
  },
  textSecondary: {
    color: colors.primary[900],
  },
  textDisabledPrimary: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  textDisabledSecondary: {
    color: colors.primary[700],
  },
});
