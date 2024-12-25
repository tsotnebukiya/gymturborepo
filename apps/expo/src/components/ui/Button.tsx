import {
  Pressable,
  StyleSheet,
  type ViewStyle,
  ActivityIndicator,
} from 'react-native';
import { Text, Icon } from 'react-native-paper';
import type { IconSource } from 'react-native-paper/lib/typescript/components/Icon';
import colors from '~/lib/utils/colors';
import { fontFamilies, typography } from '~/lib/utils/typography';

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  type?: 'primary' | 'secondary';
  style?: ViewStyle;
  disabled?: boolean;
  flex?: boolean;
  loading?: boolean;
  icon?: IconSource;
  iconPosition?: 'left' | 'right';
}

export default function Button({
  children,
  onPress,
  type = 'primary',
  style,
  disabled = false,
  flex = false,
  loading = false,
  icon,
  iconPosition = 'left',
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        type === 'primary' && styles.primary,
        type === 'secondary' && styles.secondary,
        pressed && styles.pressed,
        (disabled || loading) &&
          (type === 'primary'
            ? styles.disabledPrimary
            : styles.disabledSecondary),
        style,
        flex && { flex: 1 },
      ]}
    >
      {icon && iconPosition === 'left' && !loading && (
        <Icon
          source={icon}
          size={20}
          color={type === 'primary' ? 'white' : colors.primary[900]}
        />
      )}
      <Text
        style={[
          styles.text,
          type === 'primary' && styles.textPrimary,
          type === 'secondary' && styles.textSecondary,
          (disabled || loading) &&
            (type === 'primary'
              ? styles.textDisabledPrimary
              : styles.textDisabledSecondary),
          loading && styles.loadingText,
        ]}
      >
        {children}
      </Text>
      {icon && iconPosition === 'right' && !loading && (
        <Icon
          source={icon}
          size={20}
          color={type === 'primary' ? 'white' : colors.primary[900]}
        />
      )}
      {loading && (
        <ActivityIndicator
          style={styles.loader}
          color={type === 'primary' ? 'white' : colors.primary[900]}
          size="small"
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
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
  loadingText: {
    opacity: 0.7,
  },
  loader: {
    marginLeft: 4,
  },
});
