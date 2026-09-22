import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const CARD_SURFACES = [
  "src/components/player-card.tsx",
  "src/components/roster-stage.tsx",
  "src/components/roster-list.tsx",
  "src/components/role-strip.tsx",
];

test("public stage and player cards have no class-color left rail", () => {
  for (const rel of CARD_SURFACES) {
    const src = readFileSync(path.join(process.cwd(), rel), "utf8");
    assert.doesNotMatch(src, /border-l(?:-\d+)?\b/, rel);
    assert.doesNotMatch(src, /borderLeft(?:Color|Width)/, rel);
    assert.doesNotMatch(src, /before:(?:absolute|inset-y|left-0|w-1|w-\[)/, rel);
    assert.doesNotMatch(src, /classColor\(/, rel);
  }
});
