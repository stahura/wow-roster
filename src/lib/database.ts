import fs from "node:fs";
import path from "node:path";
import { createClient, type Client } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  rosterClient?: Client;
  rosterDb?: LibSQLDatabase<typeof schema>;
  rosterReady?: Promise<void>;
};

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS rosters (
  id text PRIMARY KEY NOT NULL,
  manage_key_hash text NOT NULL UNIQUE,
  title text NOT NULL,
  version text NOT NULL,
  ruleset text NOT NULL,
  faction text NOT NULL,
  cap integer NOT NULL,
  signup_code text NOT NULL DEFAULT '',
  locked integer NOT NULL DEFAULT 0,
  created_at integer NOT NULL
);
CREATE TABLE IF NOT EXISTS characters (
  id text PRIMARY KEY NOT NULL,
  roster_id text NOT NULL,
  name text NOT NULL,
  name_key text NOT NULL,
  race text NOT NULL,
  class_name text NOT NULL,
  role text NOT NULL,
  note text NOT NULL DEFAULT '',
  created_at integer NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS characters_roster_name_unique
  ON characters (roster_id, name_key);
CREATE INDEX IF NOT EXISTS characters_roster_idx ON characters (roster_id);
CREATE TABLE IF NOT EXISTS rate_buckets (
  bucket_key text PRIMARY KEY NOT NULL,
  count integer NOT NULL,
  expires_at integer NOT NULL
);
`;

function resolveUrl(): string {
  const configured = process.env.DATABASE_URL;
  if (configured) return configured;
  const dir = path.join(process.cwd(), "data");
  fs.mkdirSync(dir, { recursive: true });
  return "file:data/roster.db";
}

export function getClient(): Client {
  if (!globalForDb.rosterClient) {
    globalForDb.rosterClient = createClient({ url: resolveUrl() });
  }
  return globalForDb.rosterClient;
}

export function getDb() {
  if (!globalForDb.rosterDb) {
    globalForDb.rosterDb = drizzle(getClient(), { schema });
  }
  return globalForDb.rosterDb;
}

export async function ensureDb(): Promise<void> {
  if (!globalForDb.rosterReady) {
    const client = getClient();
    globalForDb.rosterReady = (async () => {
      await client.execute("PRAGMA foreign_keys = ON");
      await client.executeMultiple(SCHEMA_SQL);
    })().catch((error: unknown) => {
      globalForDb.rosterReady = undefined;
      throw error;
    });
  }
  await globalForDb.rosterReady;
}
