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
          'You are a professional fitness expert specializing in gym equipment. First identify the equipment in the image, then if it matches a known equipment type, use the standard exercise mappings for that equipment.',
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `First, identify what this gym equipment is. Then, if it's a standard piece of equipment (like Power Rack, Smith Machine, etc.), match ALL exercises from the provided list that are standardly performed on this type of equipment.

For example, if you identify a Power Rack, include ALL exercises from the available list that are standard Power Rack exercises, regardless of the specific model or features visible in the image.

Available exercises:
${JSON.stringify(availableExercises)}

Provide:
1. For each language (${Object.values(Language).join(', ')}):
   - The equipment's name in that language
   - A brief description of the equipment (maximum 100 characters) in that language
2. Include exercise IDs based on the standard equipment type identified, not the specific features visible in the image

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

const exerciseEquipmentValidator = z.object({
  mappings: z.array(
    z.object({
      exerciseId: z.number(),
      exerciseName: z.string(),
      equipment: z.array(z.string()),
    })
  ),
});

export async function generateExerciseEquipmentMappings(
  availableExercises: { id: number; name: string }[]
) {
  const response = await openai.beta.chat.completions.parse({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content:
          'You are a professional fitness expert specializing in exercise equipment relationships. Your task is to identify which gym equipments can be used for each exercise.',
      },
      {
        role: 'user',
        content: `For each exercise, list all gym equipment that can be used to perform it properly and safely.

Available exercises:
${JSON.stringify(availableExercises)}

Important guidelines:
- Use clear, common equipment names
- Be comprehensive but realistic - only include equipment that can safely support the exercise
- Consider bodyweight alternatives where applicable
- For barbell exercises, assume "Barbell" and appropriate weight plates are available

Format as JSON matching the validator schema, where each exercise has:
- exerciseId: number
- equipment: array of equipment names


Example response format:
{
  "mappings": [
    {
      "exerciseId": 1,
      "exerciseName": "Bench Press",
      "equipment": ["Power Rack", "Smith Machine"],
    }
  ]
}`,
      },
    ],
    response_format: zodResponseFormat(exerciseEquipmentValidator, 'mappings'),
    max_tokens: 16000,
  });
  console.log(response.usage);
  return response.choices[0]?.message.parsed?.mappings || [];
}
