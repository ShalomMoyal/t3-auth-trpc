DROP INDEX IF EXISTS "account_user_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "session_user_id_idx";--> statement-breakpoint
ALTER TABLE "t3-auth-trpc_session" ALTER COLUMN "expires" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "t3-auth-trpc_user" ALTER COLUMN "email_verified" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "t3-auth-trpc_user" ALTER COLUMN "email_verified" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "t3-auth-trpc_user" ALTER COLUMN "password" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "t3-auth-trpc_verification_token" ALTER COLUMN "expires" SET DATA TYPE timestamp;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_idx" ON "t3-auth-trpc_account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "userId_idx" ON "t3-auth-trpc_session" USING btree ("user_id");--> statement-breakpoint
ALTER TABLE "t3-auth-trpc_user" ADD CONSTRAINT "t3-auth-trpc_user_email_unique" UNIQUE("email");