import { StyleSheet, View } from 'react-native';
import { Appbar, IconButton } from 'react-native-paper';
import colors from '~/lib/utils/colors';
import LanguageButton from '../LanguageButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
}

const TopBar = ({ title, actions, backAction, languageButton }: Props) => {
  const onlyLang = !backAction && languageButton;
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.header,
        onlyLang && styles.justifyEnd,
        { marginTop: insets.top },
      ]}
    >
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
      {title && <Appbar.Content title={title} />}
      {actions?.map((action, index) => (
        <IconButton
          key={index}
          rippleColor={colors.rippleColor}
          animated={true}
          icon={action.icon}
          onPress={action.onPress}
          mode={action.mode}
          loading={action.loading}
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
    minHeight: 50,
  },
  justifyEnd: {
    justifyContent: 'flex-end',
  },
  noBorder: {
    borderWidth: 0,
    margin: 0,
  },
});
