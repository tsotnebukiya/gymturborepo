import { type PrismaTypes } from '@acme/api';

export const musclesConstants: Record<
  PrismaTypes.$Enums.Subcategory,
  {
    icon: number;
    label: string;
  }
> = {
  // Core
  UPPER_ABS: {
    icon: require('~/assets/muscles/upperabs.png'),
    label: 'Upper Abs',
  },
  LOWER_ABS: {
    icon: require('~/assets/muscles/lowerabs.png'),
    label: 'Lower Abs',
  },
  SIDE_ABS: {
    icon: require('~/assets/muscles/sideabs.png'),
    label: 'Side Abs',
  },
  ABDOMINALS: {
    icon: require('~/assets/muscles/abdominals.png'),
    label: 'Abdominals',
  },

  // Back
  UPPER_BACK: {
    icon: require('~/assets/muscles/upperback.png'),
    label: 'Upper Back',
  },
  MIDDLE_BACK: {
    icon: require('~/assets/muscles/middleback.png'),
    label: 'Middle Back',
  },
  LOWER_BACK: {
    icon: require('~/assets/muscles/lowerback.png'),
    label: 'Lower Back',
  },

  // Arms
  BICEPS: {
    icon: require('~/assets/muscles/biceps.png'),
    label: 'Biceps',
  },
  TRICEPS: {
    icon: require('~/assets/muscles/triceps.png'),
    label: 'Triceps',
  },
  WRIST_EXTENSORS: {
    icon: require('~/assets/muscles/wristextensors.png'),
    label: 'Wrist Extensors',
  },
  WRIST_FLEXORS: {
    icon: require('~/assets/muscles/wristflexors.png'),
    label: 'Wrist Flexors',
  },

  // Chest
  CHEST: {
    icon: require('~/assets/muscles/chest.png'),
    label: 'Chest',
  },

  // Shoulders
  REAR_SHOULDER: {
    icon: require('~/assets/muscles/rearshoulder.png'),
    label: 'Rear Shoulder',
  },
  FRONT_SHOULDER: {
    icon: require('~/assets/muscles/frontshoulder.png'),
    label: 'Front Shoulder',
  },
  SIDE_SHOULDER: {
    icon: require('~/assets/muscles/placeholder.png'),
    label: 'Side Shoulder',
  },

  // Legs
  QUADRICEPS: {
    icon: require('~/assets/muscles/quadriceps.png'),
    label: 'Quadriceps',
  },
  HAMSTRINGS: {
    icon: require('~/assets/muscles/hamstrings.png'),
    label: 'Hamstrings',
  },
  CALVES: {
    icon: require('~/assets/muscles/calves.png'),
    label: 'Calves',
  },
  GLUTES: {
    icon: require('~/assets/muscles/glutes.png'),
    label: 'Glutes',
  },
  INNER_THIGHS: {
    icon: require('~/assets/muscles/innerthighs.png'),
    label: 'Inner Thighs',
  },
  OUTER_THIGHS: {
    icon: require('~/assets/muscles/outerthighs.png'),
    label: 'Outer Thighs',
  },
} as const;

export type MuscleKey = keyof typeof musclesConstants;
