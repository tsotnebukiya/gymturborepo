import { StyleSheet } from 'react-native';
import { Appbar, IconButton } from 'react-native-paper';

interface Props {
  title?: string;
  statusBarHeight?: number;
  actions?: {
    icon: string;
    onPress: () => void;
    mode?: 'contained-tonal' | 'contained' | 'outlined';
    loading?: boolean;
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
        mode={backAction.mode ?? 'contained'}
      />
    )}
    {title && <Appbar.Content title={title} />}
    {actions?.map((action, index) => (
      <IconButton
        key={index}
        icon={action.icon}
        onPress={action.onPress}
        mode={action.mode}
        loading={action.loading}
      />
    ))}
  </Appbar.Header>
);

export default TopBar;

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'transparent',
  },
});
