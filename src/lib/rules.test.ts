import assert from "node:assert/strict";
import test from "node:test";
import {
  classesFor,
  cleanCharacterName,
  cleanSignupCode,
  cleanTitle,
  comboError,
  formatNickname,
  formatRosterText,
  isClass,
  isRace,
  isVersion,
  nicknameKey,
  parseCap,
  racesFor,
} from "./rules";

test("nicknames allow spaces, collapse them, and reject junk", () => {
  assert.equal(formatNickname("  Rapid   life  raider "), "Rapid life raider");
  assert.equal(formatNickname("Riley"), "Riley");
  assert.equal(formatNickname("A"), null);
  assert.equal(formatNickname("x".repeat(33)), null);
  assert.equal(formatNickname("ok name"), "ok name");
  assert.equal(formatNickname("ab"), "ab");
  assert.equal(formatNickname("hi\nthere"), null);
  assert.equal(formatNickname("tab\there"), null);
  assert.equal(nicknameKey("Riley"), nicknameKey("riley"));
  assert.equal(cleanCharacterName(""), "");
  assert.equal(cleanCharacterName("  Theron  "), "Theron");
  assert.equal(cleanCharacterName("x".repeat(25)), null);
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
        nickname: "Riley",
        characterName: "Theron",
        race: "night_elf",
        className: "druid",
        role: "healer",
        note: "resto",
      },
    ],
  });
  assert.match(text, /\*\*Sunday\*\*/);
  assert.match(text, /WoW: Forever/);
  assert.match(text, /1\/40/);
  assert.match(text, /\*\*Healer \(1\)\*\*/);
  assert.match(text, /Riley \(Theron\) · Night Elf Druid · Healer — resto/);
  assert.match(text, /\*\*Tank \(0\)\*\*/);

  const nickOnly = formatRosterText({
    title: "Sunday",
    version: "forever",
    ruleset: "pve",
    faction: "horde",
    cap: 10,
    characters: [
      {
        nickname: "Rapid life raider",
        characterName: "",
        race: "orc",
        className: "hunter",
        role: "dps",
        note: "",
      },
    ],
  });
  assert.match(nickOnly, /Rapid life raider · Orc Hunter · DPS/);
  assert.doesNotMatch(nickOnly, /Rapid life raider \(/);
});
