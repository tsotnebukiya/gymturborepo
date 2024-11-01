import { StyleSheet } from 'react-native';
import { Appbar, IconButton } from 'react-native-paper';

interface Props {
  title?: string;
  actions?: {
    icon: string;
    onPress: () => void;
  }[];
  backAction?: {
    icon: string;
    onPress: () => void;
    mode?: 'contained-tonal' | 'contained' | 'outlined';
  };
}

const TopBar = ({ title, actions, backAction }: Props) => (
  <Appbar.Header mode="center-aligned" style={styles.header}>
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
