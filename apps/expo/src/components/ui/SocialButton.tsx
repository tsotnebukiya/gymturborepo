import { Image, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import colors from '~/lib/utils/colors';
import { fontFamilies, typography } from '~/lib/utils/typography';

const icons = {
  google: require('~/assets/icons/google.png'),

  apple: require('~/assets/icons/apple.png'),

  facebook: require('~/assets/icons/facebook.png'),
};

interface Props {
  icon: 'google' | 'apple' | 'facebook';
  text: string;
  disabled: boolean;
  loading?: boolean;
  onPress: () => void;
}

export default function SocialIcon({
  text,
  icon,
  disabled,
  loading = false,
  onPress,
}: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator
          color={colors.text.general.light}
          style={styles.icon}
        />
      ) : (
        <Image source={icons[icon]} style={styles.icon} />
      )}
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    padding: 16,
    borderRadius: 100,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    borderColor: colors.border.light,
  },
  pressed: {
    backgroundColor: colors.border.light,
    opacity: 0.8,
  },
  icon: {
    width: 28,
    height: 28,
    position: 'absolute',
    left: 16,
  },
  text: {
    fontSize: typography.large.fontSize,
    lineHeight: typography.large.lineHeight,
    color: colors.text.general.light,
    fontFamily: fontFamilies.bold,
    flex: 1,
    textAlign: 'center',
  },
});
