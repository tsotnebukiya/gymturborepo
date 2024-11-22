import { zodResponseFormat } from 'openai/helpers/zod.mjs';
import { z } from 'zod';
import { openai } from './openai';

interface ExerciseDummyData {
  name: string;
  videoId: string;
  videoStart: number;
  videoEnd: number;
}

export const exercisesDummyData: ExerciseDummyData[] = [
  {
    name: 'Incline Bench Leg Raises',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Hanging Leg Raise',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Cable Crunch',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Ab Wheel Rollout',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Weighted Russian Twist',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Seated Leg Tuck',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Hanging Knee Raise',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Reverse Crunch',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Cable Reverse Crunch',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Incline Leg HIIT',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Side Plank Cable Pull',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Woodchoppers',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Cable Side Crunch',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Russian Twist with Medicine Ball',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Hanging Oblique Raise',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Cable Crunch',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Decline Sit-Up',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Hanging Leg Raise',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Pivoting Crunch',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Ab Machine Crunch',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  { name: 'Face Pull', videoId: 'izIh2pgGLvY', videoStart: 10, videoEnd: 50 },
  {
    name: 'Lat Pulldown',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  { name: 'Seated Row', videoId: 'izIh2pgGLvY', videoStart: 10, videoEnd: 50 },
  {
    name: 'Incline Dumbbell Row',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Straight Arm Pulldown',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Barbell Bent-Over Row',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  { name: 'T-Bar Row', videoId: 'izIh2pgGLvY', videoStart: 10, videoEnd: 50 },
  {
    name: 'Chest Supported Row',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Single-Arm Dumbbell Row',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Landmine Row',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Hyperextension',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Good Mornings',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Romanian Deadlift',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  { name: 'Rack Pull', videoId: 'izIh2pgGLvY', videoStart: 10, videoEnd: 50 },
  {
    name: 'Reverse Hyperextension',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Barbell Curl',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Dumbbell Curl',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Preacher Curl',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  { name: 'Cable Curl', videoId: 'izIh2pgGLvY', videoStart: 10, videoEnd: 50 },
  { name: 'Hammer Curl', videoId: 'izIh2pgGLvY', videoStart: 10, videoEnd: 50 },
  {
    name: 'Tricep Pushdown',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Overhead Tricep Extension',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Skull Crushers',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  { name: 'Tricep Dips', videoId: 'izIh2pgGLvY', videoStart: 10, videoEnd: 50 },
  {
    name: 'Close-Grip Bench Press',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  { name: 'Wrist Curl', videoId: 'izIh2pgGLvY', videoStart: 10, videoEnd: 50 },
  {
    name: 'Reverse Wrist Curl',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Dumbbell Lever',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Barbell Lever',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Wrist Rollers',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  { name: 'Hammer Curl', videoId: 'izIh2pgGLvY', videoStart: 10, videoEnd: 50 },
  {
    name: 'Pronated Dumbbell Curl',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Forearm Lever Curl',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Zottman Curl',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  { name: 'Plate Pinch', videoId: 'izIh2pgGLvY', videoStart: 10, videoEnd: 50 },
  { name: 'Bench Press', videoId: 'izIh2pgGLvY', videoStart: 10, videoEnd: 50 },
  {
    name: 'Incline Bench Press',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Decline Bench Press',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  { name: 'Chest Fly', videoId: 'izIh2pgGLvY', videoStart: 10, videoEnd: 50 },
  {
    name: 'Cable Crossover',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  { name: 'Reverse Fly', videoId: 'izIh2pgGLvY', videoStart: 10, videoEnd: 50 },
  {
    name: 'Rear Delt Machine Fly',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  { name: 'Face Pull', videoId: 'izIh2pgGLvY', videoStart: 10, videoEnd: 50 },
  {
    name: 'Bent-Over Dumbbell Lateral Raise',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Cable Reverse Fly',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Arnold Press',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Barbell Overhead Press',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  { name: 'Front Raise', videoId: 'izIh2pgGLvY', videoStart: 10, videoEnd: 50 },
  {
    name: 'Incline Front Raise',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Seated Barbell Press',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Lateral Raise',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Cable Lateral Raise',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Dumbbell Shoulder Press',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Dumbbell Side Raise',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Landmine Lateral Raise',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Leg Extension',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Barbell Squat',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  { name: 'Leg Press', videoId: 'izIh2pgGLvY', videoStart: 10, videoEnd: 50 },
  { name: 'Hack Squat', videoId: 'izIh2pgGLvY', videoStart: 10, videoEnd: 50 },
  { name: 'Sissy Squat', videoId: 'izIh2pgGLvY', videoStart: 10, videoEnd: 50 },
  {
    name: 'Lying Leg Curl',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Romanian Deadlift',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Seated Leg Curl',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Standing Leg Curl',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Glute Ham Raise',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Standing Calf Raise',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Seated Calf Raise',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Leg Press Calf Raise',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Donkey Calf Raise',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Smith Machine Calf Raise',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Barbell Hip Thrust',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Cable Kickback',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  { name: 'Leg Press', videoId: 'izIh2pgGLvY', videoStart: 10, videoEnd: 50 },
  {
    name: 'Smith Machine Squat',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Glute Bridge',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Adductor Machine',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  { name: 'Sumo Squat', videoId: 'izIh2pgGLvY', videoStart: 10, videoEnd: 50 },
  {
    name: 'Cable Side Lunge',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Inner Thigh Machine',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Sliding Side Lunge',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Hip Abductor Machine',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Cable Lateral Lunge',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Clamshells with Resistance Band',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Standing Abduction',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
  {
    name: 'Side-Lying Leg Raise',
    videoId: 'izIh2pgGLvY',
    videoStart: 10,
    videoEnd: 50,
  },
];

const exerciseDummyValidator = z.object({
  exercises: z.array(
    z.object({
      name: z.string(),
      videoId: z.string(),
      videoStart: z.number(),
      videoEnd: z.number(),
    })
  ),
});
export async function generateDummyList() {
  // const data = exercisesDummyData;
  const response = await openai.beta.chat.completions.parse({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content:
          'You are a professional fitness expert and translator. Analyze exercises and provide details.',
      },
      {
        role: 'user',
        content: `
    UPPER_ABS
    LOWER_ABS
    SIDE_ABS
    ABDOMINALS

    UPPER_BACK
    MIDDLE_BACK
    LOWER_BACK

    BICEPS
    TRICEPS
    WRIST_EXTENSORS
    WRIST_FLEXORS

    CHEST

    REAR_SHOULDER
    FRONT_SHOULDER
    SIDE_SHOULDER

    QUADRICEPS
    HAMSTRINGS
    CALVES
    GLUTES
    INNER_THIGHS
    OUTER_THIGHS

Give me 5 exercises for each of these subcategories. These exercises must be with gym equipment. So in total 5 multiplied by 21 subcategories = 105 exercises.

In following format

[
{
name:'Exercise Name',
videoId:'izIh2pgGLvY' //static,
videoStart: 10, / static
videoEnd: 50, /static
}
]`,
      },
    ],
    response_format: zodResponseFormat(
      exerciseDummyValidator,
      'exercisesDummy'
    ),
    max_completion_tokens: 16384,
  });

  return {
    array: response.choices[0]?.message.parsed?.exercises ?? [],
    usage: response.usage,
  };
}
