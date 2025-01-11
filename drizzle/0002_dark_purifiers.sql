ALTER TABLE "t3-auth-trpc_user" DROP CONSTRAINT "t3-auth-trpc_user_FavoritesProposal_t3-auth-trpc_proposal_id_fk";
--> statement-breakpoint
ALTER TABLE "t3-auth-trpc_user" ADD COLUMN "fullName" varchar(255);--> statement-breakpoint
ALTER TABLE "t3-auth-trpc_user" DROP COLUMN IF EXISTS "FullName";--> statement-breakpoint
ALTER TABLE "t3-auth-trpc_user" DROP COLUMN IF EXISTS "FavoritesProposal";