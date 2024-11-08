import { StyleSheet, type ViewStyle } from 'react-native';
import { Button, Icon, Text } from 'react-native-paper';

interface Styles {
  wrapper: ViewStyle;
}

interface Props {
  icon: string;
  text: string;
  disabled: boolean;
  localStyles: Styles;
  onPress: () => void;
}

export default function SocialIcon({
  text,
  icon,
  localStyles,
  disabled,
  onPress,
}: Props) {
  return (
    <Button
      icon={() => <Icon size={28} source={icon} color="white" />}
      mode="contained"
      labelStyle={{ color: 'white' }}
      onPress={onPress}
      loading={disabled}
      disabled={disabled}
      style={localStyles.wrapper}
    >
      <Text style={styles.buttonText}>{text}</Text>
    </Button>
  );
}

const styles = StyleSheet.create({
  buttonText: { fontSize: 16, fontWeight: 'bold', color: 'white' },
});
