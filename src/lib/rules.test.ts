import assert from "node:assert/strict";
import test from "node:test";
import {
  cleanSignupCode,
  cleanTitle,
  comboError,
  formatCharacterName,
  formatRosterText,
  parseCap,
} from "./rules";

test("character names are letters and title case", () => {
  assert.equal(formatCharacterName(" thrall "), "Thrall");
  assert.equal(formatCharacterName("A"), null);
  assert.equal(formatCharacterName("Name With Space"), null);
  assert.equal(formatCharacterName("Abcdefghijklm"), null);
});

test("classic horde cannot be a paladin and wrath can be a death knight", () => {
  assert.match(
    comboError("classic", "horde", "blood_elf", "paladin", "healer") ?? "",
    /not playable/,
  );
  assert.equal(comboError("tbc", "horde", "blood_elf", "paladin", "healer"), null);
  assert.match(
    comboError("tbc", "horde", "blood_elf", "warrior", "tank") ?? "",
    /cannot be a Warrior/,
  );
  assert.equal(comboError("wrath", "alliance", "human", "death_knight", "tank"), null);
  assert.match(
    comboError("classic", "alliance", "human", "death_knight", "tank") ?? "",
    /cannot be a Death Knight/,
  );
  assert.equal(comboError("tbc", "alliance", "draenei", "shaman", "healer"), null);
  assert.match(comboError("classic", "alliance", "draenei", "shaman", "healer") ?? "", /not playable/);
  assert.match(comboError("classic", "horde", "human", "warrior", "tank") ?? "", /not Horde/);
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
    version: "classic",
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
  assert.match(text, /1\/40/);
  assert.match(text, /Healer \(1\)/);
  assert.match(text, /Theron · Night Elf Druid — resto/);
  assert.match(text, /Tank \(0\)/);
});
