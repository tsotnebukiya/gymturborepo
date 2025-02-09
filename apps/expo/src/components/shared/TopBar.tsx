import { Image, StyleSheet, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import colors from '~/lib/utils/colors';
import LanguageButton from '../LanguageButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fontFamilies, typography } from '~/lib/utils/typography';

interface Props {
  title?: string;
  actions?: {
    icon: string;
    onPress: () => void;
    mode?: 'contained-tonal' | 'contained' | 'outlined';
    loading?: boolean;
    noBorder?: boolean;
  }[];
  backAction?: {
    icon: string;
    onPress: () => void;
    mode?: 'contained-tonal' | 'contained' | 'outlined';
  };
  languageButton?: boolean;
  flexEnd?: boolean;
  logo?: boolean;
  inset?: boolean;
  barBorder?: boolean;
  children?: React.ReactNode;
  emptyLeft?: boolean;
  emptyRight?: boolean;
}

const TopBar = ({
  title,
  actions,
  backAction,
  languageButton,
  logo = false,
  inset = true,
  barBorder = false,
  children,
  emptyLeft = false,
  emptyRight = false,
}: Props) => {
  const onlyLang = !backAction && languageButton;
  const insets = useSafeAreaInsets();

  return (
    <View style={[barBorder && styles.barBorder]}>
      <View
        style={[
          styles.header,
          onlyLang && styles.justifyEnd,
          { marginTop: inset ? insets.top : 0 },
        ]}
      >
        {logo && (
          <Image style={styles.logo} source={require('~/assets/logo.png')} />
        )}
        {backAction && (
          <IconButton
            icon="arrow-left"
            onPress={backAction.onPress}
            rippleColor={colors.rippleColor}
            iconColor={colors.menuBarIcon.active}
            style={[styles.iconButton, styles.noBorder]}
            mode={backAction.mode || 'outlined'}
            hitSlop={{ top: 4, bottom: 4 }}
          />
        )}
        {emptyLeft ? <View style={styles.width40} /> : null}
        {title && (
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
            {title}
          </Text>
        )}
        {children}

        {actions?.length &&
          actions.map((action, index) => (
            <IconButton
              key={index}
              rippleColor={colors.rippleColor}
              animated={true}
              iconColor={colors.menuBarIcon.active}
              icon={action.icon}
              onPress={action.onPress}
              mode={action.mode}
              loading={action.loading}
              style={styles.iconButton}
            />
          ))}
        {languageButton && <LanguageButton grayBackground={!onlyLang} />}
        {emptyRight ? <View style={styles.width40} /> : null}
      </View>
    </View>
  );
};

export default TopBar;

const styles = StyleSheet.create({
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    display: 'flex',
    minHeight: 42,
    height: 56,
    paddingHorizontal: 12,
  },
  logo: { width: 38, height: 38 },
  barBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: typography.h4.fontSize,
    lineHeight: typography.h4.lineHeight,
    color: colors.text.general.light,
    textAlign: 'center',
    flex: 1,
  },
  width40: {
    width: 40,
  },
  justifyEnd: {
    justifyContent: 'flex-end',
  },
  noBorder: {
    borderWidth: 0,
  },
  iconButton: {
    margin: 0,
    borderColor: colors.menuBarIcon.active,
  },
});
