import { StyleSheet } from 'react-native';
import { Appbar, IconButton } from 'react-native-paper';

interface Props {
  title?: string;
  statusBarHeight?: number;
  actions?: {
    icon: string;
    onPress: () => void;
  }[];
  backAction?: {
    icon: string;
    onPress: () => void;
    mode?: 'contained-tonal' | 'contained' | 'outlined';
  };
  borderBottomColor?: string;
}

const TopBar = ({
  title,
  actions,
  backAction,
  statusBarHeight,
  borderBottomColor,
}: Props) => (
  <Appbar.Header
    mode="center-aligned"
    style={[
      styles.header,
      {
        borderBottomColor: borderBottomColor
          ? borderBottomColor
          : 'transparent',
        borderBottomWidth: 1,
      },
    ]}
    statusBarHeight={statusBarHeight}
  >
    {backAction && (
      <IconButton
        icon="arrow-left"
        onPress={backAction.onPress}
        mode="contained"
      />
    )}
    {title && <Appbar.Content title={title} />}
    {actions?.map((action) => (
      <IconButton icon="arrow-left" onPress={action.onPress} mode="contained" />
    ))}
  </Appbar.Header>
);

export default TopBar;

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'transparent',
  },
});
