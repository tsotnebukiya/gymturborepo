import type { TRPCRouterRecord } from '@trpc/server';

import { protectedProcedure } from '../trpc';
import { createGenerationSchema } from '../../functions/schemas';
import {
  generateExerciseDetails,
  generateGymResponse,
} from '../../functions/openai';
import { uploadImageToBlob } from '../../functions/utils';
import { z } from 'zod';
import { log } from 'next-axiom';
import { Subcategory } from '@prisma/client';

export const generationRouter = {
  create: protectedProcedure
    .input(createGenerationSchema)
    .mutation(async ({ ctx: { db, session }, input }) => {
      const timings: Record<string, number> = {};
      const userId = session.userId;

      const startParallel = performance.now();
      const [blob, gymEquipmentResponse] = await Promise.all([
        uploadImageToBlob(input),
        generateGymResponse(input.image),
      ]);
      timings.parallelOperations = performance.now() - startParallel;

      const name = gymEquipmentResponse?.name ?? null;
      const description = gymEquipmentResponse?.description ?? null;
      const exercises = gymEquipmentResponse?.exercises ?? [];
      const status = name && description ? 'COMPLETED' : 'FAILED';

      const startGeneration = performance.now();
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
      timings.createGeneration = performance.now() - startGeneration;

      const startFindExercises = performance.now();
      const exercisesCreated = await db.exercise.findMany({
        where: {
          generationId: generation.id,
        },
      });
      timings.findExercises = performance.now() - startFindExercises;

      const muscleData = exercisesCreated.flatMap((exercise, index) => {
        const currentExercises = exercises[index]?.muscles;
        if (!currentExercises) return [];
        return currentExercises.map((muscle) => ({
          ...muscle,
          exerciseId: exercise.id,
        }));
      });

      const startMusclePercentages = performance.now();
      await db.musclePercentage.createMany({
        data: muscleData,
      });
      timings.createMusclePercentages =
        performance.now() - startMusclePercentages;
      log.info('Operation timings (ms):', timings);
      return generation.id;
    }),
  createByCategory: protectedProcedure
    .input(z.object({ subcategory: z.nativeEnum(Subcategory) }))
    .mutation(async ({ ctx: { db, session }, input }) => {
      const timings: Record<string, number> = {};
      const userId = session.userId;

      const startGeneration = performance.now();
      const exercises = await generateExerciseDetails(input.subcategory);
      timings.generateExercises = performance.now() - startGeneration;
      const startCreateExercises = performance.now();
      await db.exercise.createMany({
        data: exercises.map((ex) => ({
          name: ex.name,
          description: ex.description,
          category: ex.category,
          subcategory: ex.subcategory,
          userId,
        })),
      });
      timings.createExercises = performance.now() - startCreateExercises;

      const startFindExercises = performance.now();
      const exercisesCreated = await db.exercise.findMany({
        where: {
          userId,
          subcategory: input.subcategory,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: exercises.length,
      });
      timings.findExercises = performance.now() - startFindExercises;
      const muscleData = exercisesCreated.flatMap((exercise, index) => {
        const currentExercises = exercises[index]?.muscles;
        if (!currentExercises) return [];
        return currentExercises.map((muscle) => ({
          ...muscle,
          exerciseId: exercise.id,
        }));
      });

      const startMusclePercentages = performance.now();
      await db.musclePercentage.createMany({
        data: muscleData,
      });
      timings.createMusclePercentages =
        performance.now() - startMusclePercentages;

      log.info('Operation timings (ms):', timings);
      return exercisesCreated;
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
  getOne: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx: { db, session }, input }) => {
      const generation = await db.generation.findFirstOrThrow({
        where: { id: input.id, user: { id: session.userId } },
        include: {
          exercise: { select: { id: true, name: true, subcategory: true } },
        },
      });
      return generation;
    }),
} satisfies TRPCRouterRecord;
