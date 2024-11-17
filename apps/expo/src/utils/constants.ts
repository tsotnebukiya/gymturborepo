import { type PrismaTypes } from '@acme/api';

export const musclesConstants: Record<
  PrismaTypes.$Enums.Subcategory,
  {
    icon: number;
    label: string;
    category: string;
  }
> = {
  // Core
  UPPER_ABS: {
    icon: require('~/assets/muscles/upperabs.png'),
    label: 'Upper Abs',
    category: 'Core',
  },
  LOWER_ABS: {
    icon: require('~/assets/muscles/lowerabs.png'),
    label: 'Lower Abs',
    category: 'Core',
  },
  SIDE_ABS: {
    icon: require('~/assets/muscles/sideabs.png'),
    label: 'Side Abs',
    category: 'Core',
  },
  ABDOMINALS: {
    icon: require('~/assets/muscles/abdominals.png'),
    label: 'Abdominals',
    category: 'Core',
  },

  // Back
  UPPER_BACK: {
    icon: require('~/assets/muscles/upperback.png'),
    label: 'Upper Back',
    category: 'Back',
  },
  MIDDLE_BACK: {
    icon: require('~/assets/muscles/middleback.png'),
    label: 'Middle Back',
    category: 'Back',
  },
  LOWER_BACK: {
    icon: require('~/assets/muscles/lowerback.png'),
    label: 'Lower Back',
    category: 'Back',
  },

  // Arms
  BICEPS: {
    icon: require('~/assets/muscles/biceps.png'),
    label: 'Biceps',
    category: 'Arms',
  },
  TRICEPS: {
    icon: require('~/assets/muscles/triceps.png'),
    label: 'Triceps',
    category: 'Arms',
  },
  WRIST_EXTENSORS: {
    icon: require('~/assets/muscles/wristextensors.png'),
    label: 'Wrist Extensors',
    category: 'Arms',
  },
  WRIST_FLEXORS: {
    icon: require('~/assets/muscles/wristflexors.png'),
    label: 'Wrist Flexors',
    category: 'Arms',
  },

  // Chest
  CHEST: {
    icon: require('~/assets/muscles/chest.png'),
    label: 'Chest',
    category: 'Chest',
  },

  // Shoulders
  REAR_SHOULDER: {
    icon: require('~/assets/muscles/rearshoulder.png'),
    label: 'Rear Shoulder',
    category: 'Shoulders',
  },
  FRONT_SHOULDER: {
    icon: require('~/assets/muscles/frontshoulder.png'),
    label: 'Front Shoulder',
    category: 'Shoulders',
  },
  SIDE_SHOULDER: {
    icon: require('~/assets/muscles/placeholder.png'),
    label: 'Side Shoulder',
    category: 'Shoulders',
  },

  // Legs
  QUADRICEPS: {
    icon: require('~/assets/muscles/quadriceps.png'),
    label: 'Quadriceps',
    category: 'Legs',
  },
  HAMSTRINGS: {
    icon: require('~/assets/muscles/hamstrings.png'),
    label: 'Hamstrings',
    category: 'Legs',
  },
  CALVES: {
    icon: require('~/assets/muscles/calves.png'),
    label: 'Calves',
    category: 'Legs',
  },
  GLUTES: {
    icon: require('~/assets/muscles/glutes.png'),
    label: 'Glutes',
    category: 'Legs',
  },
  INNER_THIGHS: {
    icon: require('~/assets/muscles/innerthighs.png'),
    label: 'Inner Thighs',
    category: 'Legs',
  },
  OUTER_THIGHS: {
    icon: require('~/assets/muscles/outerthighs.png'),
    label: 'Outer Thighs',
    category: 'Legs',
  },
} as const;

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

export type MuscleKey = keyof typeof musclesConstants;

export const splitDayConstants: Record<PrismaTypes.$Enums.SplitDay, string> = {
  MONDAY: 'Monday',
  TUESDAY: 'Tuesday',
  WEDNESDAY: 'Wednesday',
  THURSDAY: 'Thursday',
  FRIDAY: 'Friday',
  SATURDAY: 'Saturday',
  SUNDAY: 'Sunday',
} as const;

export type SplitDayKey = keyof typeof splitDayConstants;
