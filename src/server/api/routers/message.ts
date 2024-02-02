import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const messageRouter = createTRPCRouter({
  createMessage: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.message.create({
        data: {
          text: input.name,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  getMessage: protectedProcedure.query(({ ctx }) => {
    return ctx.db.message.findMany();
  }),
});
