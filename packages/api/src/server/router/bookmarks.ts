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
    .query(async ({ ctx: { db }, input }) => {
      const { subcategory, searchName, language, cursor } = input;
      const take = 5;
      const bookmarked = await db.savedExercise.findMany({
        where: {
          exercise: {
            ...(subcategory && { subcategory }),
            translations: {
              some: {
                language,
                ...(searchName && {
                  name: { contains: searchName, mode: 'insensitive' },
                }),
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take,
        skip: cursor ? 1 : 0,
        ...(cursor && { cursor: { id: input.cursor } }),
        select: {
          id: true,
          exercise: {
            select: {
              category: true,
              subcategory: true,
              id: true,
              translations: {
                where: { language },
                select: { name: true },
              },
            },
          },
        },
      });
      const result = bookmarked.map((ex) => {
        const { exercise } = ex;
        const {
          category,
          subcategory,
          translations,
          id: exerciseId,
        } = exercise;
        const name = translations[0]!.name;
        return {
          id: exerciseId,
          category,
          subcategory,
          name,
        };
      });
      return {
        result,
        nextCursor: result[take - 1]?.id,
      };
    }),
} satisfies TRPCRouterRecord;
