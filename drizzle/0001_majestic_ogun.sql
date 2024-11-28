CREATE TABLE IF NOT EXISTS "t3-auth-trpc_proposal" (
	"id" varchar(255) NOT NULL,
	"interested_studies" varchar(255) NOT NULL,
	"form_learning" varchar(255) NOT NULL,
	"study_time" varchar(255) NOT NULL,
	"contact" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_by" varchar(255) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "t3-auth-trpc_proposal" ADD CONSTRAINT "t3-auth-trpc_proposal_created_by_t3-auth-trpc_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."t3-auth-trpc_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
