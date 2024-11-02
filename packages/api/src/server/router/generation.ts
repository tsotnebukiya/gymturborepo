import type { TRPCRouterRecord } from '@trpc/server';

import { protectedProcedure } from '../trpc';
import { createGenerationSchema } from '../../functions/schemas';
import { generateGymResponse } from '../../functions/openai';
import { uploadImageToBlob } from '../../functions/utils';

export const generationRouter = {
  create: protectedProcedure
    .input(createGenerationSchema)
    .mutation(async ({ ctx: { db, session }, input }) => {
      const userId = session.userId;
      const blob = await uploadImageToBlob(input);
      const gymEquipmentResponse = await generateGymResponse(input.image);
      const name = gymEquipmentResponse?.name ?? null;
      const description = gymEquipmentResponse?.description ?? null;
      const exercises = gymEquipmentResponse?.exercises ?? [];
      const status = name && description ? 'COMPLETED' : 'FAILED';
      const generation = await db.generation.create({
        data: {
          status,
          exercise: {
            createMany: {
              data: exercises.map((ex) => ({
                name: ex.name,
                description: ex.description,
                category: ex.category,
                subcategory: ex.subcategory,
                userId,
              })),
            },
          },
          name,
          description,
          image: blob.url,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
      return generation.id;
    }),
  getAll: protectedProcedure.query(async ({ ctx: { db, session } }) => {
    const generations = await db.generation.findMany({
      where: {
        user: { id: session.userId },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    });
    return generations;
  }),
} satisfies TRPCRouterRecord;
