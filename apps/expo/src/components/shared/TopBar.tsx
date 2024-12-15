import { Image, StyleSheet, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import colors from '~/lib/utils/colors';
import LanguageButton from '../LanguageButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fontFamilies, typography } from '~/lib/utils/typography';

interface Props {
  title?: string;
  statusBarHeight?: number;
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
  borderBottomColor?: string;
  languageButton?: boolean;
  flexEnd?: boolean;
  logo?: boolean;
  inset?: boolean;
}

const TopBar = ({
  title,
  actions,
  backAction,
  languageButton,
  logo = false,
  inset = true,
}: Props) => {
  const onlyLang = !backAction && languageButton;
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.header,
        onlyLang && styles.justifyEnd,
        { marginTop: inset ? insets.top : 0 },
      ]}
    >
      {logo && (
        <Image
          style={{ width: 24, height: 32.3 }}
          source={require('~/assets/logo-black.png')}
        />
      )}
      {backAction && (
        <IconButton
          icon="arrow-left"
          onPress={backAction.onPress}
          rippleColor={colors.rippleColor}
          iconColor="black"
          style={styles.noBorder}
          size={24}
          mode={backAction.mode || 'outlined'}
        />
      )}
      {title && <Text style={styles.title}>{title}</Text>}
      {actions?.map((action, index) => (
        <IconButton
          key={index}
          rippleColor={colors.rippleColor}
          animated={true}
          icon={action.icon}
          onPress={action.onPress}
          mode={action.mode}
          loading={action.loading}
          style={styles.action}
        />
      ))}
      {languageButton && <LanguageButton grayBackground={!onlyLang} />}
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
  },
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: typography.h4.fontSize,
    lineHeight: typography.h4.lineHeight,
    color: colors.text.general.light,
  },
  justifyEnd: {
    justifyContent: 'flex-end',
  },
  noBorder: {
    borderWidth: 0,
    margin: 0,
  },
  action: {
    margin: 0,
  },
});
