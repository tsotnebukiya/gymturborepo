import { ScrollView, StyleSheet, View, Image, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { type RouterOutputs } from '~/utils/api';
import TopBar from '~/components/TopBar';
import { useMemo } from 'react';
import { musclesConstants } from '~/utils/constants';
import { type PrismaTypes } from '@acme/api';

type Category = PrismaTypes.$Enums.Category;
type Subcategory = PrismaTypes.$Enums.Subcategory;

type GenerationData = RouterOutputs['generation']['getOne'];

interface Props {
  data: NonNullable<GenerationData>;
  handleBack: () => void;
}

interface SubcategoryInfo {
  name: Subcategory;
}

export default function CategoriesView({ data, handleBack }: Props) {
  const organizedCategories = useMemo(() => {
    const categoriesMap = new Map<Category, Set<Subcategory>>();

    data.exercise.forEach((exercise) => {
      if (!categoriesMap.has(exercise.category)) {
        categoriesMap.set(exercise.category, new Set());
      }
      categoriesMap.get(exercise.category)?.add(exercise.subcategory);
    });

    return Array.from(categoriesMap).map(([category, subcategories]) => ({
      category,
      subcategories: Array.from(subcategories).map((name) => ({
        name,
      })) as SubcategoryInfo[],
    }));
  }, [data.exercise]);

  return (
    <View style={styles.container}>
      <TopBar
        statusBarHeight={0}
        title={data.name!}
        borderBottomColor="#E0E0E0"
        backAction={{
          icon: 'arrow-left',
          onPress: handleBack,
        }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
        style={styles.scrollView}
      >
        {organizedCategories.map((category, index) => (
          <View key={index} style={styles.categoryContainer}>
            <Text variant="titleMedium" style={styles.categoryTitle}>
              {category.category}
            </Text>
            <View style={styles.subcategoriesList}>
              {category.subcategories.map((subcategory, subIndex) => {
                return (
                  <Pressable
                    key={subIndex}
                    style={({ pressed }) => [
                      styles.subcategoryItem,
                      pressed && styles.subcategoryItemPressed,
                    ]}
                    onPress={() => {
                      console.log('Pressed:', subcategory.name);
                    }}
                  >
                    <Image
                      source={musclesConstants[subcategory.name].icon}
                      style={styles.subcategoryImage}
                    />
                    <Text variant="bodyLarge" style={styles.subcategoryName}>
                      {subcategory.name}
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
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
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
