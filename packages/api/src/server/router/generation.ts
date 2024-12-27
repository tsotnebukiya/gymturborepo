import { TRPCError, type TRPCRouterRecord } from '@trpc/server';
import { protectedProcedure } from '../trpc';
import { createGenerationSchema } from '../../functions/schemas';
import {
  checkAndUpdateGenerationLimit,
  MAX_MONTHLY_GENERATIONS,
  uploadImageToBlob,
} from '../../functions/utils';
import { generateGymResponse } from '../../functions/openai';
import { log } from 'next-axiom';
import { z } from 'zod';
import { Language } from '@prisma/client';

export const generationRouter = {
  create: protectedProcedure
    .input(createGenerationSchema)
    .mutation(async ({ ctx: { db, session }, input }) => {
      const user = await db.user.findUniqueOrThrow({
        where: {
          id: session.userId,
        },
        select: {
          monthlyGenerations: true,
          lastGenerationReset: true,
          id: true,
        },
      });
      const canGenerate = await checkAndUpdateGenerationLimit({ user });
      if (!canGenerate) {
        throw new TRPCError({
          code: 'TOO_MANY_REQUESTS',
          message: `You've reached your monthly limit of ${MAX_MONTHLY_GENERATIONS} generations.`,
        });
      }
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

      const status = gymEquipmentResponse ? 'COMPLETED' : 'FAILED';
      const startGeneration = performance.now();
      const generation = await db.generation.create({
        data: {
          status,
          exercise: {
            connect:
              gymEquipmentResponse?.exerciseIds.map((id) => ({ id })) || [],
          },
          translations: {
            create: gymEquipmentResponse?.translations || [],
          },
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
  getAll: protectedProcedure
    .input(z.object({ language: z.nativeEnum(Language) }))
    .query(async ({ ctx: { db, session }, input }) => {
      const language = input.language;
      const startTime = performance.now();
      const generations = await db.generation.findMany({
        where: {
          user: { id: session.userId },
        },
        select: {
          id: true,
          image: true,
          status: true,
          translations: {
            where: {
              language,
            },
            select: {
              name: true,
              description: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 3,
      });
      const endTime = performance.now();
      log.debug('Generation getAll query executed', {
        duration: Math.round(endTime - startTime),
        userId: session.userId,
        resultCount: generations.length,
      });
      const result = generations.map((gen) => {
        const { id, image, status, translations } = gen;
        const name = translations[0]?.name;
        const description = translations[0]?.description;
        return {
          id,
          image,
          status,
          name,
          description,
        };
      });
      return result;
    }),
  getOne: protectedProcedure
    .input(z.object({ id: z.number(), language: z.nativeEnum(Language) }))
    .query(async ({ ctx: { db, session }, input }) => {
      const language = input.language;
      const generationResponse = await db.generation.findFirstOrThrow({
        where: { id: input.id, user: { id: session.userId } },
        include: {
          exercise: {
            select: {
              id: true,
              videoId: true,
              subcategory: true,
              sets: true,
              reps: true,
              translations: {
                where: {
                  language,
                },
                select: {
                  name: true,
                },
              },
            },
          },
          translations: {
            where: {
              language,
            },
            select: {
              name: true,
              description: true,
            },
          },
        },
      });
      const { id, image, translations, status, exercise } = generationResponse;
      const failed = generationResponse.status === 'FAILED';
      if (failed) {
        return {
          id,
          image,
          status,
          name: 'Invalid image',
          description: 'Invalid image',
          exercise: [],
        };
      }

      const name = translations[0]!.name;
      const description = translations[0]!.description;
      const formattedExercise = exercise.map((ex) => {
        const { id, subcategory, translations, videoId, sets, reps } = ex;
        const name = translations[0]!.name;
        return { id, subcategory, name, videoId, sets, reps };
      });
      const generation = {
        id,
        image,
        status,
        name,
        description,
        exercise: formattedExercise,
      };
      return generation;
    }),
} satisfies TRPCRouterRecord;
