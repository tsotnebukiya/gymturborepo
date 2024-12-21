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
    name: 'Benchpress with Barbell Bench Press',
    videoId: 'CjHIKDQ4RQo',
    videoStart: 1,
    videoEnd: 6,
  },
  {
    name: 'flat Dumbbell Bench Press',
    videoId: 'YQ2s_Y7g5Qk',
    videoStart: 0,
    videoEnd: 5,
  },
  {
    name: 'INCINE DUMBBELL PRESS',
    videoId: '0G2_XV7slIg',
    videoStart: 222,
    videoEnd: 230,
  },
  {
    name: 'Smith Machine Incline Press',
    videoId: '8urE8Z8AMQ4',
    videoStart: 0,
    videoEnd: 9,
  },
  {
    name: 'Flat DUMBBELL FLY',
    videoId: 'QENKPHhQVi4',
    videoStart: 229,
    videoEnd: 236,
  },
  {
    name: 'Incline Dumbbell Fly',
    videoId: '8oR5hBwbIBc',
    videoStart: 0,
    videoEnd: 5,
  },
  {
    name: 'Machine Flye',
    videoId: 'FDay9wFe5uE',
    videoStart: 0,
    videoEnd: 5,
  },
  {
    name: 'Inner Chest-Close Dumbbell Hammer Press',
    videoId: 'WCAIi9xvNR8',
    videoStart: 50,
    videoEnd: 58,
  },
  {
    name: 'Chest Dips',
    videoId: 'zKTdcdeR5Nk',
    videoStart: 38,
    videoEnd: 42,
  },
  {
    name: 'Triceps dips',
    videoId: 'wjUmnZH528Y',
    videoStart: 140,
    videoEnd: 148,
  },
  {
    name: 'Tricep Dips Machine',
    videoId: 'OChuGyCSC7U',
    videoStart: 0,
    videoEnd: 8,
  },
  {
    name: 'Inner Chest Cable Crossover',
    videoId: 's_8o9WioQ4g',
    videoStart: 63,
    videoEnd: 68,
  },
  {
    name: 'Cable Crossovers',
    videoId: 'taI4XduLpTk',
    videoStart: 40,
    videoEnd: 50,
  },
  {
    name: 'Single Arm Cable Row',
    videoId: '_z5NMUxkxxw',
    videoStart: 76,
    videoEnd: 82,
  },
  {
    name: 'Cable Face Pulls',
    videoId: '0Po47vvj9g4',
    videoStart: 1,
    videoEnd: 10,
  },
  {
    name: 'Cable Overhead Triceps Extension',
    videoId: '1u18yJELsh0',
    videoStart: 0,
    videoEnd: 11,
  },
  {
    name: 'Cable Single Arm Pushdown',
    videoId: 'Cp_bShvMY4c',
    videoStart: 0,
    videoEnd: 10,
  },
  {
    name: 'Cable Triceps Pushdown',
    videoId: '6Fzep104f0s',
    videoStart: 0,
    videoEnd: 9,
  },
  {
    name: 'Cable Tricep Kickback - Single-arm',
    videoId: 'DYsQWSbj7UM',
    videoStart: 0,
    videoEnd: 8,
  },
  {
    name: 'Incline Cable Fly',
    videoId: 'LGDCjwO-hFg',
    videoStart: 28,
    videoEnd: 40,
  },
  {
    name: 'ROPE CABLE TRICEP EXTENSION',
    videoId: 'JDEDaZTEzGE',
    videoStart: 38,
    videoEnd: 46,
  },
  {
    name: 'Rope Twist Curl',
    videoId: '2CDKTFFp5fA',
    videoStart: 4,
    videoEnd: 11,
  },
  {
    name: 'Cable EZ Bar Curl',
    videoId: 'opFVuRi_3b8',
    videoStart: 0,
    videoEnd: 10,
  },
  {
    name: 'Cable Front Raise',
    videoId: 'vtH93qBItdk',
    videoStart: 8,
    videoEnd: 15,
  },
  {
    name: 'Cable Underhand Front Raise',
    videoId: 'yIoAcMD3jcE',
    videoStart: 0,
    videoEnd: 9,
  },
  {
    name: 'Straight Arm Pulldown',
    videoId: 'G9uNaXGTJ4w',
    videoStart: 0,
    videoEnd: 10,
  },
  {
    name: 'Rope Crunch',
    videoId: '6GMKPQVERzw',
    videoStart: 0,
    videoEnd: 9,
  },
  {
    name: 'Standing Cable Rear Delt Fly',
    videoId: 'MbiyWYDItR4',
    videoStart: 3,
    videoEnd: 12,
  },
  {
    name: 'SEATED CABLE FLY',
    videoId: 'CT7vDnPJZ9w',
    videoStart: 47,
    videoEnd: 55,
  },
  {
    name: 'Cable Lateral Raise',
    videoId: 'lq7eLC30b9w',
    videoStart: 1,
    videoEnd: 8,
  },
  {
    name: 'Skillrow',
    videoId: 'wI2nnD26CPg',
    videoStart: 147,
    videoEnd: 155,
  },
  {
    name: 'Lat Pulldown',
    videoId: 'JGeRYIZdojU',
    videoStart: 0,
    videoEnd: 8,
  },
  {
    name: 'Close Neutral Grip Lat Pulldown',
    videoId: 'kxeklf1Tkhw',
    videoStart: 0,
    videoEnd: 9,
  },
  {
    name: 'MAG grip lat pulldown',
    videoId: '0qhRLjAZpzI',
    videoStart: 32,
    videoEnd: 42,
  },
  {
    name: 'Reverse Grip Lat Pulldown',
    videoId: 'SNiwpA13ZLU',
    videoStart: 0,
    videoEnd: 10,
  },
  {
    name: 'Single Arm Cable Lat Pulldown',
    videoId: 'HBC5s98wXko',
    videoStart: 0,
    videoEnd: 10,
  },
  {
    name: 'Seated Cable Row',
    videoId: 'UCXxvVItLoM',
    videoStart: 0,
    videoEnd: 12,
  },
  {
    name: 'seated cable row narrow grip',
    videoId: 'lJoozxC0Rns',
    videoStart: 0,
    videoEnd: 9,
  },
  {
    name: 'Cable Rear Delt Flyes',
    videoId: 'er15V96hG5U',
    videoStart: 0,
    videoEnd: 11,
  },
  {
    name: 'Biceps Cable Curl',
    videoId: 'UsaY33N4KEw',
    videoStart: 7,
    videoEnd: 14,
  },
  {
    name: 'Smith Machine Bicep Curl',
    videoId: 'kFhrpD-HbPo',
    videoStart: 0,
    videoEnd: 8,
  },
  {
    name: 'Smith Machine Row',
    videoId: '3QcJggd_L24',
    videoStart: 0,
    videoEnd: 9,
  },
  {
    name: 'Feet Forward Smith Squat',
    videoId: '-eO_VydErV0',
    videoStart: 0,
    videoEnd: 10,
  },
  {
    name: 'Smith Machine Seated Shoulder Press',
    videoId: 'OLqZDUUD2b0',
    videoStart: 0,
    videoEnd: 11,
  },
  {
    name: 'Standing Smith Machine Shoulder Press',
    videoId: 'Wvb-lmNcS44',
    videoStart: 9,
    videoEnd: 16,
  },
  {
    name: 'Smith Machine Shoulder Press behind the Neck',
    videoId: 'MWV_2cOVfs8',
    videoStart: 22,
    videoEnd: 31,
  },
  {
    name: 'BEHIND THE BACK SMITH MACHINE SHRUG',
    videoId: 'keNpoJVJCNk',
    videoStart: 6,
    videoEnd: 12,
  },
  {
    name: 'Smith Machine Incline Press',
    videoId: '8urE8Z8AMQ4',
    videoStart: 0,
    videoEnd: 9,
  },
  {
    name: 'Smith Machine Bench Press',
    videoId: 'O5viuEPDXKY',
    videoStart: 0,
    videoEnd: 8,
  },
  {
    name: 'Smith Machine Hax Press',
    videoId: 'IRiiuK_B8Lo',
    videoStart: 2,
    videoEnd: 9,
  },
  {
    name: 'Smith Machine Calves',
    videoId: 'hh5516HCu4k',
    videoStart: 0,
    videoEnd: 8,
  },
  {
    name: 'Smith Machine Romanian DeadLift',
    videoId: '2N-F1mLwKEo',
    videoStart: 0,
    videoEnd: 10,
  },
  {
    name: 'Smith Machine Barbell Shrug',
    videoId: 'cT5_GyOXIgE',
    videoStart: 18,
    videoEnd: 23,
  },
  {
    name: 'Hammer Strength Select Biceps Curl',
    videoId: 'rwo-3PTM8U4',
    videoStart: 9,
    videoEnd: 18,
  },
  {
    name: 'Machine Preacher Curl',
    videoId: 'Ja6ZlIDONac',
    videoStart: 0,
    videoEnd: 10,
  },
  {
    name: 'SCOTT BENCH EZ BAR BICEPS CURL',
    videoId: 'ZiZf-9PIkHY',
    videoStart: 47,
    videoEnd: 51,
  },
  {
    name: 'Dumbbell Preacher Curl',
    videoId: 'zuEfTs3R3yo',
    videoStart: 4,
    videoEnd: 10,
  },
  {
    name: 'Single arm Dumbbell preacher curl',
    videoId: 'dCB1pgzrV6w',
    videoStart: 3,
    videoEnd: 8,
  },
  {
    name: 'Leg Press',
    videoId: 'yZmx_Ac3880',
    videoStart: 0,
    videoEnd: 10,
  },
  {
    name: 'Seated Leg Curl',
    videoId: 'Orxowest56U',
    videoStart: 0,
    videoEnd: 10,
  },
  {
    name: 'Lying Leg Curl',
    videoId: 'SbSNUXPRkc8',
    videoStart: 0,
    videoEnd: 11,
  },
  {
    name: 'Leg Extension',
    videoId: '5Nb-WekmKjw',
    videoStart: 12,
    videoEnd: 18,
  },
  {
    name: 'Hack Squat',
    videoId: 'rYgNArpwE7E',
    videoStart: 0,
    videoEnd: 10,
  },
  {
    name: 'MACHINE REVERSE V-SQUAT',
    videoId: 'k3pE9_L0ARo',
    videoStart: 0,
    videoEnd: 8,
  },
  {
    name: 'Chest Supported Row',
    videoId: '0UBRfiO4zDs',
    videoStart: 0,
    videoEnd: 9,
  },
  {
    name: 'Machine Chest Supported Row',
    videoId: '_FrrYQxA6kc',
    videoStart: 0,
    videoEnd: 10,
  },
  {
    name: 'Machine Pullover',
    videoId: 'oxpAl14EYyc',
    videoStart: 0,
    videoEnd: 12,
  },
  {
    name: 'Chin-Up',
    videoId: 'rigzbHWbllM',
    videoStart: 161,
    videoEnd: 171,
  },
  {
    name: 'Pull up',
    videoId: 'eGo4IYlbE5g',
    videoStart: 233,
    videoEnd: 240,
  },
  {
    name: 'HAMMER PULL UP',
    videoId: 'XNFGt0WPASQ',
    videoStart: 37,
    videoEnd: 43,
  },
  {
    name: 'Hummer Grip Chin Up',
    videoId: 'dBB6HZC8E7Y',
    videoStart: 3,
    videoEnd: 12,
  },
  {
    name: 'Kettlebell Swing',
    videoId: 'YSxHifyI6s8',
    videoStart: 77,
    videoEnd: 107,
  },
  {
    name: 'Kettlebell Deadlift',
    videoId: 'l6gDwf3xC6s',
    videoStart: 0,
    videoEnd: 10,
  },
  {
    name: 'Dual Kettlebell Deadlift',
    videoId: '6SyJO3nSY9U',
    videoStart: 0,
    videoEnd: 11,
  },
  {
    name: 'Incline Machine Chest Press',
    videoId: 'TrTSvn5-MTk',
    videoStart: 0,
    videoEnd: 9,
  },
  {
    name: 'Hammer Machine Chest Press',
    videoId: '0Wa9CfRXUkA',
    videoStart: 0,
    videoEnd: 8,
  },
  {
    name: 'FLAT CHEST PRESS MACHINE',
    videoId: 'sreMgnjczh4',
    videoStart: 0,
    videoEnd: 8,
  },
  {
    name: 'The Rowing Machine',
    videoId: '6_eLpWiNijE',
    videoStart: 47,
    videoEnd: 53,
  },
  {
    name: 'Machine Lateral Raise',
    videoId: '0o07iGKUarI',
    videoStart: 0,
    videoEnd: 11,
  },
  {
    name: 'Lateral Raise Machine',
    videoId: 'xMEs3zEzS8s',
    videoStart: 5,
    videoEnd: 10,
  },
  {
    name: 'Machine Shoulder Press',
    videoId: 'WvLMauqrnK8',
    videoStart: 0,
    videoEnd: 10,
  },
  {
    name: 'EZ Bar Underhand Front Raise',
    videoId: '87pZAbYjXc4',
    videoStart: 0,
    videoEnd: 8,
  },
  {
    name: 'hyperextension 45 Degree Back Raise',
    videoId: '5_ejbGfdAQE',
    videoStart: 0,
    videoEnd: 10,
  },
  {
    name: 'Decline Sit Ups',
    videoId: 'N7hf1_vcX5w',
    videoStart: 0,
    videoEnd: 10,
  },
  {
    name: 'The Seated Row Machine',
    videoId: 'TeFo51Q_Nsc',
    videoStart: 38,
    videoEnd: 47,
  },
  {
    name: 'Hammer strength upper back row',
    videoId: 'gWXUlUIuGVM',
    videoStart: 0,
    videoEnd: 10,
  },
  {
    name: 'Low Back Extension Machine workout',
    videoId: 'bADOg7F5dKI',
    videoStart: 23,
    videoEnd: 29,
  },
  {
    name: 'low Row Machine workout',
    videoId: '4R0Izs5X3BY',
    videoStart: 12,
    videoEnd: 22,
  },
  {
    name: 'Hammer Low Row',
    videoId: 'opjbouBmUWg',
    videoStart: 0,
    videoEnd: 10,
  },
  {
    name: 'Barbell Bent Over Row',
    videoId: '6FZHJGzMFEc',
    videoStart: 0,
    videoEnd: 11,
  },
  {
    name: 'Single Arm Supported Dumbbell Row',
    videoId: 'DMo3HJoawrU',
    videoStart: 0,
    videoEnd: 8,
  },
  {
    name: 'Incline Dumbbell Row',
    videoId: 'tZUYS7X50so',
    videoStart: 0,
    videoEnd: 7,
  },
  {
    name: 'Two Arm Dumbbell Row',
    videoId: '5PoEksoJNaw',
    videoStart: 0,
    videoEnd: 8,
  },
  {
    name: 'Rear Delt Dumbbell Row',
    videoId: 't-llLcNvsro',
    videoStart: 0,
    videoEnd: 7,
  },
  {
    name: 'The Landmine Shoulder Press',
    videoId: 't9GuiNQo1O4',
    videoStart: 8,
    videoEnd: 15,
  },
  {
    name: 'Barbell Hip Thrust',
    videoId: 'EF7jXP17DPE',
    videoStart: 0,
    videoEnd: 10,
  },
  {
    name: 'Machine Hip Thrust',
    videoId: 'ZSPmIyX9RZs',
    videoStart: 0,
    videoEnd: 10,
  },
  {
    name: 'Ring Bicep Curl',
    videoId: '6AOo5BtcqO4',
    videoStart: 0,
    videoEnd: 11,
  },
  {
    name: 'Ring Chin-Up',
    videoId: 'jBcL5h_r9Ts',
    videoStart: 3,
    videoEnd: 9,
  },
  {
    name: 'Incline Dumbell Curl',
    videoId: 'aTYlqC_JacQ',
    videoStart: 0,
    videoEnd: 8,
  },
  {
    name: 'Wrist Curls',
    videoId: '3VLTzIrnb5g',
    videoStart: 0,
    videoEnd: 10,
  },
  {
    name: 'Seated Dumbbell Shoulder Press',
    videoId: 'HzIiNhHhhtA',
    videoStart: 0,
    videoEnd: 8,
  },
  {
    name: 'The Arnold Press',
    videoId: 'jeJttN2EWCo',
    videoStart: 0,
    videoEnd: 6,
  },
  {
    name: 'Dumbbell Front Raise',
    videoId: 'hRJ6tR5-if0',
    videoStart: 0,
    videoEnd: 8,
  },
  {
    name: 'Seated Dumbbell Front Raise',
    videoId: 'vMfLbnc-xhs',
    videoStart: 21,
    videoEnd: 27,
  },
  {
    name: 'Rear Delt Machine Flyes',
    videoId: 'VoscK_FHNbw',
    videoStart: 0,
    videoEnd: 8,
  },
  {
    name: 'Machine Flye',
    videoId: 'FDay9wFe5uE',
    videoStart: 0,
    videoEnd: 8,
  },
  {
    name: 'High Bar Good Morning',
    videoId: 'dEJ0FTm-CEk',
    videoStart: 0,
    videoEnd: 12,
  },
  {
    name: 'Barbell Rear Delt Rows',
    videoId: 'PkhN_YyoWLI',
    videoStart: 0,
    videoEnd: 5,
  },
  {
    name: 'Meadows Row',
    videoId: '18ygbNj5ibs',
    videoStart: 23,
    videoEnd: 28,
  },
  {
    name: 'Deadlift',
    videoId: 'AweC3UaM14o',
    videoStart: 0,
    videoEnd: 10,
  },
  {
    name: 'Dumbbell Romanian Deadlift',
    videoId: 'xAL7lHwj30E',
    videoStart: 0,
    videoEnd: 8,
  },
  {
    name: 'Barbell Back Squat',
    videoId: 'rrJIyZGlK8c',
    videoStart: 4,
    videoEnd: 12,
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
    array: response.choices[0]?.message.parsed?.exercises || [],
    usage: response.usage,
  };
}
