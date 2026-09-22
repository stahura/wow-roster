import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const rosters = sqliteTable("rosters", {
  id: text("id").primaryKey(),
  manageKeyHash: text("manage_key_hash").notNull().unique(),
  title: text("title").notNull(),
  version: text("version").notNull(),
  ruleset: text("ruleset").notNull(),
  faction: text("faction").notNull(),
  cap: integer("cap").notNull(),
  signupCode: text("signup_code").notNull().default(""),
  locked: integer("locked", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at").notNull(),
});

export const characters = sqliteTable(
  "characters",
  {
    id: text("id").primaryKey(),
    rosterId: text("roster_id").notNull(),
    name: text("name").notNull(),
    nameKey: text("name_key").notNull(),
    race: text("race").notNull(),
    className: text("class_name").notNull(),
    role: text("role").notNull(),
    note: text("note").notNull().default(""),
    createdAt: integer("created_at").notNull(),
  },
  (table) => [
    uniqueIndex("characters_roster_name_unique").on(table.rosterId, table.nameKey),
  ],
);

export const rateBuckets = sqliteTable("rate_buckets", {
  bucketKey: text("bucket_key").primaryKey(),
  count: integer("count").notNull(),
  expiresAt: integer("expires_at").notNull(),
});
