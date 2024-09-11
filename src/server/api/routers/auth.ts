import { z } from "zod";
import { hash } from "bcryptjs";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { users } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string().min(6) }))
    .mutation(async ({ ctx, input }) => {
      const { email, password } = input;

      const existingUser = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, email),
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists with that email",
        });
      }

      const hashedPassword = await hash(password, 12);

      const newUser = await ctx.db
        .insert(users)
        .values({
          email,
          password: hashedPassword,
        })
        .returning();

      return { success: true, user: newUser[0] };
    }),
});
