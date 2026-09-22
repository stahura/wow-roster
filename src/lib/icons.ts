import {
  CLASS_COLOR,
  type ClassId,
  type Faction,
  type Race,
  type Role,
} from "@/lib/rules";

export const WOW_ICON_DIR = "/icons/wow";

/** Alliance blue / Horde red — matches the stage CSS tokens. */
export const FACTION_COLOR: Record<Faction, string> = {
  alliance: "#79b0ea",
  horde: "#e36a5c",
};

/** Classic LFG role colors (shield blue / plus green / sword red). */
export const ROLE_COLOR: Record<Role, string> = {
  tank: "#5b9cf5",
  healer: "#4fd44f",
  dps: "#e36a5c",
};

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

const RACE_ICON_FILE: Record<Exclude<Race, "skyborne">, string> = {
  human: "race_human_male.jpg",
  dwarf: "race_dwarf_male.jpg",
  night_elf: "race_nightelf_male.jpg",
  gnome: "race_gnome_male.jpg",
  orc: "race_orc_male.jpg",
  undead: "race_scourge_male.jpg",
  tauren: "race_tauren_male.jpg",
  troll: "race_troll_male.jpg",
};

/** Skyborne has no official Blizzard icon. Never invent a crest. */
export const SKYBORNE_HAS_OFFICIAL_ICON = false;

export function classIconSrc(classId: ClassId): string {
  return `${WOW_ICON_DIR}/class_${classId}.jpg`;
}

export function classColor(classId: ClassId): string {
  return CLASS_COLOR[classId];
}

export function factionIconSrc(faction: Faction): string {
  return faction === "alliance"
    ? `${WOW_ICON_DIR}/ui_allianceicon.jpg`
    : `${WOW_ICON_DIR}/ui_hordeicon.jpg`;
}

export function roleIconSrc(role: Role): string {
  return `${WOW_ICON_DIR}/role_${role}.png`;
}

export function raceIconSrc(race: Race): string | null {
  if (race === "skyborne") return null;
  return `${WOW_ICON_DIR}/${RACE_ICON_FILE[race]}`;
}

export function raceColor(race: Race): string {
  if (race === "skyborne") return "#e0b15a";
  return FACTION_COLOR[FIXED_RACE_FACTION[race]];
}
