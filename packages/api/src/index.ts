import { db, type PrismaTypes } from './db';
import redis from './db/redis';
import type { AppRouter } from './server';
import {
  appRouter,
  createTRPCContext,
  createCaller,
  type RouterInputs,
  type RouterOutputs,
} from './server';

export { generateExercisesDetails } from './functions/openai';
export { createTRPCContext, appRouter, createCaller, db, redis };
export type { AppRouter, RouterInputs, RouterOutputs, PrismaTypes };
