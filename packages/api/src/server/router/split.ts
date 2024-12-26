import type { TRPCRouterRecord } from '@trpc/server';
import { protectedProcedure } from '../trpc';
import { z } from 'zod';
import { Language, SplitWeekDay } from '@prisma/client';
import { LexoRank } from 'lexorank';

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
  splitId: z.number(),
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
            create: input.exercises.map((exercise) => {
              // Each exercise gets a new rank from middle
              const rank = LexoRank.middle().toString();

              return {
                exerciseId: exercise.id,
                userId: session.userId,
                reps: exercise.reps,
                sets: exercise.sets,
                rank,
              };
            }),
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
            orderBy: { rank: 'asc' },
            select: {
              reps: true,
              sets: true,
              id: true,
              rank: true,
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
        const { exercise, reps, sets, id, rank } = splitEx;
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
          rank,
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
      const take = 7;
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
        // Get the exercise details
        const exercise = await db.exercise.findUniqueOrThrow({
          where: { id: input.exerciseId },
          select: { reps: true, sets: true },
        });

        // Get the last exercise in the split to determine the new rank
        const lastExercise = await db.splitExercise.findFirst({
          where: { splitDayId: input.splitId },
          orderBy: { rank: 'desc' },
          select: { rank: true },
        });

        // Generate new rank
        const newRank = lastExercise
          ? LexoRank.parse(lastExercise.rank).genNext().toString()
          : LexoRank.middle().toString();

        await db.splitExercise.create({
          data: {
            splitDay: { connect: { id: input.splitId } },
            exercise: { connect: { id: input.exerciseId } },
            user: { connect: { id: session.userId } },
            reps: exercise.reps,
            sets: exercise.sets,
            rank: newRank,
          },
        });
      } else {
        const splitExercise = await db.splitExercise.findFirstOrThrow({
          where: { exerciseId: input.exerciseId, splitDayId: input.splitId },
        });
        await db.splitExercise.delete({
          where: {
            id: splitExercise.id,
          },
        });
      }
      return { success: true };
    }),
  updateExercise: protectedProcedure
    .input(updateExerciseSchema)
    .mutation(async ({ ctx: { db }, input }) => {
      const splitExercise = await db.splitExercise.findFirstOrThrow({
        where: { exerciseId: input.exerciseId, splitDayId: input.splitId },
      });
      await db.splitExercise.update({
        where: {
          id: splitExercise.id,
        },
        data: {
          reps: input.reps,
          sets: input.sets,
        },
      });
      return { success: true };
    }),
  reorderExercise: protectedProcedure
    .input(
      z.object({
        exerciseId: z.number(),
        prevExerciseId: z.number().nullable(),
        nextExerciseId: z.number().nullable(),
        splitId: z.number(),
      })
    )
    .mutation(async ({ ctx: { db }, input }) => {
      // Get surrounding exercises
      const [prevExercise, nextExercise] = await Promise.all([
        input.prevExerciseId
          ? db.splitExercise.findFirst({
              where: {
                exerciseId: input.prevExerciseId,
                splitDayId: input.splitId,
              },
              select: { rank: true },
            })
          : null,
        input.nextExerciseId
          ? db.splitExercise.findFirst({
              where: {
                exerciseId: input.nextExerciseId,
                splitDayId: input.splitId,
              },
              select: { rank: true },
            })
          : null,
      ]);

      // Calculate new rank
      let newRank: string;

      if (!prevExercise && !nextExercise) {
        // If no prev or next, use middle rank
        newRank = LexoRank.middle().toString();
      } else if (!prevExercise) {
        // If moving to start, generate rank before next
        const nextLexoRank = LexoRank.parse(nextExercise!.rank);
        newRank = nextLexoRank.genPrev().toString();
      } else if (!nextExercise) {
        // If moving to end, generate rank after prev
        const prevLexoRank = LexoRank.parse(prevExercise.rank);
        newRank = prevLexoRank.genNext().toString();
      } else {
        // If between two exercises, calculate middle rank
        const prevLexoRank = LexoRank.parse(prevExercise.rank);
        const nextLexoRank = LexoRank.parse(nextExercise.rank);
        newRank = prevLexoRank.between(nextLexoRank).toString();
      }

      // Update the exercise with new rank
      const updatedExercise = await db.splitExercise.findFirstOrThrow({
        where: { exerciseId: input.exerciseId, splitDayId: input.splitId },
      });
      await db.splitExercise.update({
        where: { id: updatedExercise.id },
        data: { rank: newRank },
      });

      return { success: true };
    }),
} satisfies TRPCRouterRecord;
