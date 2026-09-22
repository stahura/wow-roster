import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { RosterError } from "./errors";
import { addCharacterRecord, createRosterRecord, setRosterLocked } from "./mutate";

const directory = mkdtempSync(path.join(tmpdir(), "wow-roster-"));
process.env.DATABASE_URL = `file:${path.join(directory, "test.db").replaceAll("\\", "/")}`;

async function rejectsRoster(run: () => Promise<void>, pattern: RegExp) {
  await assert.rejects(run, (error: unknown) => {
    assert.ok(error instanceof RosterError);
    assert.match(error.message, pattern);
    return true;
  });
}

test("signup respects faction, cap, duplicate names, lock, and code", async () => {
  const created = await createRosterRecord({
    title: "Test",
    version: "classic",
    ruleset: "pve",
    faction: "horde",
    cap: 1,
    signupCode: "storm",
  });

  await rejectsRoster(
    () =>
      addCharacterRecord({
        rosterId: created.id,
        name: "Theron",
        race: "human",
        className: "warrior",
        role: "tank",
        note: "",
        signupCode: "storm",
      }),
    /not Horde/,
  );

  await rejectsRoster(
    () =>
      addCharacterRecord({
        rosterId: created.id,
        name: "Thrall",
        race: "orc",
        className: "shaman",
        role: "healer",
        note: "",
        signupCode: "wrong",
      }),
    /does not match/,
  );

  await addCharacterRecord({
    rosterId: created.id,
    name: "thrall",
    race: "orc",
    className: "shaman",
    role: "healer",
    note: "elemental",
    signupCode: "storm",
  });

  await rejectsRoster(
    () =>
      addCharacterRecord({
        rosterId: created.id,
        name: "Thrall",
        race: "orc",
        className: "shaman",
        role: "dps",
        note: "",
        signupCode: "storm",
      }),
    /already/,
  );

  await rejectsRoster(
    () =>
      addCharacterRecord({
        rosterId: created.id,
        name: "Durotan",
        race: "orc",
        className: "warrior",
        role: "tank",
        note: "",
        signupCode: "storm",
      }),
    /full/,
  );
});

test("a locked roster rejects new names", async () => {
  const created = await createRosterRecord({
    title: "Locked",
    version: "wrath",
    ruleset: "rp",
    faction: "alliance",
    cap: 10,
    signupCode: "",
  });

  await setRosterLocked(created.id, true);
  await rejectsRoster(
    () =>
      addCharacterRecord({
        rosterId: created.id,
        name: "Darion",
        race: "human",
        className: "death_knight",
        role: "tank",
        note: "",
        signupCode: "",
      }),
    /locked/,
  );

  await setRosterLocked(created.id, false);
  await addCharacterRecord({
    rosterId: created.id,
    name: "Darion",
    race: "human",
    className: "death_knight",
    role: "tank",
    note: "",
    signupCode: "",
  });
});

test("burning crusade blood elves can be paladins and not warriors", async () => {
  const created = await createRosterRecord({
    title: "TBC",
    version: "tbc",
    ruleset: "pvp",
    faction: "horde",
    cap: 5,
    signupCode: "",
  });

  await addCharacterRecord({
    rosterId: created.id,
    name: "Kael",
    race: "blood_elf",
    className: "paladin",
    role: "healer",
    note: "",
    signupCode: "",
  });

  await rejectsRoster(
    () =>
      addCharacterRecord({
        rosterId: created.id,
        name: "Warrior",
        race: "blood_elf",
        className: "warrior",
        role: "dps",
        note: "",
        signupCode: "",
      }),
    /cannot be a Warrior/,
  );
});
