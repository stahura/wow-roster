import "server-only";
import { headers } from "next/headers";
import { getClient, ensureDb } from "./database";
import { sha256 } from "./ids";

function salt(): string {
  const value = process.env.ROSTER_IP_SALT;
  if (value && value.length >= 16) return value;
  if (process.env.NODE_ENV === "production") {
    throw new Error("ROSTER_IP_SALT must be set to at least 16 characters in production");
  }
  return "dev-only-roster-salt";
}

export async function clientIp(): Promise<string> {
  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first.slice(0, 64);
  }
  return (headerList.get("x-real-ip") ?? "local").slice(0, 64);
}

export async function withinRate(
  action: string,
  limit: number,
  windowMs: number,
): Promise<boolean> {
  await ensureDb();
  const ip = await clientIp();
  const now = Date.now();
  const windowStart = Math.floor(now / windowMs) * windowMs;
  const bucketKey = sha256(`${salt()}|${action}|${windowStart}|${ip}`);
  const expiresAt = windowStart + windowMs;
  const client = getClient();
  await client.execute({
    sql: "DELETE FROM rate_buckets WHERE expires_at < ?",
    args: [now],
  });
  const result = await client.execute({
    sql: `INSERT INTO rate_buckets (bucket_key, count, expires_at)
          VALUES (?, 1, ?)
          ON CONFLICT(bucket_key) DO UPDATE SET count = count + 1
          RETURNING count`,
    args: [bucketKey, expiresAt],
  });
  const raw = result.rows[0]?.count;
  const used = typeof raw === "number" ? raw : Number(raw ?? 0);
  return used <= limit;
}
