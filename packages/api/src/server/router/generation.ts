import type { TRPCRouterRecord } from '@trpc/server';

import { protectedProcedure } from '../trpc';
import { GenerationStatus } from '@prisma/client';
import { createGenerationSchema } from '../../functions/schemas';
import { createGeneration } from '../../functions/generation';

export const generationRouter = {
  create: protectedProcedure
    .input(createGenerationSchema)
    .mutation(async ({ ctx: { db, session }, input }) => {
      const generation = await db.generation.create({
        data: {
          status: GenerationStatus.PENDING,
          user: {
            connect: {
              id: session.userId,
            },
          },
        },
      });
      void createGeneration({
        validated: input,
        generatedId: generation.id,
        userId: session.userId,
      });
      return generation.id;
    }),
  getAll: protectedProcedure.query(async ({ ctx: { db, session } }) => {
    return db.generation.findMany({
      where: {
        user: { id: session.userId },
      },
      take: 10,
    });
  }),
} satisfies TRPCRouterRecord;
