import type { TRPCRouterRecord } from '@trpc/server';
import { protectedProcedure } from '../trpc';
import { z } from 'zod';
import { Language, SplitWeekDay } from '@prisma/client';

const createSplitSchema = z.object({
  name: z.string().min(1, 'Split name is required'),
  day: z.nativeEnum(SplitWeekDay),
  exerciseIds: z.array(z.number()).min(1, 'At least one exercise is required'),
});

const updateExercisesSchema = z.object({
  splitId: z.number(),
  exerciseId: z.number(),
  type: z.enum(['add', 'remove']),
});

const updateSplitSchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'Split name is required').optional(),
  day: z.nativeEnum(SplitWeekDay).optional(),
});

export const splitRouter = {
  createOne: protectedProcedure
    .input(createSplitSchema)
    .mutation(async ({ ctx: { db, session }, input }) => {
      const newSplit = await db.splitDay.create({
        data: {
          name: input.name,
          day: input.day,
          userId: session.userId,
          splitExercise: {
            create: input.exerciseIds.map((exerciseId) => ({
              exerciseId,
              userId: session.userId,
            })),
          },
        },
      });
      return newSplit;
    }),
  getOne: protectedProcedure
    .input(z.object({ id: z.number(), language: z.nativeEnum(Language) }))
    .query(async ({ ctx: { db, session }, input: { id, language } }) => {
      const splitResponse = await db.splitDay.findFirstOrThrow({
        where: {
          id,
          user: { id: session.userId },
        },
        include: {
          splitExercise: {
            select: {
              reps: true,
              sets: true,
              exercise: {
                select: {
                  id: true,
                  category: true,
                  subcategory: true,
                  translations: {
                    where: { language },
                    select: { name: true },
                  },
                },
              },
            },
          },
        },
      });
      const { splitExercise, day, name } = splitResponse;
      const exercises = splitExercise.map((splitEx) => {
        const { exercise, reps, sets } = splitEx;
        const { id, subcategory, translations, category } = exercise;
        const name = translations[0]!.name;
        return { id, subcategory, name, reps, sets, category };
      });
      const splitDetails = {
        id,
        name,
        day,
        exercises,
        exercisesCount: exercises.length,
        categories: [...new Set(exercises.map((e) => e.category))],
        subcategories: [...new Set(exercises.map((e) => e.subcategory))],
      };
      return splitDetails;
    }),
  getAll: protectedProcedure
    .input(
      z.object({
        cursor: z.number().optional(),
        language: z.nativeEnum(Language),
      })
    )
    .query(async ({ ctx: { db, session }, input }) => {
      const take = 5;
      const splits = await db.splitDay.findMany({
        where: {
          userId: session.userId,
        },
        orderBy: { createdAt: 'desc' },
        take,
        skip: input.cursor ? 1 : 0,
        ...(input.cursor && { cursor: { id: input.cursor } }),
        include: {
          splitExercise: {
            select: {
              exercise: {
                select: {
                  category: true,
                  subcategory: true,
                  translations: {
                    where: { language: input.language },
                    select: { name: true },
                  },
                },
              },
            },
          },
        },
      });

      const splitsDetails = splits.map((split) => ({
        id: split.id,
        name: split.name,
        day: split.day,
        exercisesCount: split.splitExercise.length,
        categories: [
          ...new Set(split.splitExercise.map((e) => e.exercise.category)),
        ],
        subcategories: [
          ...new Set(split.splitExercise.map((e) => e.exercise.subcategory)),
        ],
      }));

      return {
        splits: splitsDetails,
        nextCursor: splits[take - 1]?.id,
      };
    }),
  updateExercises: protectedProcedure
    .input(updateExercisesSchema)
    .mutation(async ({ ctx: { db, session }, input }) => {
      if (input.type === 'add') {
        await db.splitExercise.create({
          data: {
            splitDay: { connect: { id: input.splitId } },
            exercise: { connect: { id: input.exerciseId } },
            user: { connect: { id: session.userId } },
          },
        });
      } else {
        await db.splitExercise.deleteMany({
          where: {
            splitDayId: input.splitId,
            exerciseId: input.exerciseId,
            userId: session.userId,
          },
        });
      }
      return { success: true };
    }),
  updateOne: protectedProcedure
    .input(updateSplitSchema)
    .mutation(async ({ ctx: { db, session }, input }) => {
      const { id, ...updateData } = input;
      const { day, name } = updateData;
      await db.splitDay.update({
        where: {
          id,
          userId: session.userId,
        },
        data: {
          day,
          name,
        },
      });
      return { success: true };
    }),
  deleteOne: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx: { db, session }, input }) => {
      await db.splitDay.delete({
        where: {
          id: input.id,
          userId: session.userId,
        },
      });
      return { success: true };
    }),
} satisfies TRPCRouterRecord;
