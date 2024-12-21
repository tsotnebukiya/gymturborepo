import type { TRPCRouterRecord } from '@trpc/server';
import { protectedProcedure } from '../trpc';
import { z } from 'zod';
import { Language, SplitWeekDay } from '@prisma/client';

const createSplitSchema = z.object({
  name: z.string().min(1, 'Split name is required'),
  day: z.nativeEnum(SplitWeekDay),
  exercises: z
    .array(
      z.object({
        id: z.number(),
        sets: z.number(),
        reps: z.number(),
      })
    )
    .min(1, 'At least one exercise is required'),
});

const updateExercisesSchema = z.object({
  splitId: z.number(),
  exerciseId: z.number(),
  type: z.enum(['add', 'remove']),
});

const updateExerciseSchema = z.object({
  exerciseId: z.number(),
  reps: z.number(),
  sets: z.number(),
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
            create: input.exercises.map((exercise) => ({
              exerciseId: exercise.id,
              userId: session.userId,
              reps: exercise.reps,
              sets: exercise.sets,
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
            orderBy: { createdAt: 'asc' },
            select: {
              reps: true,
              sets: true,
              id: true,
              exercise: {
                select: {
                  id: true,
                  category: true,
                  subcategory: true,
                  videoId: true,
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
        const { exercise, reps, sets, id } = splitEx;
        const {
          subcategory,
          translations,
          category,
          videoId,
          id: exerciseId,
        } = exercise;
        const name = translations[0]!.name;
        return {
          id,
          subcategory,
          name,
          reps,
          sets,
          category,
          videoId,
          exerciseId,
        };
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
    .mutation(async ({ ctx: { db }, input }) => {
      await db.splitDay.delete({
        where: {
          id: input.id,
        },
      });
      return { success: true };
    }),
  updateExercises: protectedProcedure
    .input(updateExercisesSchema)
    .mutation(async ({ ctx: { db, session }, input }) => {
      if (input.type === 'add') {
        const exercise = await db.exercise.findUniqueOrThrow({
          where: { id: input.exerciseId },
          select: { reps: true, sets: true },
        });

        await db.splitExercise.create({
          data: {
            splitDay: { connect: { id: input.splitId } },
            exercise: { connect: { id: input.exerciseId } },
            user: { connect: { id: session.userId } },
            reps: exercise.reps,
            sets: exercise.sets,
          },
        });
      } else {
        await db.splitExercise.delete({
          where: {
            id: input.exerciseId,
          },
        });
      }
      return { success: true };
    }),
  updateExercise: protectedProcedure
    .input(updateExerciseSchema)
    .mutation(async ({ ctx: { db }, input }) => {
      await db.splitExercise.update({
        where: {
          id: input.exerciseId,
        },
        data: {
          reps: input.reps,
          sets: input.sets,
        },
      });
      return { success: true };
    }),
} satisfies TRPCRouterRecord;
