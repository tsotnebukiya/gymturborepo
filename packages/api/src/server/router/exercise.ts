import type { TRPCRouterRecord } from '@trpc/server';

import { protectedProcedure } from '../trpc';
import { z } from 'zod';

export const exerciseRouter = {
  getOne: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx: { db, session }, input }) => {
      const exercise = await db.exercise.findUnique({
        where: { id: input.id, user: { id: session.userId } },
        include: {
          musclePercentages: true,
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
} satisfies TRPCRouterRecord;
