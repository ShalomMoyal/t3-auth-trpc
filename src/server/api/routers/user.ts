import { z } from "zod";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          name: z.string().optional(),
          email: z.string().email().optional(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input;

      const updatedUser = await ctx.db
        .update(users)
        .set(data)
        .where(eq(users.id, id))
        .returning();

      return updatedUser[0];
    })
});
