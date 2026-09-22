import { cache } from "react";
import { and, count, eq } from "drizzle-orm";
import { characters, rosters } from "./schema";
import { ensureDb, getDb } from "./database";
import { RosterError } from "./errors";
import { PUBLIC_ID_RE, randomId, SECRET_RE, sha256, sha256Equal } from "./ids";
import {
  comboError,
  formatCharacterName,
  isClass,
  isFaction,
  isRace,
  isRole,
  isRuleset,
  isVersion,
  MAX_CAP,
  type CharacterLine,
  type ClassId,
  type Faction,
  type Race,
  type Role,
  type Ruleset,
  type Version,
} from "./rules";

export type RosterRecord = typeof rosters.$inferSelect;
export type CharacterRecord = typeof characters.$inferSelect;

function isUniqueError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /unique/i.test(message);
}

export async function createRosterRecord(input: {
  title: string;
  version: Version;
  ruleset: Ruleset;
  faction: Faction;
  cap: number;
  signupCode: string;
}): Promise<{ id: string; secret: string }> {
  await ensureDb();
  const db = getDb();
  const secret = randomId(32);
  const manageKeyHash = sha256(secret);

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const id = randomId(12);
    try {
      await db.insert(rosters).values({
        id,
        manageKeyHash,
        title: input.title,
        version: input.version,
        ruleset: input.ruleset,
        faction: input.faction,
        cap: input.cap,
        signupCode: input.signupCode,
        locked: false,
        createdAt: Date.now(),
      });
      return { id, secret };
    } catch (error) {
      if (isUniqueError(error) && attempt < 2) continue;
      throw error;
    }
  }

  throw new RosterError("Could not create the roster. Try again.");
}

export const getRoster = cache(async (id: string): Promise<RosterRecord | null> => {
  if (!PUBLIC_ID_RE.test(id)) return null;
  await ensureDb();
  const [row] = await getDb().select().from(rosters).where(eq(rosters.id, id)).limit(1);
  return row ?? null;
});

export const getRosterBySecret = cache(async (secret: string): Promise<RosterRecord | null> => {
  if (!SECRET_RE.test(secret)) return null;
  await ensureDb();
  const [row] = await getDb()
    .select()
    .from(rosters)
    .where(eq(rosters.manageKeyHash, sha256(secret)))
    .limit(1);
  return row ?? null;
});

export async function listCharacters(rosterId: string): Promise<CharacterRecord[]> {
  await ensureDb();
  return getDb()
    .select()
    .from(characters)
    .where(eq(characters.rosterId, rosterId))
    .orderBy(characters.createdAt);
}

export async function addCharacterRecord(input: {
  rosterId: string;
  name: string;
  race: string;
  className: string;
  role: string;
  note: string;
  signupCode: string;
}): Promise<void> {
  const name = formatCharacterName(input.name);
  if (!name) {
    throw new RosterError("Character names are 2–12 letters.");
  }
  if (!isRace(input.race) || !isClass(input.className) || !isRole(input.role)) {
    throw new RosterError("Pick a race, class, and role from the list.");
  }

  const race: Race = input.race;
  const className: ClassId = input.className;
  const role: Role = input.role;
  const note = input.note;

  await ensureDb();
  const db = getDb();

  try {
    await db.transaction(
      async (tx) => {
        const [roster] = await tx
          .select()
          .from(rosters)
          .where(eq(rosters.id, input.rosterId))
          .limit(1);
        if (!roster) throw new RosterError("That roster does not exist.");
        if (!isVersion(roster.version) || !isFaction(roster.faction)) {
          throw new RosterError("This roster is misconfigured.");
        }
        if (roster.locked) throw new RosterError("Signup is locked.");
        if (roster.signupCode && !sha256Equal(roster.signupCode, input.signupCode)) {
          throw new RosterError("Signup code does not match.");
        }

        const problem = comboError(roster.version, roster.faction, race, className, role);
        if (problem) throw new RosterError(problem);

        const [existing] = await tx
          .select({ id: characters.id })
          .from(characters)
          .where(and(eq(characters.rosterId, roster.id), eq(characters.nameKey, name.toLowerCase())))
          .limit(1);
        if (existing) throw new RosterError("That name is already on this roster.");

        const [counted] = await tx
          .select({ n: count() })
          .from(characters)
          .where(eq(characters.rosterId, roster.id));
        const taken = counted?.n ?? 0;
        const limit = Math.min(roster.cap, MAX_CAP);
        if (taken >= limit) throw new RosterError("That roster is full.");

        await tx.insert(characters).values({
          id: randomId(12),
          rosterId: roster.id,
          name,
          nameKey: name.toLowerCase(),
          race,
          className,
          role,
          note,
          createdAt: Date.now(),
        });
      },
      { behavior: "immediate" },
    );
  } catch (error) {
    if (error instanceof RosterError) throw error;
    if (isUniqueError(error)) {
      throw new RosterError("That name is already on this roster.");
    }
    throw error;
  }
}

export async function removeCharacterRecord(rosterId: string, characterId: string): Promise<void> {
  if (!PUBLIC_ID_RE.test(characterId)) return;
  await ensureDb();
  await getDb()
    .delete(characters)
    .where(and(eq(characters.id, characterId), eq(characters.rosterId, rosterId)));
}

export async function setRosterLocked(rosterId: string, locked: boolean): Promise<void> {
  await ensureDb();
  await getDb().update(rosters).set({ locked }).where(eq(rosters.id, rosterId));
}

export async function setRosterCap(rosterId: string, cap: number): Promise<void> {
  await ensureDb();
  const db = getDb();
  await db.transaction(async (tx) => {
    const [counted] = await tx
      .select({ n: count() })
      .from(characters)
      .where(eq(characters.rosterId, rosterId));
    const taken = counted?.n ?? 0;
    if (cap < taken) {
      throw new RosterError(
        `Cap cannot be lower than the ${taken} ${taken === 1 ? "person" : "people"} already signed up.`,
      );
    }
    await tx.update(rosters).set({ cap }).where(eq(rosters.id, rosterId));
  });
}

export async function deleteRosterRecord(rosterId: string): Promise<void> {
  await ensureDb();
  const db = getDb();
  await db.delete(characters).where(eq(characters.rosterId, rosterId));
  await db.delete(rosters).where(eq(rosters.id, rosterId));
}

export function visibleCharacters(
  rows: CharacterRecord[],
): (CharacterLine & { id: string })[] {
  const lines: (CharacterLine & { id: string })[] = [];
  for (const row of rows) {
    if (!isRace(row.race) || !isClass(row.className) || !isRole(row.role)) continue;
    lines.push({
      id: row.id,
      name: row.name,
      race: row.race,
      className: row.className,
      role: row.role,
      note: row.note,
    });
  }
  return lines;
}

export function assertRosterShape(row: RosterRecord): {
  version: Version;
  ruleset: Ruleset;
  faction: Faction;
} {
  if (!isVersion(row.version) || !isRuleset(row.ruleset) || !isFaction(row.faction)) {
    throw new RosterError("This roster is misconfigured.");
  }
  return { version: row.version, ruleset: row.ruleset, faction: row.faction };
}
