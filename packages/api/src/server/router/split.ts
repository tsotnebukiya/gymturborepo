import type { TRPCRouterRecord } from '@trpc/server';
import { protectedProcedure } from '../trpc';
import { z } from 'zod';

const createSplitSchema = z.object({
  name: z.string().min(1, 'Split name is required'),
  day: z
    .enum([
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
      'SUNDAY',
    ])
    .optional(),
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
  day: z
    .enum([
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
      'SUNDAY',
    ])
    .nullable()
    .optional(),
});

export const splitRouter = {
  createOne: protectedProcedure
    .input(createSplitSchema)
    .mutation(async ({ ctx: { db, session }, input }) => {
      const newSplit = await db.split.create({
        data: {
          name: input.name,
          day: input.day,
          userId: session.userId,
          exercises: {
            connect: input.exerciseIds.map((id) => ({ id })),
          },
        },
      });
      return newSplit;
    }),
  getOne: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx: { db, session }, input: { id } }) => {
      const split = await db.split.findFirstOrThrow({
        where: {
          id,
          user: { id: session.userId },
        },
        include: {
          exercises: {
            select: { category: true, subcategory: true, name: true, id: true },
          },
        },
      });
      const splitDetails = {
        ...split,
        exercisesCount: split.exercises.length,
        categories: [...new Set(split.exercises.map((e) => e.category))],
        subcategories: [...new Set(split.exercises.map((e) => e.subcategory))],
      };
      return splitDetails;
    }),
  getAll: protectedProcedure
    .input(
      z
        .object({
          cursor: z.number().optional(),
        })
        .optional()
    )
    .query(async ({ ctx: { db, session }, input }) => {
      const take = 5;
      const splits = await db.split.findMany({
        where: {
          user: { id: session.userId },
        },
        orderBy: { createdAt: 'desc' },
        take,
        skip: input?.cursor ? 1 : 0,
        ...(input?.cursor && { cursor: { id: input.cursor } }),
        include: {
          exercises: {
            select: { category: true, subcategory: true },
          },
        },
      });
      const splitsDetails = splits.map((split) => ({
        ...split,
        exercisesCount: split.exercises.length,
        categories: [...new Set(split.exercises.map((e) => e.category))],
        subcategories: [...new Set(split.exercises.map((e) => e.subcategory))],
      }));
      return {
        splits: splitsDetails,
        nextCursor: splits[take - 1]?.id,
      };
    }),
  updateExercises: protectedProcedure
    .input(updateExercisesSchema)
    .mutation(async ({ ctx: { db, session }, input }) => {
      await db.split.update({
        where: {
          id: input.splitId,
          userId: session.userId,
        },
        data: {
          exercises: {
            [input.type === 'add' ? 'connect' : 'disconnect']: {
              id: input.exerciseId,
            },
          },
        },
      });
      return { success: true };
    }),
  updateOne: protectedProcedure
    .input(updateSplitSchema)
    .mutation(async ({ ctx: { db, session }, input }) => {
      const { id, ...updateData } = input;
      await db.split.update({
        where: {
          id,
          userId: session.userId,
        },
        data: updateData,
      });
      return { success: true };
    }),
  deleteOne: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx: { db, session }, input }) => {
      await db.split.delete({
        where: {
          id: input.id,
          userId: session.userId,
        },
      });
      return { success: true };
    }),
} satisfies TRPCRouterRecord;
