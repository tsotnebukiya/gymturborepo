import { generationRouter } from './router/generation';
import { exerciseRouter } from './router/exercise';
import { createTRPCRouter } from './trpc';
import { splitRouter } from './router/split';

export const appRouter = createTRPCRouter({
  generation: generationRouter,
  exercise: exerciseRouter,
  split: splitRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
