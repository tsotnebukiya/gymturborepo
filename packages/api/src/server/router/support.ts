import { TRPCError, type TRPCRouterRecord } from '@trpc/server';
import { protectedProcedure } from '../trpc';
import { z } from 'zod';
import { Resend } from 'resend';
import EmailTemplate from '../../functions/email-template';
import { clerkClient } from '@clerk/nextjs/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export const supportRouter = {
  getSupport: protectedProcedure
    .input(
      z.object({ message: z.string(), generationId: z.string().optional() })
    )
    .mutation(async ({ ctx: { db, session }, input }) => {
      const user = await db.user.findUniqueOrThrow({
        where: { id: session.userId },
      });
      const { data, error } = await resend.emails.send({
        from: 'GymLead AI Support <customer@gymleadai.app>',
        to: 'contact@slai.app',
        subject: 'New Support Request',
        react: EmailTemplate({
          message: input.message,
          userName: user.name ?? 'N/A',
          userEmail: user.email,
          generationId: input.generationId,
        }),
      });
      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to send support request',
        });
      }
      return data;
    }),
  deleteAccount: protectedProcedure.mutation(
    async ({ ctx: { db, session } }) => {
      const client = await clerkClient();
      await Promise.all([
        db.user.delete({ where: { id: session.userId } }),
        client.users.deleteUser(session.userId),
      ]);
      return { success: true };
    }
  ),
} satisfies TRPCRouterRecord;
