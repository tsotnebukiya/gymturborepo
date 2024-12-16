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
}

const TopBar = ({
  title,
  actions,
  backAction,
  languageButton,
  logo = false,
  inset = true,
  barBorder = false,
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
          <Image
            style={{ width: 24, height: 32.3 }}
            source={require('~/assets/logo-black.png')}
          />
        )}
        {backAction ? (
          <IconButton
            icon="arrow-left"
            onPress={backAction.onPress}
            rippleColor={colors.rippleColor}
            iconColor="black"
            style={styles.noBorder}
            size={24}
            mode={backAction.mode || 'outlined'}
          />
        ) : (
          <View style={styles.width40} />
        )}
        {title && (
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
            {title}
          </Text>
        )}
        {actions?.length ? (
          actions.map((action, index) => (
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
          ))
        ) : languageButton ? (
          <LanguageButton grayBackground={!onlyLang} />
        ) : (
          // Add a dummy view with the same width as the back button
          <View style={styles.width40} />
        )}
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
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
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
    margin: 0,
  },
  action: {
    margin: 0,
  },
});
