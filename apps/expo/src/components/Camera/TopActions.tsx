import { StyleSheet } from 'react-native';
import { Appbar, IconButton } from 'react-native-paper';

interface Props {
  handleBack: () => void;
  handleInfo?: () => void;
}

const TopActions = ({ handleBack, handleInfo }: Props) => {
  return (
    <Appbar.Header mode="center-aligned" style={styles.header}>
      <IconButton
        icon="arrow-left"
        onPress={handleBack}
        mode="contained"
        iconColor="black"
      />
      {handleInfo ? (
        <IconButton
          icon="message-question-outline"
          onPress={handleInfo}
          mode="contained"
          iconColor="black"
        />
      ) : null}
    </Appbar.Header>
  );
};

export default TopActions;

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'transparent',
    height: 'auto',
    justifyContent: 'space-between',
  },
});
