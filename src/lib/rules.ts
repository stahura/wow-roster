export const VERSIONS = ["classic", "tbc", "wrath"] as const;
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
  "draenei",
  "orc",
  "undead",
  "tauren",
  "troll",
  "blood_elf",
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
  "death_knight",
] as const;
export type ClassId = (typeof CLASSES)[number];

export const MAX_CAP = 1000;
export const DEFAULT_CAP = 40;
export const TITLE_MAX = 60;
export const NOTE_MAX = 140;
export const SIGNUP_CODE_MIN = 4;
export const SIGNUP_CODE_MAX = 32;

const VERSION_RANK: Record<Version, number> = {
  classic: 0,
  tbc: 1,
  wrath: 2,
};

export const VERSION_LABEL: Record<Version, string> = {
  classic: "Classic Era",
  tbc: "The Burning Crusade",
  wrath: "Wrath of the Lich King",
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
  draenei: "Draenei",
  orc: "Orc",
  undead: "Undead",
  tauren: "Tauren",
  troll: "Troll",
  blood_elf: "Blood Elf",
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
  death_knight: "Death Knight",
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
  death_knight: "#C41F3B",
};

const RACE_FACTION: Record<Race, Faction> = {
  human: "alliance",
  dwarf: "alliance",
  night_elf: "alliance",
  gnome: "alliance",
  draenei: "alliance",
  orc: "horde",
  undead: "horde",
  tauren: "horde",
  troll: "horde",
  blood_elf: "horde",
};

const RACE_SINCE: Record<Race, Version> = {
  human: "classic",
  dwarf: "classic",
  night_elf: "classic",
  gnome: "classic",
  draenei: "tbc",
  orc: "classic",
  undead: "classic",
  tauren: "classic",
  troll: "classic",
  blood_elf: "tbc",
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
  death_knight: ["tank", "dps"],
};

/** Race/class pairs legal from Classic through Wrath. Cataclysm combos are intentionally absent. */
const CLASS_RACES: Record<Exclude<ClassId, "death_knight">, readonly Race[]> = {
  warrior: [
    "human",
    "dwarf",
    "night_elf",
    "gnome",
    "draenei",
    "orc",
    "undead",
    "tauren",
    "troll",
  ],
  paladin: ["human", "dwarf", "draenei", "blood_elf"],
  hunter: [
    "dwarf",
    "night_elf",
    "draenei",
    "orc",
    "tauren",
    "troll",
    "blood_elf",
  ],
  rogue: [
    "human",
    "dwarf",
    "night_elf",
    "gnome",
    "orc",
    "undead",
    "troll",
    "blood_elf",
  ],
  priest: [
    "human",
    "dwarf",
    "night_elf",
    "draenei",
    "undead",
    "troll",
    "blood_elf",
  ],
  shaman: ["draenei", "orc", "tauren", "troll"],
  mage: ["human", "gnome", "draenei", "undead", "troll", "blood_elf"],
  warlock: ["human", "gnome", "orc", "undead", "blood_elf"],
  druid: ["night_elf", "tauren"],
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

export function racesFor(version: Version, faction: Faction): Race[] {
  return RACES.filter(
    (race) =>
      RACE_FACTION[race] === faction &&
      VERSION_RANK[RACE_SINCE[race]] <= VERSION_RANK[version],
  );
}

export function classesFor(version: Version, race: Race): ClassId[] {
  const available: ClassId[] = [];
  for (const classId of CLASSES) {
    if (classId === "death_knight") {
      if (version === "wrath") available.push(classId);
      continue;
    }
    if (CLASS_RACES[classId].includes(race)) available.push(classId);
  }
  return available;
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
  if (RACE_FACTION[race] !== faction) {
    return `${RACE_LABEL[race]} is not ${FACTION_LABEL[faction]}.`;
  }
  if (!racesFor(version, faction).includes(race)) {
    return `${RACE_LABEL[race]} is not playable in ${VERSION_LABEL[version]}.`;
  }
  if (!classesFor(version, race).includes(classId)) {
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
