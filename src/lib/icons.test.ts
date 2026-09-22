import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import {
  classIconSrc,
  factionIconSrc,
  raceIconSrc,
  roleIconSrc,
  SKYBORNE_HAS_OFFICIAL_ICON,
  WOW_ICON_DIR,
} from "./icons";
import { CLASSES, FACTIONS, RACES, ROLES } from "./rules";

function publicPath(src: string): string {
  return path.join(process.cwd(), "public", src.replace(/^\//, ""));
}

test("every Forever class, faction, and role has a vendored icon file", () => {
  for (const classId of CLASSES) {
    const src = classIconSrc(classId);
    assert.match(src, new RegExp(`^${WOW_ICON_DIR}/class_${classId}\\.jpg$`));
    assert.equal(existsSync(publicPath(src)), true, src);
  }

  for (const faction of FACTIONS) {
    const src = factionIconSrc(faction);
    assert.match(src, /ui_(alliance|horde)icon\.jpg$/);
    assert.equal(existsSync(publicPath(src)), true, src);
  }

  for (const role of ROLES) {
    const src = roleIconSrc(role);
    assert.equal(src, `${WOW_ICON_DIR}/role_${role}.png`);
    assert.equal(existsSync(publicPath(src)), true, src);
  }

  assert.equal(existsSync(publicPath(`${WOW_ICON_DIR}/ui-lfg-icon-roles.png`)), true);
});

test("classic races have Wowhead portraits; Skyborne has no invented crest", () => {
  assert.equal(SKYBORNE_HAS_OFFICIAL_ICON, false);
  assert.equal(raceIconSrc("skyborne"), null);

  for (const race of RACES) {
    if (race === "skyborne") continue;
    const src = raceIconSrc(race);
    assert.ok(src, race);
    assert.equal(existsSync(publicPath(src!)), true, src);
  }

  assert.equal(raceIconSrc("night_elf"), `${WOW_ICON_DIR}/race_nightelf_male.jpg`);
  assert.equal(raceIconSrc("undead"), `${WOW_ICON_DIR}/race_scourge_male.jpg`);
});

test("fabricated SVG crests are no longer the icon source", () => {
  assert.equal(existsSync(publicPath("/icons/alliance.svg")), false);
  assert.equal(existsSync(publicPath("/icons/horde.svg")), false);
  assert.equal(existsSync(publicPath("/icons/warrior.svg")), false);
});
