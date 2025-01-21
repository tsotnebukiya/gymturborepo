import { type PrismaTypes } from '@acme/api';
import { useTranslation } from 'react-i18next';

export const ANDROID_BOTTOM_PADDING = 34;

export function useMusclesConstants() {
  const { t } = useTranslation();
  return {
    // Core
    UPPER_ABS: {
      icon: require('~/assets/muscles/upperabs.png'),
      label: t('muscles.upper_abs'),
      category: 'CORE',
    },
    LOWER_ABS: {
      icon: require('~/assets/muscles/lowerabs.png'),
      label: t('muscles.lower_abs'),
      category: 'CORE',
    },
    SIDE_ABS: {
      icon: require('~/assets/muscles/sideabs.png'),
      label: t('muscles.side_abs'),
      category: 'CORE',
    },
    ABDOMINALS: {
      icon: require('~/assets/muscles/abdominals.png'),
      label: t('muscles.abs'),
      category: 'CORE',
    },

    // Back
    UPPER_BACK: {
      icon: require('~/assets/muscles/upperback.png'),
      label: t('muscles.upper_back'),
      category: 'BACK',
    },
    MIDDLE_BACK: {
      icon: require('~/assets/muscles/middleback.png'),
      label: t('muscles.middle_back'),
      category: 'BACK',
    },
    LOWER_BACK: {
      icon: require('~/assets/muscles/lowerback.png'),
      label: t('muscles.lower_back'),
      category: 'BACK',
    },

    // Arms
    BICEPS: {
      icon: require('~/assets/muscles/biceps.png'),
      label: t('muscles.biceps'),
      category: 'ARMS',
    },
    TRICEPS: {
      icon: require('~/assets/muscles/triceps.png'),
      label: t('muscles.triceps'),
      category: 'ARMS',
    },
    WRIST_EXTENSORS: {
      icon: require('~/assets/muscles/wristextensors.png'),
      label: t('muscles.wrist_extensors'),
      category: 'ARMS',
    },
    WRIST_FLEXORS: {
      icon: require('~/assets/muscles/wristflexors.png'),
      label: t('muscles.wrist_flexors'),
      category: 'ARMS',
    },

    // Chest
    CHEST: {
      icon: require('~/assets/muscles/chest.png'),
      label: t('muscles.chest'),
      category: 'CHEST',
    },

    // Shoulders
    REAR_SHOULDER: {
      icon: require('~/assets/muscles/rearshoulder.png'),
      label: t('muscles.rear_shoulder'),
      category: 'SHOULDERS',
    },
    FRONT_SHOULDER: {
      icon: require('~/assets/muscles/frontshoulder.png'),
      label: t('muscles.front_shoulder'),
      category: 'SHOULDERS',
    },
    SIDE_SHOULDER: {
      icon: require('~/assets/muscles/sideshoulder.png'),
      label: t('muscles.side_shoulder'),
      category: 'SHOULDERS',
    },

    // Legs
    QUADRICEPS: {
      icon: require('~/assets/muscles/quadriceps.png'),
      label: t('muscles.quadriceps'),
      category: 'LEGS',
    },
    HAMSTRINGS: {
      icon: require('~/assets/muscles/hamstrings.png'),
      label: t('muscles.hamstrings'),
      category: 'LEGS',
    },
    CALVES: {
      icon: require('~/assets/muscles/calves.png'),
      label: t('muscles.calves'),
      category: 'LEGS',
    },
    GLUTES: {
      icon: require('~/assets/muscles/glutes.png'),
      label: t('muscles.glutes'),
      category: 'LEGS',
    },
    INNER_THIGHS: {
      icon: require('~/assets/muscles/innerthighs.png'),
      label: t('muscles.inner_thighs'),
      category: 'LEGS',
    },
    OUTER_THIGHS: {
      icon: require('~/assets/muscles/outerthighs.png'),
      label: t('muscles.outer_thighs'),
      category: 'LEGS',
    },
  } as const;
}

export function useMuscleCategories() {
  const { t } = useTranslation();
  const musclesConstants = useMusclesConstants();

  const categoryTranslations: Record<PrismaTypes.$Enums.Category, string> = {
    CORE: t('muscles.categories.core'),
    BACK: t('muscles.categories.back'),
    ARMS: t('muscles.categories.arms'),
    CHEST: t('muscles.categories.chest'),
    SHOULDERS: t('muscles.categories.shoulders'),
    LEGS: t('muscles.categories.legs'),
  };

  const returnValue = Object.entries(musclesConstants).reduce<
    {
      category: string;
      label: string;
      subcategories: {
        label: string;
        icon: number;
        name: PrismaTypes.$Enums.Subcategory;
      }[];
    }[]
  >((acc, [key, muscle]) => {
    const existingCategory = acc.find(
      (cat) => cat.category === muscle.category
    );

    if (existingCategory) {
      existingCategory.subcategories.push({
        label: muscle.label,
        icon: muscle.icon,
        name: key as PrismaTypes.$Enums.Subcategory,
      });
    } else {
      acc.push({
        category: muscle.category,
        label: categoryTranslations[muscle.category],
        subcategories: [
          {
            label: muscle.label,
            icon: muscle.icon,
            name: key as PrismaTypes.$Enums.Subcategory,
          },
        ],
      });
    }

    return acc;
  }, []);
  return returnValue;
}

export function useSplitDayConstants() {
  const { t } = useTranslation();

  return {
    MONDAY: t('splits.days.monday'),
    TUESDAY: t('splits.days.tuesday'),
    WEDNESDAY: t('splits.days.wednesday'),
    THURSDAY: t('splits.days.thursday'),
    FRIDAY: t('splits.days.friday'),
    SATURDAY: t('splits.days.saturday'),
    SUNDAY: t('splits.days.sunday'),
  } as const;
}

export type MuscleKey = PrismaTypes.$Enums.Subcategory;
export type SplitDayKey = PrismaTypes.$Enums.SplitWeekDay;
export type Category = PrismaTypes.$Enums.Category;

export interface CategoryConstant {
  translation: string;
  image: number;
  category: Category;
}
export function useCategoryConstants(): CategoryConstant[] {
  const { t } = useTranslation();

  return [
    {
      translation: t('muscles.categories.shoulders'),
      image: require('~/assets/musclepictures/shoulders.png'),
      category: 'SHOULDERS',
    },
    {
      translation: t('muscles.categories.chest'),
      image: require('~/assets/musclepictures/chest.png'),
      category: 'CHEST',
    },
    {
      translation: t('muscles.categories.arms'),
      image: require('~/assets/musclepictures/arms.png'),
      category: 'ARMS',
    },
    {
      translation: t('muscles.categories.back'),
      image: require('~/assets/musclepictures/back.png'),
      category: 'BACK',
    },
    {
      translation: t('muscles.categories.core'),
      image: require('~/assets/musclepictures/abs.png'),
      category: 'CORE',
    },
    {
      translation: t('muscles.categories.legs'),
      image: require('~/assets/musclepictures/legs.png'),
      category: 'LEGS',
    },
  ];
}
