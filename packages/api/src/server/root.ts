import { generationRouter } from './router/generation';
import { exerciseRouter } from './router/exercise';
import { createTRPCRouter } from './trpc';
import { splitRouter } from './router/split';
import { bookmarksRouter } from './router/bookmarks';
import { supportRouter } from './router/support';

export const appRouter = createTRPCRouter({
  generation: generationRouter,
  exercise: exerciseRouter,
  split: splitRouter,
  bookmark: bookmarksRouter,
  support: supportRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
