import { Category, Subcategory } from '@prisma/client';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';
import { z } from 'zod';
import { Language } from '@prisma/client';
import { exercisesDummyData } from './dummyData';

export const openai = new OpenAI();

const muscleDetailsValidator = z.object({
  category: z.nativeEnum(Category),
  subcategory: z.nativeEnum(Subcategory),
  percentage: z.string(),
});

const translationValidator = z.object({
  language: z.nativeEnum(Language),
  name: z.string(),
  description: z.string(),
});

const exerciseDetailsValidator = z.object({
  exercises: z.array(
    z.object({
      name: z.string(),
      videoId: z.string(),
      videoStart: z.number(),
      videoEnd: z.number(),
      category: z.nativeEnum(Category),
      subcategory: z.nativeEnum(Subcategory),
      muscles: z.array(muscleDetailsValidator),
      translations: z.array(translationValidator),
      recommendedReps: z.number(),
      recommendedSets: z.number(),
    })
  ),
});
// 85-95 ukve gaketda, shemdegi gaakete
export async function generateExercisesDetails() {
  const data = exercisesDummyData.slice(105, 113);

  // const data = exercisesDummyData;
  const response = await openai.beta.chat.completions.parse({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content:
          'You are a professional fitness expert and translator. Analyze exercises and provide detailed information in multiple languages.',
      },
      {
        role: 'user',
        content: `Analyze these exercises and provide complete details for each:

Exercises: ${JSON.stringify(data)}

For each exercise provide:
1. The primary muscle category and subcategory
2. A complete breakdown of all muscles activated during the movement
3. Recommended number of repetitions and sets for optimal training
4. Translations in all languages (${Object.values(Language).join(', ')})

Each translation should include:
- A natural name in that language
- A detailed description of proper form and execution

Format as JSON matching the validator schema.`,
      },
    ],
    response_format: zodResponseFormat(exerciseDetailsValidator, 'exercises'),
    max_completion_tokens: 16384,
  });

  return {
    array: response.choices[0]?.message.parsed?.exercises || [],
    usage: response.usage,
  };
}

const gymEquipmentValidator = z.object({
  equipment: z
    .object({
      translations: z.array(translationValidator),
      exerciseIds: z.array(z.number()),
    })
    .nullable(),
});

export async function generateGymResponse(
  base64Image: string,
  availableExercises: { id: number; name: string }[]
) {
  const response = await openai.beta.chat.completions.parse({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content:
          'You are a professional fitness expert and translator. Analyze gym equipment images and identify which exercises from the provided list can be performed on this equipment.',
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Analyze this gym equipment image and identify which exercises from this list can be performed on it:
${JSON.stringify(availableExercises)}

Provide:
1. For each language (${Object.values(Language).join(', ')}):
   - The name of the equipment in that language
   - A detailed description of the equipment in that language
2. The IDs of all exercises from the provided list that can be performed on this equipment

If no gym equipment is clearly visible in the image, respond with null.`,
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
    response_format: zodResponseFormat(gymEquipmentValidator, 'equipment'),
    max_tokens: 4096,
  });

  return response.choices[0]?.message.parsed?.equipment;
}
