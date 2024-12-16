import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { fontFamilies, typography } from '~/lib/utils/typography';
import colors from '~/lib/utils/colors';
import {
  type CategoryConstant,
  useCategoryConstants,
} from '~/lib/utils/constants';
import { router } from 'expo-router';

function Item({ item }: { item: CategoryConstant }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.item, pressed && styles.pressed]}
      onPress={() => {
        router.push({
          pathname: '/(auth)/category',
          params: { category: item.category },
        });
      }}
    >
      <View style={styles.itemContent}>
        <Text style={styles.categoryText}>{item.translation}</Text>
      </View>
      <Image source={item.image} style={styles.image} resizeMethod="scale" />
    </Pressable>
  );
}

export default function MuscleCategories() {
  const { t } = useTranslation();
  const categories = useCategoryConstants();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('home.muscleCategories')}</Text>
      <View style={styles.categories}>
        {Array.from(
          { length: Math.ceil(categories.length / 2) },
          (_, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {categories
                .slice(rowIndex * 2, rowIndex * 2 + 2)
                .map((cat, i) => (
                  <Item key={i} item={cat} />
                ))}
            </View>
          )
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  title: {
    fontSize: typography.h5.fontSize,
    lineHeight: typography.h5.lineHeight,
    fontFamily: fontFamilies.bold,
    color: colors.text.general.light,
  },
  categories: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  pressed: {
    opacity: 0.7,
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 100,
    flex: 1,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: colors.surfaceLight,
  },
  itemContent: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  categoryText: {
    fontSize: typography.large.fontSize,
    lineHeight: typography.large.lineHeight,
    fontFamily: fontFamilies.semiBold,
    color: colors.text.general.light,
  },
  image: {
    height: 100,
    width: 100,
  },
});
