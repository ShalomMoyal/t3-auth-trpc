import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { posts } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, "Title is required"),
        body: z.string().min(1, "Body is required"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log("Received input in create procedure:", input); // Debug log
      console.log("Session in create procedure:", ctx.session); // Debug log
      const { title, body } = input;
      const result = await ctx.db.insert(posts).values({
        title,
        body,
        createdById: ctx.session.user.id,
      });
      console.log("Insert result:", result); // Debug log
      return result;
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });

    return post ?? null;
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const allPosts = await ctx.db.query.posts.findMany({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
    return allPosts;
  }),

  update: protectedProcedure
    .input(
      z.object({ id: z.number(), title: z.string().min(1), body: z.string() }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(posts)
        .set({ title: input.title, body: input.body })
        .where(eq(posts.id, input.id));
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(posts).where(eq(posts.id, input.id));
    }),
});
