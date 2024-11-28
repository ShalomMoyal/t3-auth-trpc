import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { proposals } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const proposalRouter = createTRPCRouter({
  // Example public procedure
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  // Create procedure
  create: protectedProcedure
    .input(
      z.object({
        interestedStudies: z.string().min(1, "Interested studies is required"),
        formLearning: z.string().min(1, "Form of learning is required"),
        studyTime: z.string().min(1, "Study time is required"),
        contact: z.string().min(1, "Contact is required"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { interestedStudies, formLearning, studyTime, contact } = input;
      const result = await ctx.db.insert(proposals).values({
        id: crypto.randomUUID(),
        interestedStudies,
        formLearning,
        studyTime,
        contact,
        createdById: ctx.session.user.id,
      });
      return result;
    }),

  // Update procedure
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid("Invalid proposal ID"),
        interestedStudies: z.string().min(1, "Interested studies is required"),
        formLearning: z.string().min(1, "Form of learning is required"),
        studyTime: z.string().min(1, "Study time is required"),
        contact: z.string().min(1, "Contact is required"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, interestedStudies, formLearning, studyTime, contact } = input;

      const result = await ctx.db
        .update(proposals)
        .set({
          interestedStudies,
          formLearning,
          studyTime,
          contact,
        })
        .where(eq(proposals.id, id));

      return result;
    }),

  // Delete procedure
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid("Invalid proposal ID"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      const result = await ctx.db
        .delete(proposals)
        .where(eq(proposals.id, id));

      return { success: true, result };
    }),

    getAll: protectedProcedure.query(async ({ ctx }) => {
        const allProposal = await ctx.db.query.proposals.findMany({
          orderBy: (posts, { desc }) => [desc(posts.createdAt)],
        });
        return allProposal;
      }),
});
