import { generationRouter } from './router/generation';
import { exerciseRouter } from './router/exercise';
import { createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
  generation: generationRouter,
  exercise: exerciseRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
