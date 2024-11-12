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

export async function generateGymResponse(
  base64Image: string
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
            text: `Analyze this gym equipment image and provide:
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
  return generation ?? null;
}

export async function generateExerciseDetails(
  exerciseName: string
): Promise<{ exercise: z.infer<typeof exerciseValidator>; imageUrl: string }> {
  // First get exercise details
  const detailsResponse = await openai.beta.chat.completions.parse({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content:
          'You are a professional fitness expert. Provide detailed information about specific exercises, including proper form, target muscles, and equipment needed.',
      },
      {
        role: 'user',
        content: `Provide detailed information about the exercise "${exerciseName}". Include:
1. A detailed description of how to perform it
2. The primary muscle group targeted
3. A complete breakdown of all muscles activated

Format your response as a JSON object matching this structure:
{
  "name": "${exerciseName}",
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
}`,
      },
    ],
    response_format: zodResponseFormat(exerciseValidator, 'exercise'),
  });

  const exercise = detailsResponse.choices[0]?.message.parsed;

  // Then generate an image of the equipment/exercise
  const imageResponse = await openai.images.generate({
    model: 'dall-e-3',
    prompt: `Professional gym equipment photography: Equipment needed for ${exerciseName}. Show the equipment in a well-lit gym setting with proper perspective and detail. Clean, professional composition.`,
    n: 1,
    size: '1024x1024',
    quality: 'standard',
  });

  const imageUrl = imageResponse.data[0]?.url;

  if (!exercise || !imageUrl) {
    throw new Error('Failed to generate exercise details or image');
  }

  return {
    exercise,
    imageUrl,
  };
}
