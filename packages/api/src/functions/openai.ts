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
});

const generationOutputValidator = z.object({
  name: z.string(),
  description: z.string(),
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
          'You are a professional fitness expert. Analyze gym equipment images and provide detailed information about the equipment and possible exercises. If no gym equipment is clearly visible, respond with null.',
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Analyze this gym equipment image and provide:
1. The name of the equipment
2. A detailed description of the equipment
3. A comprehensive list of possible exercises that can be performed on it

Format your response as a JSON object with the following structure:
{
  "name": "equipment name",
  "description": "detailed equipment description",
  "exercises": [
    {
      "name": "exercise name",
      "description": "exercise description",
      "category": "one of the valid categories",
      "subcategory": "one of the valid subcategories"
    }
  ]
}

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
