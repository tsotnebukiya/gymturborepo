import type { TRPCRouterRecord } from '@trpc/server';

import { protectedProcedure } from '../trpc';
import { z } from 'zod';

export const generationRouter = {
  all: protectedProcedure
    .input(
      z.object({
        image: z.string(),
        imageType: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const string = ctx.session.userId;
      // const user = await ctx.db.user.findFirst();
      // return user;
      console.log(string);
      return string;
    }),
} satisfies TRPCRouterRecord;
