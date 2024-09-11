import { sql } from "drizzle-orm";
import { pgTable, varchar, text, index } from "drizzle-orm/pg-core";

export async function up(db) {
  await db.schema
    .alterTable("t3-auth-trpc_post")
    .addColumn("title", varchar("title", { length: 256 }).notNull())
    .addColumn("body", text("body").notNull())
    .execute();

  await db.schema
    .createIndex("title_idx")
    .on("t3-auth-trpc_post")
    .column("title")
    .execute();

  // Migrate existing data
  await db.execute(sql`
    UPDATE "t3-auth-trpc_post"
    SET "title" = "name", "body" = ''
    WHERE "title" IS NULL
  `);

  await db.schema.alterTable("t3-auth-trpc_post").dropColumn("name").execute();
}

export async function down(db) {
  await db.schema
    .alterTable("t3-auth-trpc_post")
    .dropColumn("title")
    .dropColumn("body")
    .addColumn("name", varchar("name", { length: 256 }))
    .execute();

  await db.schema.dropIndex("title_idx").execute();
}
