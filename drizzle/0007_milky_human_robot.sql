CREATE TABLE IF NOT EXISTS "t3-auth-trpc_favorit" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"proposal_id" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "t3-auth-trpc_favorit" ADD CONSTRAINT "t3-auth-trpc_favorit_user_id_t3-auth-trpc_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."t3-auth-trpc_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "t3-auth-trpc_favorit" ADD CONSTRAINT "t3-auth-trpc_favorit_proposal_id_t3-auth-trpc_proposal_id_fk" FOREIGN KEY ("proposal_id") REFERENCES "public"."t3-auth-trpc_proposal"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
