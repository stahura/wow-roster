import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

const ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export function randomId(length: number): string {
  const chars: string[] = [];
  const limit = 256 - (256 % ALPHABET.length);
  while (chars.length < length) {
    const bytes = randomBytes(length);
    for (const byte of bytes) {
      if (byte >= limit) continue;
      chars.push(ALPHABET[byte % ALPHABET.length] ?? "");
      if (chars.length === length) break;
    }
  }
  return chars.join("");
}

export function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function sha256Equal(left: string, right: string): boolean {
  const a = createHash("sha256").update(left).digest();
  const b = createHash("sha256").update(right).digest();
  return timingSafeEqual(a, b);
}

export const PUBLIC_ID_RE = /^[0-9A-Za-z]{12}$/;
export const SECRET_RE = /^[0-9A-Za-z]{32}$/;
