import { z } from "zod";
import { hash } from "bcryptjs";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { users } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { v4 as uuidv4 } from "uuid";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string().min(6) }))
    .mutation(async ({ ctx, input }) => {
      try {
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

        let hashedPassword;
        try {
          hashedPassword = await hash(password, 12);
        } catch (error) {
          console.error("Error hashing password:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An error occurred during registration",
          });
        }

        const newUser = await ctx.db
          .insert(users)
          .values({
            id: uuidv4(),
            email,
            password: hashedPassword,
            // Add other required fields here if necessary
          })
          .returning();

        return { success: true, user: newUser[0] };
      } catch (error) {
        console.error("Registration error:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred during registration",
        });
      }
    }),
});
