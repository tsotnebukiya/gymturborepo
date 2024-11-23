import type { TRPCRouterRecord } from '@trpc/server';
import { protectedProcedure } from '../trpc';
import { createGenerationSchema } from '../../functions/schemas';
import { uploadImageToBlob } from '../../functions/utils';
import { generateGymResponse } from '../../functions/openai';
import { log } from 'next-axiom';

export const generationRouter = {
  create: protectedProcedure
    .input(createGenerationSchema)
    .mutation(async ({ ctx: { db, session }, input }) => {
      const timings: Record<string, number> = {};
      const userId = session.userId;
      const startParallel = performance.now();
      const startFindExercises = performance.now();
      const availableExercises = await db.exercise.findMany({
        select: {
          id: true,
          name: true,
        },
      });
      timings.findExercises = performance.now() - startFindExercises;
      const [blob, gymEquipmentResponse] = await Promise.all([
        uploadImageToBlob(input),
        generateGymResponse(input.image, availableExercises),
      ]);
      timings.parallelOperations = performance.now() - startParallel;
      const name = gymEquipmentResponse.name ?? null;
      const description = gymEquipmentResponse.description ?? null;
      const exercises = gymEquipmentResponse.exerciseIds;
      const status = name && description ? 'COMPLETED' : 'FAILED';
      const startGeneration = performance.now();
      const generation = await db.generation.create({
        data: {
          status,
          exercise: {
            connect: exercises.map((ex) => ({
              id: ex,
            })),
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
      timings.generation = performance.now() - startGeneration;
      log.debug('Operation timings (ms):', timings);
      return generation.id;
    }),
  getAll: protectedProcedure.query(async ({ ctx: { db, session } }) => {
    const startTime = performance.now();
    const generations = await db.generation.findMany({
      where: {
        user: { id: session.userId },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    });
    const endTime = performance.now();
    log.debug('Generation getAll query executed', {
      duration: Math.round(endTime - startTime),
      userId: session.userId,
      resultCount: generations.length,
    });
    return generations;
  }),
  // getOne: protectedProcedure
  //   .input(z.object({ id: z.number() }))
  //   .query(async ({ ctx: { db, session }, input }) => {
  //     const generation = await db.generation.findFirstOrThrow({
  //       where: { id: input.id, user: { id: session.userId } },
  //       include: {
  //         exercise: { select: { id: true, name: true, subcategory: true } },
  //       },
  //     });
  //     return generation;
  //   }),
} satisfies TRPCRouterRecord;
