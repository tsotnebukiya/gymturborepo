import { StyleSheet, View, Text, Image } from 'react-native';
import TopBar from '~/components/shared/TopBar';
import { router, useLocalSearchParams } from 'expo-router';
import ScrollView from '~/components/shared/ScrollView';
import Gradient from '~/components/ui/Gradient';
import Button from '~/components/ui/Button';
import { Card, TextInput } from 'react-native-paper';
import { useState } from 'react';
import colors from '~/lib/utils/colors';
import { fontFamilies, typography } from '~/lib/utils/typography';
import { useTranslation } from 'react-i18next';
import { api } from '~/lib/utils/api';

export default function SupportScreen() {
  const { t } = useTranslation();
  const [step, setStep] = useState<'initial' | 'success'>('initial');
  const { generationId } = useLocalSearchParams();
  const [message, setMessage] = useState('');
  const { mutate, isPending } = api.support.getSupport.useMutation({
    onSettled: () => {
      setStep('success');
    },
  });
  const handleBack = () => {
    router.back();
  };

  const handleSubmit = () => {
    mutate({ message, generationId: generationId as string });
  };
  const clearInput = () => {
    setMessage('');
  };
  return (
    <View style={styles.container}>
      <Gradient />
      <TopBar
        inset={false}
        title={
          generationId
            ? t('support.reportGenerationIssueTitle')
            : t('support.helpImproveAppTitle')
        }
        barBorder={true}
        backAction={{
          icon: 'arrow-left',
          onPress: handleBack,
        }}
        emptyRight={true}
      />
      <ScrollView>
        <View style={styles.contentContainer}>
          {step === 'initial' && (
            <>
              <Card style={styles.card} mode="outlined">
                <Card.Content>
                  <Text style={styles.description}>
                    {generationId
                      ? t('support.reportGenerationIssue')
                      : t('support.helpImproveApp')}
                  </Text>
                </Card.Content>
              </Card>
              <View style={styles.inputContainer}>
                <TextInput
                  dense={true}
                  value={message}
                  right={
                    message ? (
                      <TextInput.Icon onPress={clearInput} icon="close" />
                    ) : undefined
                  }
                  autoFocus={false}
                  mode="outlined"
                  multiline={true}
                  placeholder={t('support.placeholder')}
                  keyboardType="default"
                  showSoftInputOnFocus={true}
                  style={styles.searchInput}
                  outlineStyle={styles.searchOutline}
                  onChangeText={setMessage}
                />
              </View>
              <Button
                onPress={handleSubmit}
                disabled={!message}
                loading={isPending}
              >
                {generationId
                  ? t('support.sendReport')
                  : t('support.sendFeedback')}
              </Button>
            </>
          )}
          {step === 'success' && (
            <>
              <Image
                source={require('~/assets/icons/successmessage.png')}
                style={styles.successImage}
              />
              <View style={styles.successTextContainer}>
                <Text style={styles.successTitle}>
                  {t('support.successTitle')}
                </Text>
                <Text style={styles.successSubtitle}>
                  {t('support.successSubtitle')}
                </Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 12,
  },
  contentContainer: {
    flex: 1,
    gap: 24,
    marginTop: 24,
    paddingHorizontal: 12,
  },
  card: {},
  description: {
    fontSize: typography.large.fontSize,
    lineHeight: typography.large.lineHeight,
    color: colors.text.general.brand,
    textAlign: 'center',
  },
  inputContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchOutline: {
    borderRadius: 10,
  },
  searchInput: {
    alignSelf: 'stretch',
    height: 160,
  },
  successImage: {
    width: 124,
    height: 120,
    alignSelf: 'center',
  },
  successTextContainer: {
    gap: 12,
  },
  successTitle: {
    fontSize: typography.h3.fontSize,
    lineHeight: typography.h3.lineHeight,
    color: colors.text.general.light,
    fontFamily: fontFamilies.bold,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: typography.large.fontSize,
    lineHeight: typography.large.lineHeight,
    color: colors.text.general.greyscale,
    fontFamily: fontFamilies.regular,
    textAlign: 'center',
  },
});
