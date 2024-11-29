import { type PrismaTypes } from '@acme/api';
import { useTranslation } from 'react-i18next';

export function useMusclesConstants() {
  const { t } = useTranslation();

  return {
    // Core
    UPPER_ABS: {
      icon: require('~/assets/muscles/upperabs.png'),
      label: t('muscles.upper_abs'),
      category: 'Core',
    },
    LOWER_ABS: {
      icon: require('~/assets/muscles/lowerabs.png'),
      label: t('muscles.lower_abs'),
      category: 'Core',
    },
    SIDE_ABS: {
      icon: require('~/assets/muscles/sideabs.png'),
      label: t('muscles.side_abs'),
      category: 'Core',
    },
    ABDOMINALS: {
      icon: require('~/assets/muscles/abdominals.png'),
      label: t('muscles.abs'),
      category: 'Core',
    },

    // Back
    UPPER_BACK: {
      icon: require('~/assets/muscles/upperback.png'),
      label: t('muscles.upper_back'),
      category: 'Back',
    },
    MIDDLE_BACK: {
      icon: require('~/assets/muscles/middleback.png'),
      label: t('muscles.middle_back'),
      category: 'Back',
    },
    LOWER_BACK: {
      icon: require('~/assets/muscles/lowerback.png'),
      label: t('muscles.lower_back'),
      category: 'Back',
    },

    // Arms
    BICEPS: {
      icon: require('~/assets/muscles/biceps.png'),
      label: t('muscles.biceps'),
      category: 'Arms',
    },
    TRICEPS: {
      icon: require('~/assets/muscles/triceps.png'),
      label: t('muscles.triceps'),
      category: 'Arms',
    },
    WRIST_EXTENSORS: {
      icon: require('~/assets/muscles/wristextensors.png'),
      label: t('muscles.wrist_extensors'),
      category: 'Arms',
    },
    WRIST_FLEXORS: {
      icon: require('~/assets/muscles/wristflexors.png'),
      label: t('muscles.wrist_flexors'),
      category: 'Arms',
    },

    // Chest
    CHEST: {
      icon: require('~/assets/muscles/chest.png'),
      label: t('muscles.chest'),
      category: 'Chest',
    },

    // Shoulders
    REAR_SHOULDER: {
      icon: require('~/assets/muscles/rearshoulder.png'),
      label: t('muscles.rear_shoulder'),
      category: 'Shoulders',
    },
    FRONT_SHOULDER: {
      icon: require('~/assets/muscles/frontshoulder.png'),
      label: t('muscles.front_shoulder'),
      category: 'Shoulders',
    },
    SIDE_SHOULDER: {
      icon: require('~/assets/muscles/placeholder.png'),
      label: t('muscles.side_shoulder'),
      category: 'Shoulders',
    },

    // Legs
    QUADRICEPS: {
      icon: require('~/assets/muscles/quadriceps.png'),
      label: t('muscles.quadriceps'),
      category: 'Legs',
    },
    HAMSTRINGS: {
      icon: require('~/assets/muscles/hamstrings.png'),
      label: t('muscles.hamstrings'),
      category: 'Legs',
    },
    CALVES: {
      icon: require('~/assets/muscles/calves.png'),
      label: t('muscles.calves'),
      category: 'Legs',
    },
    GLUTES: {
      icon: require('~/assets/muscles/glutes.png'),
      label: t('muscles.glutes'),
      category: 'Legs',
    },
    INNER_THIGHS: {
      icon: require('~/assets/muscles/innerthighs.png'),
      label: t('muscles.inner_thighs'),
      category: 'Legs',
    },
    OUTER_THIGHS: {
      icon: require('~/assets/muscles/outerthighs.png'),
      label: t('muscles.outer_thighs'),
      category: 'Legs',
    },
  } as const;
}

export const muscleCategories = Object.entries(musclesConstants).reduce<
  {
    category: string;
    subcategories: {
      label: string;
      icon: number;
      name: PrismaTypes.$Enums.Subcategory;
    }[];
  }[]
>((acc, [key, muscle]) => {
  const existingCategory = acc.find((cat) => cat.category === muscle.category);

  if (existingCategory) {
    existingCategory.subcategories.push({
      label: muscle.label,
      icon: muscle.icon,
      name: key as PrismaTypes.$Enums.Subcategory,
    });
  } else {
    acc.push({
      category: muscle.category,
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
