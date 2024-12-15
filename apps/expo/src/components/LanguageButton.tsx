import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useCurrentLanguage } from '~/i18n';
import { Text } from 'react-native-paper';
import { useState } from 'react';
import LanguageModal from './LanguageModal';
import { fontFamilies, typography } from '~/lib/utils/typography';
import colors from '~/lib/utils/colors';

export default function LanguageButton({
  grayBackground,
}: {
  grayBackground?: boolean;
}) {
  const { code, icon } = useCurrentLanguage();
  const [open, setOpen] = useState(false);
  const handleLanguagePress = () => {
    setOpen(true);
  };

  return (
    <TouchableOpacity
      style={[
        styles.languageContainer,
        grayBackground && styles.grayBackground,
      ]}
      onPress={handleLanguagePress}
      activeOpacity={0.8}
    >
      <Image source={icon} />
      <Text style={styles.text}>{code}</Text>
      <LanguageModal visible={open} onClose={() => setOpen(false)} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  languageContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  grayBackground: {
    backgroundColor: '#F5F5F5',
  },
  text: {
    fontSize: typography.h6.fontSize,
    lineHeight: typography.h6.lineHeight,
    fontFamily: fontFamilies.semiBold,
    color: colors.text.general.brand,
  },
});
