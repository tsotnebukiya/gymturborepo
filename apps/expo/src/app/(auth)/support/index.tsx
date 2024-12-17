import { StyleSheet, View } from 'react-native';
import TopBar from '~/components/shared/TopBar';
import { router } from 'expo-router';
import ScrollView from '~/components/shared/ScrollView';
import { useCurrentLanguage } from '~/i18n';
import Gradient from '~/components/ui/Gradient';

export default function SupportScreen() {
  const { language } = useCurrentLanguage();

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <Gradient />
      <TopBar
        inset={false}
        title={`Leave a message`}
        barBorder={true}
        backAction={{
          icon: 'arrow-left',
          onPress: handleBack,
        }}
      />
      <ScrollView>
        <View style={styles.contentContainer}></View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 12,
  },
  contentContainer: {
    gap: 24,
    marginTop: 24,
    paddingHorizontal: 12,
  },
});
