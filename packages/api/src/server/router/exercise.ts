import type { TRPCRouterRecord } from '@trpc/server';
import { protectedProcedure } from '../trpc';
import { z } from 'zod';
import { Subcategory } from '@prisma/client';

export const exerciseRouter = {
  getOne: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx: { db, session }, input }) => {
      const exercise = await db.exercise.findUnique({
        where: { id: input.id, user: { id: session.userId } },
        include: {
          musclePercentages: true,
          generation: {
            select: { image: true },
          },
        },
      });
      return exercise;
    }),
  bookmark: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx: { db, session }, input }) => {
      const exercise = await db.exercise.findUniqueOrThrow({
        where: { id: input.id, user: { id: session.userId } },
      });
      await db.exercise.update({
        where: { id: input.id },
        data: { saved: !exercise.saved },
      });
      return exercise;
    }),
  getAll: protectedProcedure
    .input(
      z
        .object({
          subcategory: z.nativeEnum(Subcategory).optional(),
          searchName: z.string().optional(),
          cursor: z.number().optional(),
        })
        .optional()
    )
    .query(async ({ ctx: { db, session }, input }) => {
      const take = 5;

      const exercises = await db.exercise.findMany({
        where: {
          user: { id: session.userId },
          saved: true,
          ...(input?.subcategory && { subcategory: input.subcategory }),
          ...(input?.searchName && {
            name: { contains: input.searchName, mode: 'insensitive' },
          }),
        },
        orderBy: { createdAt: 'desc' },
        take,
        skip: input?.cursor ? 1 : 0,
        ...(input?.cursor && { cursor: { id: input.cursor } }),
        select: {
          id: true,
          name: true,
          subcategory: true,
          category: true,
        },
      });

      return {
        exercises,
        nextCursor: exercises[take - 1]?.id,
      };
    }),
} satisfies TRPCRouterRecord;
