import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { RosterError } from "./errors";
import {
  addCharacterRecord,
  createRosterRecord,
  getRoster,
  setRosterLocked,
} from "./mutate";

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
    version: "forever",
    ruleset: "pve",
    faction: "horde",
    cap: 1,
    signupCode: "storm",
  });

  const roster = await getRoster(created.id);
  assert.equal(roster?.version, "forever");

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
    version: "forever",
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
        className: "warrior",
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
    className: "hunter",
    role: "dps",
    note: "",
    signupCode: "",
  });
});

test("forever rejects dropped races and classes at signup", async () => {
  const created = await createRosterRecord({
    title: "Forever",
    version: "forever",
    ruleset: "pvp",
    faction: "horde",
    cap: 5,
    signupCode: "",
  });

  await rejectsRoster(
    () =>
      addCharacterRecord({
        rosterId: created.id,
        name: "Kael",
        race: "blood_elf",
        className: "paladin",
        role: "healer",
        note: "",
        signupCode: "",
      }),
    /Pick a race/,
  );

  await rejectsRoster(
    () =>
      addCharacterRecord({
        rosterId: created.id,
        name: "Darion",
        race: "orc",
        className: "death_knight",
        role: "tank",
        note: "",
        signupCode: "",
      }),
    /Pick a race/,
  );

  await rejectsRoster(
    () =>
      addCharacterRecord({
        rosterId: created.id,
        name: "Velen",
        race: "draenei",
        className: "shaman",
        role: "healer",
        note: "",
        signupCode: "",
      }),
    /Pick a race/,
  );
});

test("skyborne signup follows faction class split", async () => {
  const alliance = await createRosterRecord({
    title: "Sky A",
    version: "forever",
    ruleset: "pve",
    faction: "alliance",
    cap: 5,
    signupCode: "",
  });

  await addCharacterRecord({
    rosterId: alliance.id,
    name: "Aerie",
    race: "skyborne",
    className: "mage",
    role: "dps",
    note: "",
    signupCode: "",
  });

  await rejectsRoster(
    () =>
      addCharacterRecord({
        rosterId: alliance.id,
        name: "Storm",
        race: "skyborne",
        className: "shaman",
        role: "healer",
        note: "",
        signupCode: "",
      }),
    /cannot be a Shaman/,
  );

  const horde = await createRosterRecord({
    title: "Sky H",
    version: "forever",
    ruleset: "pve",
    faction: "horde",
    cap: 5,
    signupCode: "",
  });

  await addCharacterRecord({
    rosterId: horde.id,
    name: "Gale",
    race: "skyborne",
    className: "shaman",
    role: "healer",
    note: "",
    signupCode: "",
  });

  await rejectsRoster(
    () =>
      addCharacterRecord({
        rosterId: horde.id,
        name: "Spark",
        race: "skyborne",
        className: "mage",
        role: "dps",
        note: "",
        signupCode: "",
      }),
    /cannot be a Mage/,
  );
});

test("create always persists forever even if a legacy version is passed", async () => {
  const created = await createRosterRecord({
    title: "Cutover",
    // @ts-expect-error intentional legacy input for cutover coverage
    version: "classic",
    ruleset: "pve",
    faction: "alliance",
    cap: 10,
    signupCode: "",
  });
  const roster = await getRoster(created.id);
  assert.equal(roster?.version, "forever");
});
