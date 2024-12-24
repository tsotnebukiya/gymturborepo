import { db, generateExercisesDetails } from '@acme/api';
import { type NextRequest } from 'next/server';
import { z } from 'zod';
import { env } from '~/env';

export async function GET() {
  try {
    // Get all exercises
    const exercises = await db.exercise.findMany({});

    // Filter out duplicates based on videoId
    const uniqueExercises = [
      ...new Map(exercises.map((ex) => [ex.videoId, ex])).values(),
    ];

    // Define all possible subcategories
    const allSubcategories = [
      'UPPER_ABS',
      'LOWER_ABS',
      'SIDE_ABS',
      'ABDOMINALS',
      'UPPER_BACK',
      'MIDDLE_BACK',
      'LOWER_BACK',
      'BICEPS',
      'TRICEPS',
      'WRIST_EXTENSORS',
      'WRIST_FLEXORS',
      'CHEST',
      'REAR_SHOULDER',
      'FRONT_SHOULDER',
      'SIDE_SHOULDER',
      'QUADRICEPS',
      'HAMSTRINGS',
      'CALVES',
      'GLUTES',
      'INNER_THIGHS',
      'OUTER_THIGHS',
    ];

    // Initialize counts object with zeros for all subcategories
    const subcategoryCounts = Object.fromEntries(
      allSubcategories.map((sub) => [sub, 0])
    );

    // Count exercises
    uniqueExercises.forEach((exercise) => {
      if (exercise.subcategory in subcategoryCounts) {
        subcategoryCounts[exercise.subcategory]++;
      }
    });

    // Check thumbnails
    const thumbnailChecks = await Promise.all(
      uniqueExercises.map(async (exercise) => {
        const thumbnailUrl = `https://img.youtube.com/vi/${exercise.videoId}/maxresdefault.jpg`;
        try {
          const response = await fetch(thumbnailUrl, { method: 'HEAD' });
          return {
            videoId: exercise.videoId,
            thumbnailExists: response.ok,
            subcategory: exercise.subcategory,
          };
        } catch (error) {
          console.log(error);
          return {
            videoId: exercise.videoId,
            thumbnailExists: false,
            subcategory: exercise.subcategory,
          };
        }
      })
    );

    const invalidThumbnails = thumbnailChecks.filter(
      (check) => !check.thumbnailExists
    );
    return new Response(
      JSON.stringify({
        totalUniqueExercises: uniqueExercises.length,
        subcategoryCounts,
        invalidThumbnails,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ status: 'error', error: String(error) }),
      {
        status: 500,
      }
    );
  }
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
                sets: exercise.recommendedSets,
                reps: exercise.recommendedReps,
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
