import { type PrismaTypes } from '@acme/api';
import { useTranslation } from 'react-i18next';

export function useMusclesConstants() {
  const { t } = useTranslation();
  return {
    // Core
    UPPER_ABS: {
      icon: require('~/assets/muscles/upperabs.png'),
      label: t('muscles.upper_abs'),
      category: 'core',
    },
    LOWER_ABS: {
      icon: require('~/assets/muscles/lowerabs.png'),
      label: t('muscles.lower_abs'),
      category: 'core',
    },
    SIDE_ABS: {
      icon: require('~/assets/muscles/sideabs.png'),
      label: t('muscles.side_abs'),
      category: 'core',
    },
    ABDOMINALS: {
      icon: require('~/assets/muscles/abdominals.png'),
      label: t('muscles.abs'),
      category: 'core',
    },

    // Back
    UPPER_BACK: {
      icon: require('~/assets/muscles/upperback.png'),
      label: t('muscles.upper_back'),
      category: 'back',
    },
    MIDDLE_BACK: {
      icon: require('~/assets/muscles/middleback.png'),
      label: t('muscles.middle_back'),
      category: 'back',
    },
    LOWER_BACK: {
      icon: require('~/assets/muscles/lowerback.png'),
      label: t('muscles.lower_back'),
      category: 'back',
    },

    // Arms
    BICEPS: {
      icon: require('~/assets/muscles/biceps.png'),
      label: t('muscles.biceps'),
      category: 'arms',
    },
    TRICEPS: {
      icon: require('~/assets/muscles/triceps.png'),
      label: t('muscles.triceps'),
      category: 'arms',
    },
    WRIST_EXTENSORS: {
      icon: require('~/assets/muscles/wristextensors.png'),
      label: t('muscles.wrist_extensors'),
      category: 'arms',
    },
    WRIST_FLEXORS: {
      icon: require('~/assets/muscles/wristflexors.png'),
      label: t('muscles.wrist_flexors'),
      category: 'arms',
    },

    // Chest
    CHEST: {
      icon: require('~/assets/muscles/chest.png'),
      label: t('muscles.chest'),
      category: 'chest',
    },

    // Shoulders
    REAR_SHOULDER: {
      icon: require('~/assets/muscles/rearshoulder.png'),
      label: t('muscles.rear_shoulder'),
      category: 'shoulders',
    },
    FRONT_SHOULDER: {
      icon: require('~/assets/muscles/frontshoulder.png'),
      label: t('muscles.front_shoulder'),
      category: 'shoulders',
    },
    SIDE_SHOULDER: {
      icon: require('~/assets/muscles/placeholder.png'),
      label: t('muscles.side_shoulder'),
      category: 'shoulders',
    },

    // Legs
    QUADRICEPS: {
      icon: require('~/assets/muscles/quadriceps.png'),
      label: t('muscles.quadriceps'),
      category: 'legs',
    },
    HAMSTRINGS: {
      icon: require('~/assets/muscles/hamstrings.png'),
      label: t('muscles.hamstrings'),
      category: 'legs',
    },
    CALVES: {
      icon: require('~/assets/muscles/calves.png'),
      label: t('muscles.calves'),
      category: 'legs',
    },
    GLUTES: {
      icon: require('~/assets/muscles/glutes.png'),
      label: t('muscles.glutes'),
      category: 'legs',
    },
    INNER_THIGHS: {
      icon: require('~/assets/muscles/innerthighs.png'),
      label: t('muscles.inner_thighs'),
      category: 'legs',
    },
    OUTER_THIGHS: {
      icon: require('~/assets/muscles/outerthighs.png'),
      label: t('muscles.outer_thighs'),
      category: 'legs',
    },
  } as const;
}

export function useMuscleCategories() {
  const { t } = useTranslation();
  const musclesConstants = useMusclesConstants();

  const categoryTranslations: Record<string, string> = {
    core: t('muscles.categories.core'),
    back: t('muscles.categories.back'),
    arms: t('muscles.categories.arms'),
    chest: t('muscles.categories.chest'),
    shoulders: t('muscles.categories.shoulders'),
    legs: t('muscles.categories.legs'),
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
        label: categoryTranslations[muscle.category]!,
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

export function useCategoryConstants() {
  const { t } = useTranslation();

  return [
    {
      translation: t('muscles.categories.shoulders'),
      image: require('~/assets/musclepictures/shoulders.png'),
    },
    {
      translation: t('muscles.categories.chest'),
      image: require('~/assets/musclepictures/chest.png'),
    },
    {
      translation: t('muscles.categories.arms'),
      image: require('~/assets/musclepictures/arms.png'),
    },
    {
      translation: t('muscles.categories.back'),
      image: require('~/assets/musclepictures/back.png'),
    },
    {
      translation: t('muscles.categories.core'),
      image: require('~/assets/musclepictures/abs.png'),
    },
    {
      translation: t('muscles.categories.legs'),
      image: require('~/assets/musclepictures/legs.png'),
    },
  ];
}
