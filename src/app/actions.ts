"use server";

import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { RosterError } from "@/lib/errors";
import {
  addCharacterRecord,
  createRosterRecord,
  deleteRosterRecord,
  getRosterBySecret,
  removeCharacterRecord,
  setRosterCap,
  setRosterLocked,
} from "@/lib/mutate";
import { withinRate } from "@/lib/rate-limit";
import {
  cleanNote,
  cleanSignupCode,
  cleanTitle,
  isFaction,
  isRuleset,
  parseCap,
} from "@/lib/rules";

export type ActionState = {
  error?: string;
  saved?: boolean;
};

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

function field(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function honeypotTripped(formData: FormData): boolean {
  return field(formData, "company").trim().length > 0;
}

function asError(error: unknown): ActionState {
  if (error instanceof RosterError) return { error: error.message };
  throw error;
}

export async function createRoster(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (honeypotTripped(formData)) {
    return { error: "Could not create the roster." };
  }

  const title = cleanTitle(field(formData, "title"));
  const ruleset = field(formData, "ruleset");
  const faction = field(formData, "faction");
  const cap = parseCap(field(formData, "cap"));
  const signupCode = cleanSignupCode(field(formData, "signupCode"));

  if (!title) return { error: "Give the roster a name, up to 60 characters." };
  if (!isRuleset(ruleset)) return { error: "Pick a ruleset." };
  if (!isFaction(faction)) return { error: "Pick a faction." };
  if (cap === null) return { error: "Cap must be a whole number from 1 to 1000." };
  if (signupCode === null) {
    return { error: "Signup code must be 4–32 letters, numbers, spaces, or . _ -" };
  }

  const hourly = await withinRate("create-hour", 8, HOUR);
  const daily = await withinRate("create-day", 20, DAY);
  if (!hourly || !daily) {
    return { error: "Too many rosters from this network. Try again later." };
  }

  let secret = "";
  try {
    const created = await createRosterRecord({
      title,
      version: "forever",
      ruleset,
      faction,
      cap,
      signupCode,
    });
    secret = created.secret;
  } catch (error) {
    return asError(error);
  }

  redirect(`/m/${secret}`);
}

export async function addCharacter(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (honeypotTripped(formData)) {
    return { error: "Could not add that player." };
  }

  const rosterId = field(formData, "rosterId");
  const note = cleanNote(field(formData, "note"));
  if (note === null) return { error: "Notes must be 140 characters or fewer." };

  const allowed = await withinRate("signup-hour", 40, HOUR);
  if (!allowed) {
    return { error: "Too many signups from this network. Try again later." };
  }

  try {
    await addCharacterRecord({
      rosterId,
      nickname: field(formData, "nickname"),
      characterName: field(formData, "characterName"),
      race: field(formData, "race"),
      className: field(formData, "className"),
      role: field(formData, "role"),
      note,
      signupCode: field(formData, "signupCode"),
    });
  } catch (error) {
    return asError(error);
  }

  revalidatePath(`/r/${rosterId}`);
  return {};
}

async function managedRoster(secret: string) {
  const allowed = await withinRate("manage-hour", 120, HOUR);
  if (!allowed) {
    throw new RosterError("Too many edits from this network. Try again later.");
  }
  const roster = await getRosterBySecret(secret);
  if (!roster) notFound();
  return roster;
}

export async function removeCharacter(formData: FormData): Promise<void> {
  const secret = field(formData, "secret");
  const roster = await managedRoster(secret);
  await removeCharacterRecord(roster.id, field(formData, "characterId"));
  revalidatePath(`/r/${roster.id}`);
}

export async function setLocked(formData: FormData): Promise<void> {
  const secret = field(formData, "secret");
  const roster = await managedRoster(secret);
  await setRosterLocked(roster.id, field(formData, "locked") === "1");
  revalidatePath(`/r/${roster.id}`);
}

export async function updateCap(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const secret = field(formData, "secret");
  const cap = parseCap(field(formData, "cap"));
  if (cap === null) return { error: "Cap must be a whole number from 1 to 1000." };

  try {
    const roster = await managedRoster(secret);
    await setRosterCap(roster.id, cap);
    revalidatePath(`/r/${roster.id}`);
  } catch (error) {
    return asError(error);
  }

  return { saved: true };
}

export async function deleteRoster(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (field(formData, "confirm") !== "yes") {
    return { error: "Check the box to delete this roster." };
  }

  const secret = field(formData, "secret");
  try {
    const roster = await managedRoster(secret);
    await deleteRosterRecord(roster.id);
    revalidatePath(`/r/${roster.id}`);
  } catch (error) {
    return asError(error);
  }

  redirect("/?deleted=1");
}
