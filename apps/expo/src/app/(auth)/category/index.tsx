import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppContext } from '~/lib/contexts/AppContext';
import { StyleSheet, View, Image, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import TopBar from '~/components/shared/TopBar';
import {
  useMuscleCategories,
  useMusclesConstants,
} from '~/lib/utils/constants';
import { type PrismaTypes } from '@acme/api';
import ScrollView from '~/components/shared/ScrollView';
import { useTranslation } from 'react-i18next';
import Gradient from '~/components/ui/Gradient';
import colors from '~/lib/utils/colors';
import { fontFamilies } from '~/lib/utils/typography';
import { typography } from '~/lib/utils/typography';

type Subcategory = PrismaTypes.$Enums.Subcategory;
type Category = PrismaTypes.$Enums.Category;

export default function CategoryListScreen() {
  const musclesConstants = useMusclesConstants();
  const muscleCategories = useMuscleCategories();
  const { t } = useTranslation();
  const { type, category } = useLocalSearchParams<{
    type: 'new' | 'saved' | 'split';
    category?: Category;
  }>();
  const { setSubcategory, setSplitSubcategory } = useAppContext();
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  const handleCategory = (subcategory: Subcategory) => {
    console.log(type);
    if (type === 'saved') {
      setSubcategory(subcategory);
      handleBack();
    } else if (type === 'new') {
      router.push({
        pathname: '/(auth)/category/[subcategory]',
        params: { subcategory },
      });
    } else {
      setSplitSubcategory(subcategory);
      handleBack();
    }
  };

  return (
    <View style={styles.container}>
      <Gradient />
      <View style={styles.contentOuter}>
        <TopBar
          emptyRight={true}
          inset={false}
          title={t('categories.title')}
          barBorder={true}
          backAction={{
            icon: 'arrow-left',
            onPress: handleBack,
          }}
        />
        <ScrollView tabBarPadding={false}>
          <View style={styles.contentContainer}>
            {muscleCategories
              .filter((c) => {
                return category ? c.category === category : true;
              })
              .map((category, index) => (
                <View key={index} style={styles.categoryContainer}>
                  <Text style={styles.categoryTitle}>{category.label}</Text>
                  <View style={styles.subcategoriesList}>
                    {category.subcategories.map((subcategory, subIndex) => {
                      return (
                        <Pressable
                          key={subIndex}
                          onPress={() => handleCategory(subcategory.name)}
                          style={({ pressed }) => [
                            styles.subcategoryItem,
                            pressed && styles.subcategoryItemPressed,
                          ]}
                        >
                          <Image
                            source={musclesConstants[subcategory.name].icon}
                            style={styles.subcategoryImage}
                          />
                          <Text
                            variant="bodyLarge"
                            style={styles.subcategoryName}
                          >
                            {musclesConstants[subcategory.name].label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentOuter: {
    flex: 1,
    paddingTop: 12,
  },
  categoryContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  contentContainer: { paddingHorizontal: 12, paddingVertical: 24, gap: 24 },
  categoryTitle: {
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 10,
    color: colors.text.general.light,
    fontSize: typography.h5.fontSize,
    lineHeight: typography.h5.lineHeight,
    fontFamily: fontFamilies.bold,
  },
  subcategoriesList: {
    overflow: 'hidden',
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  subcategoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    padding: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  subcategoryItemPressed: {
    backgroundColor: colors.surfaceLight,
  },
  subcategoryImage: {
    width: 48,
    height: 48,
  },
  subcategoryName: {
    fontSize: typography.large.fontSize,
    lineHeight: typography.large.lineHeight,
    fontFamily: fontFamilies.semiBold,
    color: colors.text.general.light,
  },
});
