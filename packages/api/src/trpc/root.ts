import { generationRouter } from './router/generation';
import { createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
  generation: generationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
