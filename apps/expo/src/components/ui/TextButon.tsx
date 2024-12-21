import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Icon, Text } from 'react-native-paper';
import colors from '~/lib/utils/colors';
import { fontFamilies, typography } from '~/lib/utils/typography';

interface TextButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: boolean;
  color?: string;
}

export default function TextButton({
  children,
  onPress,
  leftIcon,
  rightIcon,
  color = colors.menuBarIcon.active,
}: TextButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      {leftIcon && (
        <Ionicons
          name={leftIcon}
          size={24}
          color={color}
          style={styles.leftIcon}
        />
      )}
      <View style={{ flex: 1 }}>
        <Text style={[styles.text, { color }]}>{children}</Text>
      </View>
      {rightIcon && (
        <Icon
          source={'chevron-right'}
          size={24}
          color={colors.menuBarIcon.active}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
  },
  pressed: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  leftIcon: {
    marginRight: 20,
  },
  text: {
    fontSize: typography.h6.fontSize,
    lineHeight: typography.h6.lineHeight,
    fontFamily: fontFamilies.bold,
    color: colors.text.general.light,
  },
});
