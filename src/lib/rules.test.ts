import assert from "node:assert/strict";
import test from "node:test";
import {
  classesFor,
  cleanSignupCode,
  cleanTitle,
  comboError,
  formatCharacterName,
  formatRosterText,
  isClass,
  isRace,
  isVersion,
  parseCap,
  racesFor,
} from "./rules";

test("character names are letters and title case", () => {
  assert.equal(formatCharacterName(" thrall "), "Thrall");
  assert.equal(formatCharacterName("A"), null);
  assert.equal(formatCharacterName("Name With Space"), null);
  assert.equal(formatCharacterName("Abcdefghijklm"), null);
});

test("forever accepts new race/class combos and rejects dropped content", () => {
  assert.equal(comboError("forever", "alliance", "human", "hunter", "dps"), null);
  assert.equal(comboError("forever", "alliance", "dwarf", "shaman", "healer"), null);
  assert.equal(comboError("forever", "alliance", "gnome", "priest", "healer"), null);
  assert.equal(comboError("forever", "horde", "orc", "mage", "dps"), null);
  assert.equal(comboError("forever", "horde", "troll", "warlock", "dps"), null);
  assert.equal(comboError("forever", "horde", "undead", "paladin", "healer"), null);

  assert.match(comboError("forever", "horde", "human", "warrior", "tank") ?? "", /not Horde/);
  assert.match(
    comboError("forever", "alliance", "night_elf", "paladin", "healer") ?? "",
    /cannot be a Paladin/,
  );
  assert.match(
    comboError("forever", "horde", "tauren", "mage", "dps") ?? "",
    /cannot be a Mage/,
  );

  assert.equal(isVersion("forever"), true);
  assert.equal(isVersion("classic"), false);
  assert.equal(isVersion("tbc"), false);
  assert.equal(isVersion("wrath"), false);
  assert.equal(isRace("draenei"), false);
  assert.equal(isRace("blood_elf"), false);
  assert.equal(isRace("skyborne"), true);
  assert.equal(isClass("death_knight"), false);
});

test("skyborne is faction-pickable with split class lists", () => {
  assert.equal(comboError("forever", "alliance", "skyborne", "mage", "dps"), null);
  assert.equal(comboError("forever", "alliance", "skyborne", "druid", "healer"), null);
  assert.match(
    comboError("forever", "alliance", "skyborne", "shaman", "healer") ?? "",
    /cannot be a Shaman/,
  );

  assert.equal(comboError("forever", "horde", "skyborne", "shaman", "healer"), null);
  assert.equal(comboError("forever", "horde", "skyborne", "druid", "tank"), null);
  assert.match(
    comboError("forever", "horde", "skyborne", "mage", "dps") ?? "",
    /cannot be a Mage/,
  );

  assert.deepEqual(racesFor("forever", "alliance").includes("skyborne"), true);
  assert.deepEqual(racesFor("forever", "horde").includes("skyborne"), true);
  assert.deepEqual(classesFor("forever", "alliance", "skyborne"), [
    "warrior",
    "hunter",
    "mage",
    "rogue",
    "druid",
  ]);
  assert.deepEqual(classesFor("forever", "horde", "skyborne"), [
    "warrior",
    "hunter",
    "rogue",
    "druid",
    "shaman",
  ]);
});

test("caps, titles, and signup codes stay bounded", () => {
  assert.equal(parseCap("40"), 40);
  assert.equal(parseCap("1000"), 1000);
  assert.equal(parseCap("0"), null);
  assert.equal(parseCap("1001"), null);
  assert.equal(parseCap("40.5"), null);
  assert.equal(cleanTitle("  Sunday   Raid "), "Sunday Raid");
  assert.equal(cleanTitle(""), null);
  assert.equal(cleanSignupCode(""), "");
  assert.equal(cleanSignupCode("ab"), null);
  assert.equal(cleanSignupCode("storm wind"), "storm wind");
  assert.equal(cleanSignupCode("drop table"), "drop table");
});

test("discord export groups by role", () => {
  const text = formatRosterText({
    title: "Sunday",
    version: "forever",
    ruleset: "pve",
    faction: "alliance",
    cap: 40,
    characters: [
      {
        name: "Theron",
        race: "night_elf",
        className: "druid",
        role: "healer",
        note: "resto",
      },
    ],
  });
  assert.match(text, /Sunday/);
  assert.match(text, /WoW: Forever/);
  assert.match(text, /1\/40/);
  assert.match(text, /Healer \(1\)/);
  assert.match(text, /Theron · Night Elf Druid — resto/);
  assert.match(text, /Tank \(0\)/);
});
