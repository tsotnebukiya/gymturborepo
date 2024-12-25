// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

import Ionicons from '@expo/vector-icons/Ionicons';
import { type IconProps } from '@expo/vector-icons/build/createIconSet';
import { type ComponentProps } from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import colors from '~/lib/utils/colors';
import { fontFamilies, typography } from '~/lib/utils/typography';

export const TabBarIcon = ({
  style,
  ...rest
}: IconProps<ComponentProps<typeof Ionicons>['name']>) => {
  return <Ionicons size={24} style={[style]} {...rest} />;
};

export const TabBarLabel = ({
  label,
  active,
}: {
  label: string;
  active: boolean;
}) => {
  return (
    <Text style={[styles.label, active ? styles.active : styles.inactive]}>
      {label}
    </Text>
  );
};

const styles = StyleSheet.create({
  label: {
    color: colors.menuBarIcon.active,
    fontSize: typography.small.fontSize,
    lineHeight: typography.xsmall.lineHeight,
  },
  active: {
    color: colors.menuBarIcon.active,
    fontFamily: fontFamilies.bold,
  },
  inactive: {
    color: colors.menuBarIcon.inactive,
    fontFamily: fontFamilies.regular,
  },
});
