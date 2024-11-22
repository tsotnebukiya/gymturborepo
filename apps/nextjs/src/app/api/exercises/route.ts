import { db, generateExercisesDetails } from '@acme/api';
import { type NextRequest } from 'next/server';
import { z } from 'zod';
import { env } from '~/env';
import { redis, type PrismaTypes } from '@acme/api';

let isWarmStart = false;

export async function GET(req: NextRequest) {
  const isColdStart = !isWarmStart;
  isWarmStart = true;

  const type = req.nextUrl.searchParams.get('type');
  if (type === 'database') {
    const start = performance.now();
    const exercises = await db.exercise.findMany({
      include: {
        translations: true,
        musclePercentages: true,
      },
    });
    const end = performance.now();
    const dataSizeInBytes = new TextEncoder().encode(
      JSON.stringify(exercises)
    ).length;
    const dataSizeInKB = dataSizeInBytes / 1024;
    return new Response(
      JSON.stringify({
        status: 'success',
        dataSizeInKB,
        time: end - start,
        coldStart: `[${new Date().toISOString()}] Cold Start: ${isColdStart}`,
      }),
      { status: 200 }
    );
  }
  if (type === 'redis') {
    const start = performance.now();
    const cachedExercises =
      (await redis.get<NonNullable<PrismaTypes.Exercise>[]>('exercises')) ?? [];
    const finalExerfcises = cachedExercises;
    const end = performance.now();
    const dataSizeInBytes = new TextEncoder().encode(
      JSON.stringify(finalExerfcises)
    ).length;
    const dataSizeInKB = dataSizeInBytes / 1024;
    return new Response(
      JSON.stringify({
        status: 'success',
        dataSizeInKB,
        time: end - start,
        coldStart: `[${new Date().toISOString()}] Cold Start: ${isColdStart}`,
      }),
      { status: 200 }
    );
  }
  return new Response(JSON.stringify({ status: 'Incorrect Type' }), {
    status: 400,
  });
}

const passwordSchema = z.object({
  password: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    // Add password check
    const body = await req.json();

    const { password } = passwordSchema.parse(body);
    if (!password || password !== env.API_PASSWORD) {
      return new Response(
        JSON.stringify({ status: 'error', error: 'Unauthorized' }),
        { status: 401 }
      );
    }
    const exerciseResponse = await generateExercisesDetails();
    const exercises = exerciseResponse.array;
    const result = await db.$transaction(
      async (tx) => {
        const createdExercises = await Promise.all(
          exercises.map(async (exercise) => {
            // Create the base exercise
            const englishTranslation = exercise.translations.find(
              (trans) => trans.language === 'ENGLISH'
            );
            if (!englishTranslation) return;
            const newExercise = await tx.exercise.create({
              data: {
                videoId: exercise.videoId,
                videoStart: exercise.videoStart,
                videoEnd: exercise.videoEnd,
                category: exercise.category,
                subcategory: exercise.subcategory,
                name: englishTranslation.name,
                description: englishTranslation.description,
                // Create translations
                translations: {
                  create: exercise.translations.map((trans) => ({
                    language: trans.language,
                    name: trans.name,
                    description: trans.description,
                  })),
                },
                // Create muscle percentages
                musclePercentages: {
                  create: exercise.muscles.map((muscle) => ({
                    category: muscle.category,
                    subcategory: muscle.subcategory,
                    percentage: muscle.percentage,
                  })),
                },
              },
            });
            return newExercise;
          })
        );
        return createdExercises;
      },
      {
        maxWait: 50000,
        timeout: 100000,
      }
    );
    return new Response(
      JSON.stringify({
        status: 'success',
        count: result.length,
        usage: exerciseResponse.usage,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in exercises API:', error);
    return new Response(
      JSON.stringify({
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        details: String(error),
      }),
      { status: 500 }
    );
  }
}
