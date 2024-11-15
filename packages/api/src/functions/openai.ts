import { Category, Subcategory } from '@prisma/client';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';
import { z } from 'zod';

const openai = new OpenAI();

const exerciseValidator = z.object({
  name: z.string(),
  description: z.string(),
  category: z.nativeEnum(Category),
  subcategory: z.nativeEnum(Subcategory),
  muscles: z.array(
    z.object({
      category: z.nativeEnum(Category),
      subcategory: z.nativeEnum(Subcategory),
      percentage: z.string(),
    })
  ),
});

const generationOutputValidator = z.object({
  name: z.string().nullable(),
  description: z.string().nullable(),
  exercises: z.array(exerciseValidator),
});

type GenerationOutput = z.infer<typeof generationOutputValidator>;

const exerciseArrayValidator = z.array(exerciseValidator);
type ExerciseArray = z.infer<typeof exerciseArrayValidator>;

const exerciseDetailsValidator = z.object({
  exercises: exerciseArrayValidator,
});

export async function generateGymResponse(
  base64Image: string,
  language = 'english'
): Promise<GenerationOutput | null> {
  const response = await openai.beta.chat.completions.parse({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content:
          'You are a professional fitness expert. Analyze gym equipment images and provide detailed information about the equipment and possible exercises. For each exercise, specify its primary target muscle group and provide a comprehensive breakdown of all muscles activated during the movement. If no gym equipment is clearly visible, respond with null.',
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Analyze this gym equipment image and provide the following information in ${language}:
1. The name of the equipment
2. A detailed description of the equipment
3. A comprehensive list of possible exercises, including:
   - The primary muscle group targeted
   - A complete breakdown of all muscles activated

Format your response as a JSON object with the following structure:
{
  "name": "equipment name",
  "description": "detailed equipment description",
  "exercises": [
    {
      "name": "exercise name",
      "description": "exercise description",
      "category": "primary target muscle category",
      "subcategory": "primary target muscle subcategory",
      "muscles": [
        {
          "category": "muscle category",
          "subcategory": "muscle subcategory",
          "percentage": "activation percentage (1-100)"
        }
      ]
    }
  ]
}

Note: The category/subcategory at the exercise level should indicate the primary muscle group targeted, while the muscles array should list ALL muscle groups involved, including the primary one, with their respective activation percentages.

If no gym equipment is clearly visible, respond with null.`,
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`,
              detail: 'high',
            },
          },
        ],
      },
    ],
    response_format: zodResponseFormat(generationOutputValidator, 'generation'),
    max_tokens: 4096,
  });

  const generation = response.choices[0]?.message.parsed;
  if (!generation) {
    throw new Error('Failed to generate exercise details or image');
  }
  return generation;
}

export async function generateExerciseDetails(
  subcategory: Subcategory,
  language = 'english'
): Promise<ExerciseArray> {
  const detailsResponse = await openai.beta.chat.completions.parse({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are a professional fitness expert. Generate a comprehensive list of exercises for specific muscle groups, including proper form, target muscles, and equipment needed.',
      },
      {
        role: 'user',
        content: `Generate a list of effective exercises targeting the ${subcategory} muscle group in ${language}. For each exercise, include:
1. The exercise name
2. A detailed description of how to perform it
3. A complete breakdown of all muscles activated during the movement

Format your response as a JSON object:
{
  "exercises": [
    {
      "name": "exercise name",
      "description": "detailed exercise description",
      "category": "primary target muscle category",
      "subcategory": "primary target muscle subcategory",
      "muscles": [
        {
          "category": "muscle category",
          "subcategory": "muscle subcategory",
          "percentage": "activation percentage (1-100)"
        }
      ]
    }
  ]
}`,
      },
    ],
    response_format: zodResponseFormat(exerciseDetailsValidator, 'generation'),
    max_tokens: 4096,
  });

  const result = detailsResponse.choices[0]?.message.parsed;
  return result?.exercises ?? [];
}
