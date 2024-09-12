CREATE TABLE IF NOT EXISTS "t3_auth_trpc_accounts" (
	"user_id" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"provider_account_id" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "t3_auth_trpc_accounts_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "t3_auth_trpc_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"body" text NOT NULL,
	"created_by_id" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "t3_auth_trpc_sessions" (
	"session_token" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "t3_auth_trpc_users" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp,
	"image" varchar(255),
	"password" varchar(255),
	CONSTRAINT "t3_auth_trpc_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "t3_auth_trpc_verification_tokens" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "t3_auth_trpc_verification_tokens_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "t3_auth_trpc_accounts" ADD CONSTRAINT "t3_auth_trpc_accounts_user_id_t3_auth_trpc_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."t3_auth_trpc_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "t3_auth_trpc_posts" ADD CONSTRAINT "t3_auth_trpc_posts_created_by_id_t3_auth_trpc_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."t3_auth_trpc_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "t3_auth_trpc_sessions" ADD CONSTRAINT "t3_auth_trpc_sessions_user_id_t3_auth_trpc_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."t3_auth_trpc_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_user_id_idx" ON "t3_auth_trpc_accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "created_by_id_idx" ON "t3_auth_trpc_posts" USING btree ("created_by_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "title_idx" ON "t3_auth_trpc_posts" USING btree ("title");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "accounts_user_id_idx" ON "t3_auth_trpc_sessions" USING btree ("user_id");