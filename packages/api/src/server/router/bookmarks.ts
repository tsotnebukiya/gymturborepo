import type { TRPCRouterRecord } from '@trpc/server';
import { protectedProcedure } from '../trpc';
import { z } from 'zod';
import { Language, Subcategory } from '@prisma/client';

export const bookmarksRouter = {
  bookmark: protectedProcedure
    .input(z.object({ exerciseId: z.number() }))
    .mutation(async ({ ctx: { db, session }, input }) => {
      const existingBookmark = await db.savedExercise.findUnique({
        where: {
          userId_exerciseId: {
            userId: session.userId,
            exerciseId: input.exerciseId,
          },
        },
      });

      if (existingBookmark) {
        // Unbookmark - delete the saved exercise record
        await db.savedExercise.delete({
          where: { id: existingBookmark.id },
        });
        return false; // Return false to indicate unbookmarked
      } else {
        // Bookmark - create new saved exercise record
        await db.savedExercise.create({
          data: {
            userId: session.userId,
            exerciseId: input.exerciseId,
          },
        });
        return true; // Return true to indicate bookmarked
      }
    }),
  getAll: protectedProcedure
    .input(
      z.object({
        subcategory: z.nativeEnum(Subcategory).optional(),
        searchName: z.string().optional(),
        language: z.nativeEnum(Language),
        cursor: z.number().optional(),
      })
    )
    .query(async ({ ctx: { db, session }, input }) => {
      const { subcategory, searchName, language, cursor } = input;
      const take = 7;
      const exercises = await db.exercise.findMany({
        where: {
          ...(subcategory && { subcategory }),
          translations: {
            some: {
              language,
              ...(searchName && {
                name: { contains: searchName, mode: 'insensitive' },
              }),
            },
          },
          savedExercise: {
            some: {
              userId: session.userId,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take,
        skip: cursor ? 1 : 0,
        ...(cursor && { cursor: { id: cursor } }),
        select: {
          id: true,
          subcategory: true,
          category: true,
          sets: true,
          reps: true,
          translations: {
            where: { language },
            select: { name: true },
          },
          videoId: true,
        },
      });

      const result = exercises.map((ex) => {
        const { id, translations, category, subcategory, sets, reps } = ex;
        const name = translations[0]!.name;
        return {
          id,
          category,
          subcategory,
          name,
          videoId: ex.videoId,
          sets,
          reps,
        };
      });

      return {
        result,
        nextCursor: result[take - 1]?.id,
      };
    }),
} satisfies TRPCRouterRecord;
