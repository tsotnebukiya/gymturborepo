import type { TRPCRouterRecord } from '@trpc/server';
import { protectedProcedure } from '../trpc';
import { z } from 'zod';
import { Language, Subcategory } from '@prisma/client';

export const exerciseRouter = {
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        language: z.nativeEnum(Language),
      })
    )
    .query(async ({ ctx: { db, session }, input }) => {
      const { id, language } = input;
      const exerciseRespone = await db.exercise.findUniqueOrThrow({
        where: { id },
        include: {
          musclePercentages: true,
          generation: {
            select: { image: true },
          },
          translations: {
            where: { language },
            select: { name: true, description: true },
          },
          savedExercise: {
            where: { userId: session.userId },
            select: { id: true },
          },
        },
      });
      const {
        category,
        subcategory,
        videoId,
        videoEnd,
        videoStart,
        musclePercentages,
        id: exerciseId,
        translations,
        savedExercise,
        generation,
        sets,
        reps,
      } = exerciseRespone;
      const name = translations[0]!.name;
      const description = translations[0]!.description;
      const image = generation[0]?.image;
      const isSaved = savedExercise.length > 0;
      const exercise = {
        category,
        subcategory,
        videoId,
        videoEnd,
        videoStart,
        musclePercentages,
        exerciseId,
        name,
        description,
        image,
        isSaved,
        sets,
        reps,
      };
      return exercise;
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
      const exercises = await db.exercise.findMany({
        where: {
          ...(subcategory && { subcategory: input.subcategory }),
          translations: {
            some: {
              language,
              ...(searchName && {
                name: { contains: searchName, mode: 'insensitive' },
              }),
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take,
        skip: cursor ? 1 : 0,
        ...(cursor && { cursor: { id: input.cursor } }),
        select: {
          id: true,
          subcategory: true,
          category: true,
          videoId: true,
          sets: true,
          reps: true,
          translations: {
            where: { language },
            select: { name: true },
          },
        },
      });
      const result = exercises.map((ex) => {
        const { id, translations, category, subcategory, videoId, sets, reps } =
          ex;
        const name = translations[0]!.name;
        return {
          id,
          category,
          subcategory,
          name,
          videoId,
          sets,
          reps,
        };
      });
      return {
        result,
        nextCursor: result[take - 1]?.id,
      };
    }),
  getRandom: protectedProcedure
    .input(
      z.object({
        language: z.nativeEnum(Language),
      })
    )
    .query(async ({ ctx: { db }, input }) => {
      const { language } = input;
      const take = 3;
      const exercisesCount = await db.exercise.count();
      const skip = Math.floor(Math.random() * exercisesCount);
      const exercises = await db.exercise.findMany({
        skip,
        take,
        select: {
          id: true,
          subcategory: true,
          category: true,
          videoId: true,
          sets: true,
          reps: true,
          translations: {
            where: { language },
            select: { name: true },
          },
        },
      });
      const result = exercises.map((ex) => {
        const { id, translations, category, subcategory, videoId, sets, reps } =
          ex;
        const name = translations[0]!.name;
        return {
          id,
          category,
          subcategory,
          name,
          videoId,
          sets,
          reps,
        };
      });
      return result;
    }),
} satisfies TRPCRouterRecord;
