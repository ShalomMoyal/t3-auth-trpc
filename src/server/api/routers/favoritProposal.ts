import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { favorit, proposals } from "@/server/db/schema"; // Import both tables

export const favoritRouter = createTRPCRouter({
  add: protectedProcedure
    .input(
      z.object({
        proposalId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.db
        .insert(favorit)
        .values({
          userId: ctx.session.user.id,
          proposalId: input.proposalId,
          createdAt: new Date(),
        })
        .returning();
    }),

  remove: protectedProcedure
    .input(
      z.object({
        proposalId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.db
        .delete(favorit)
        .where(
          and(
            eq(favorit.userId, ctx.session.user.id),
            eq(favorit.proposalId, input.proposalId),
          ),
        );
    }),

  getUserFaivoritProposal: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select({
        proposalId: proposals.id,
        interestedStudies: proposals.interestedStudies,
        formLearning: proposals.formLearning,
        studyTime: proposals.studyTime,
        contact: proposals.contact,
        createdAt: favorit.createdAt,
        //I need to add user id to req
      })
      .from(favorit)
      .innerJoin(proposals, eq(favorit.proposalId, proposals.id)) // Join with proposal table
      .where(eq(favorit.userId, ctx.session.user.id));
  }),
});
