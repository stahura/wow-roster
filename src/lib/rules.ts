export const VERSIONS = ["forever"] as const;
export type Version = (typeof VERSIONS)[number];

export const RULESETS = ["pve", "pvp", "rp", "rppvp"] as const;
export type Ruleset = (typeof RULESETS)[number];

export const FACTIONS = ["alliance", "horde"] as const;
export type Faction = (typeof FACTIONS)[number];

export const ROLES = ["tank", "healer", "dps"] as const;
export type Role = (typeof ROLES)[number];

export const RACES = [
  "human",
  "dwarf",
  "night_elf",
  "gnome",
  "skyborne",
  "orc",
  "undead",
  "tauren",
  "troll",
] as const;
export type Race = (typeof RACES)[number];

export const CLASSES = [
  "warrior",
  "paladin",
  "hunter",
  "rogue",
  "priest",
  "shaman",
  "mage",
  "warlock",
  "druid",
] as const;
export type ClassId = (typeof CLASSES)[number];

export const MAX_CAP = 1000;
export const DEFAULT_CAP = 40;
export const TITLE_MAX = 60;
export const NOTE_MAX = 140;
export const SIGNUP_CODE_MIN = 4;
export const SIGNUP_CODE_MAX = 32;

export const VERSION_LABEL: Record<Version, string> = {
  forever: "WoW: Forever",
};

export const RULESET_LABEL: Record<Ruleset, string> = {
  pve: "PvE",
  pvp: "PvP",
  rp: "RP",
  rppvp: "RP-PvP",
};

export const FACTION_LABEL: Record<Faction, string> = {
  alliance: "Alliance",
  horde: "Horde",
};

export const ROLE_LABEL: Record<Role, string> = {
  tank: "Tank",
  healer: "Healer",
  dps: "DPS",
};

export const RACE_LABEL: Record<Race, string> = {
  human: "Human",
  dwarf: "Dwarf",
  night_elf: "Night Elf",
  gnome: "Gnome",
  skyborne: "Skyborne",
  orc: "Orc",
  undead: "Undead",
  tauren: "Tauren",
  troll: "Troll",
};

export const CLASS_LABEL: Record<ClassId, string> = {
  warrior: "Warrior",
  paladin: "Paladin",
  hunter: "Hunter",
  rogue: "Rogue",
  priest: "Priest",
  shaman: "Shaman",
  mage: "Mage",
  warlock: "Warlock",
  druid: "Druid",
};

export const CLASS_COLOR: Record<ClassId, string> = {
  warrior: "#C79C6E",
  paladin: "#F58CBA",
  hunter: "#ABD473",
  rogue: "#FFF569",
  priest: "#F4F4F4",
  shaman: "#0070DE",
  mage: "#69CCF0",
  warlock: "#9482C9",
  druid: "#FF7D0A",
};

/** Fixed race→faction. Skyborne picks faction at signup (Alliance or Horde). */
const FIXED_RACE_FACTION: Record<Exclude<Race, "skyborne">, Faction> = {
  human: "alliance",
  dwarf: "alliance",
  night_elf: "alliance",
  gnome: "alliance",
  orc: "horde",
  undead: "horde",
  tauren: "horde",
  troll: "horde",
};

const CLASS_ROLES: Record<ClassId, readonly Role[]> = {
  warrior: ["tank", "dps"],
  paladin: ["tank", "healer", "dps"],
  hunter: ["dps"],
  rogue: ["dps"],
  priest: ["healer", "dps"],
  shaman: ["healer", "dps"],
  mage: ["dps"],
  warlock: ["dps"],
  druid: ["tank", "healer", "dps"],
};

// Forever race/class matrix — Wowhead Forever / Icy Veins Forever (~Sep 2026).
// New vs Classic Era: Human Hunter, Dwarf Shaman, Gnome Priest, Orc Mage,
// Troll Warlock, Undead Paladin. Skyborne is faction-pickable (see below).
const FIXED_RACE_CLASSES: Record<Exclude<Race, "skyborne">, readonly ClassId[]> = {
  human: ["warrior", "hunter", "mage", "rogue", "priest", "warlock", "paladin"],
  dwarf: ["warrior", "hunter", "rogue", "priest", "paladin", "shaman"],
  night_elf: ["warrior", "hunter", "rogue", "priest", "druid"],
  gnome: ["warrior", "mage", "rogue", "priest", "warlock"],
  orc: ["warrior", "hunter", "mage", "rogue", "warlock", "shaman"],
  undead: ["warrior", "mage", "rogue", "priest", "warlock", "paladin"],
  tauren: ["warrior", "hunter", "druid", "shaman"],
  troll: ["warrior", "hunter", "mage", "rogue", "priest", "warlock", "shaman"],
};

/** Skyborne class sets by chosen faction (not a fixed race→faction mapping). */
const SKYBORNE_CLASSES: Record<Faction, readonly ClassId[]> = {
  alliance: ["warrior", "hunter", "mage", "rogue", "druid"],
  horde: ["warrior", "hunter", "rogue", "druid", "shaman"],
};

export function isVersion(value: string): value is Version {
  return (VERSIONS as readonly string[]).includes(value);
}

export function isRuleset(value: string): value is Ruleset {
  return (RULESETS as readonly string[]).includes(value);
}

export function isFaction(value: string): value is Faction {
  return (FACTIONS as readonly string[]).includes(value);
}

export function isRole(value: string): value is Role {
  return (ROLES as readonly string[]).includes(value);
}

export function isRace(value: string): value is Race {
  return (RACES as readonly string[]).includes(value);
}

export function isClass(value: string): value is ClassId {
  return (CLASSES as readonly string[]).includes(value);
}

export function raceMatchesFaction(race: Race, faction: Faction): boolean {
  if (race === "skyborne") return true;
  return FIXED_RACE_FACTION[race] === faction;
}

export function racesFor(_version: Version, faction: Faction): Race[] {
  return RACES.filter((race) => raceMatchesFaction(race, faction));
}

export function classesFor(_version: Version, faction: Faction, race: Race): ClassId[] {
  if (race === "skyborne") return [...SKYBORNE_CLASSES[faction]];
  return [...FIXED_RACE_CLASSES[race]];
}

export function rolesFor(classId: ClassId): readonly Role[] {
  return CLASS_ROLES[classId];
}

export function comboError(
  version: Version,
  faction: Faction,
  race: Race,
  classId: ClassId,
  role: Role,
): string | null {
  if (!raceMatchesFaction(race, faction)) {
    return `${RACE_LABEL[race]} is not ${FACTION_LABEL[faction]}.`;
  }
  if (!racesFor(version, faction).includes(race)) {
    return `${RACE_LABEL[race]} is not playable in ${VERSION_LABEL[version]}.`;
  }
  if (!classesFor(version, faction, race).includes(classId)) {
    return `${RACE_LABEL[race]} cannot be a ${CLASS_LABEL[classId]} in ${VERSION_LABEL[version]}.`;
  }
  if (!rolesFor(classId).includes(role)) {
    return `${CLASS_LABEL[classId]} cannot sign up as a ${ROLE_LABEL[role]}.`;
  }
  return null;
}

export function formatCharacterName(raw: string): string | null {
  const trimmed = raw.trim();
  if (!/^[A-Za-z]{2,12}$/.test(trimmed)) return null;
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}

export function cleanTitle(raw: string): string | null {
  const title = raw.trim().replace(/\s+/g, " ");
  if (title.length < 1 || title.length > TITLE_MAX) return null;
  if (/[\u0000-\u001F\u007F]/.test(title)) return null;
  return title;
}

export function cleanNote(raw: string): string | null {
  const note = raw.trim().replace(/\s+/g, " ");
  if (note.length > NOTE_MAX) return null;
  if (/[\u0000-\u001F\u007F]/.test(note)) return null;
  return note;
}

export function cleanSignupCode(raw: string): string | null {
  const code = raw.trim().replace(/\s+/g, " ");
  if (code.length === 0) return "";
  if (code.length < SIGNUP_CODE_MIN || code.length > SIGNUP_CODE_MAX) return null;
  if (!/^[A-Za-z0-9][A-Za-z0-9 ._-]*$/.test(code)) return null;
  return code;
}

export function parseCap(raw: string): number | null {
  const trimmed = raw.trim();
  if (!/^\d{1,4}$/.test(trimmed)) return null;
  const cap = Number(trimmed);
  if (!Number.isInteger(cap) || cap < 1 || cap > MAX_CAP) return null;
  return cap;
}

export type CharacterLine = {
  name: string;
  race: Race;
  className: ClassId;
  role: Role;
  note: string;
};

export function formatRosterText(input: {
  title: string;
  version: Version;
  ruleset: Ruleset;
  faction: Faction;
  cap: number;
  characters: CharacterLine[];
}): string {
  const header = [
    input.title,
    [
      VERSION_LABEL[input.version],
      RULESET_LABEL[input.ruleset],
      FACTION_LABEL[input.faction],
      `${input.characters.length}/${input.cap}`,
    ].join(" · "),
  ];

  const sections = ROLES.map((role) => {
    const people = input.characters
      .filter((character) => character.role === role)
      .slice()
      .sort((a, b) => {
        const byClass = CLASS_LABEL[a.className].localeCompare(CLASS_LABEL[b.className]);
        return byClass === 0 ? a.name.localeCompare(b.name) : byClass;
      });
    const lines = people.map((character) => {
      const detail = `${RACE_LABEL[character.race]} ${CLASS_LABEL[character.className]}`;
      const note = character.note ? ` — ${character.note}` : "";
      return `- ${character.name} · ${detail}${note}`;
    });
    return [`${ROLE_LABEL[role]} (${people.length})`, ...lines].join("\n");
  });

  return [...header, "", ...sections].join("\n");
}
