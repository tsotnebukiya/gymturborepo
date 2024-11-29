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

type Subcategory = PrismaTypes.$Enums.Subcategory;

export default function CategoryListScreen() {
  const musclesConstants = useMusclesConstants();
  const muscleCategories = useMuscleCategories();
  const { t } = useTranslation();
  const { type } = useLocalSearchParams<{
    type: 'new' | 'saved' | 'split';
  }>();
  const { setSubcategory, setSplitSubcategory } = useAppContext();
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  const handleCategory = (subcategory: Subcategory) => {
    if (type === 'saved') {
      setSubcategory(subcategory);
      handleBack();
    } else if (type === 'new') {
      router.push({
        pathname: '/(auth)/category/[subcategory]',
        params: { subcategory },
      });
      // WEAREHERE
    } else {
      setSplitSubcategory(subcategory);
      handleBack();
    }
  };

  return (
    <View style={styles.container}>
      <TopBar
        statusBarHeight={0}
        title={t('categories.title')}
        borderBottomColor="#E0E0E0"
        backAction={{
          icon: 'arrow-left',
          onPress: handleBack,
        }}
      />
      <ScrollView>
        {muscleCategories.map((category, index) => (
          <View key={index} style={styles.categoryContainer}>
            <Text variant="titleMedium" style={styles.categoryTitle}>
              {category.label}
            </Text>
            <View style={styles.subcategoriesList}>
              {category.subcategories.map((subcategory, subIndex) => {
                return (
                  <Pressable
                    key={subIndex}
                    onPress={() => handleCategory(subcategory.name)}
                    style={({ pressed }) => [
                      styles.subcategoryItem,
                      pressed && styles.subcategoryItemPressed,
                      { width: '100%' },
                    ]}
                  >
                    <Image
                      source={musclesConstants[subcategory.name].icon}
                      style={styles.subcategoryImage}
                    />
                    <Text variant="bodyLarge" style={styles.subcategoryName}>
                      {musclesConstants[subcategory.name].label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: 'white',
    gap: 24,
  },
  categoryContainer: {
    marginBottom: 24,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  categoryTitle: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    color: '#1a1a1a',
  },
  subcategoriesList: {
    overflow: 'hidden',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  subcategoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  subcategoryItemPressed: {
    backgroundColor: '#e0e0e0',
  },
  subcategoryImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
  },
  subcategoryName: {
    fontSize: 16,
  },
});
