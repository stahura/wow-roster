import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { classTextColor } from "@/lib/icons";
import {
  assertRosterShape,
  getRoster,
  listCharacters,
  visibleCharacters,
} from "@/lib/mutate";
import {
  CLASS_COLOR,
  FACTION_LABEL,
  ROLES,
  RULESET_LABEL,
  rosterSummary,
  VERSION_LABEL,
  type ClassId,
  type Faction,
  type Role,
} from "@/lib/rules";

export const runtime = "nodejs";
export const alt = "WoW: Forever roster";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";

const INK = "#f4ecdf";
const MUTED = "#b6a892";
const FACTION_ACCENT: Record<Faction, string> = { alliance: "#79b0ea", horde: "#e36a5c" };
const GROUP_LABEL: Record<Role, string> = { tank: "Tanks", healer: "Healers", dps: "DPS" };

const cwd = process.cwd();
const fontFile = (name: string) => readFile(join(cwd, "assets/fonts", name));
const iconFile = async (name: string, mime: string) =>
  `data:${mime};base64,${(await readFile(join(cwd, "public/icons/wow", name))).toString("base64")}`;

async function loadFonts() {
  const [serif, sans, sansBold, mono] = await Promise.all([
    fontFile("InstrumentSerif-Regular.ttf"),
    fontFile("Geist-Medium.ttf"),
    fontFile("Geist-SemiBold.ttf"),
    fontFile("GeistMono-SemiBold.ttf"),
  ]);
  return [
    { name: "Instrument Serif", data: serif, weight: 400 as const, style: "normal" as const },
    { name: "Geist", data: sans, weight: 500 as const, style: "normal" as const },
    { name: "Geist", data: sansBold, weight: 600 as const, style: "normal" as const },
    { name: "Geist Mono", data: mono, weight: 600 as const, style: "normal" as const },
  ];
}

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [fonts, roster] = await Promise.all([loadFonts(), getRoster(id)]);

  if (!roster) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: 72,
            background: "#100e0c",
            color: INK,
            fontFamily: "Geist",
          }}
        >
          <div style={{ display: "flex", fontSize: 24, fontWeight: 600, color: MUTED }}>WoW Roster</div>
          <div style={{ display: "flex", fontFamily: "Instrument Serif", fontSize: 104, marginTop: 18 }}>
            That sheet is gone.
          </div>
        </div>
      ),
      { ...size, fonts },
    );
  }

  const shape = assertRosterShape(roster);
  const people = visibleCharacters(await listCharacters(roster.id));
  const summary = rosterSummary(people);
  const accent = FACTION_ACCENT[shape.faction];
  const crest = await iconFile(shape.faction === "alliance" ? "ui_allianceicon.jpg" : "ui_hordeicon.jpg", "image/jpeg");
  const roleIcons = Object.fromEntries(
    await Promise.all(ROLES.map(async (role) => [role, await iconFile(`role_${role}.png`, "image/png")])),
  ) as Record<Role, string>;
  const shownClasses = summary.classes.slice(0, 6);
  const classIcons = Object.fromEntries(
    await Promise.all(
      shownClasses.map(async ({ classId }) => [classId, await iconFile(`class_${classId}.jpg`, "image/jpeg")]),
    ),
  ) as Record<ClassId, string>;
  const count = people.length;
  const titleSize = roster.title.length > 34 ? 72 : roster.title.length > 22 ? 88 : 104;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: shape.faction === "alliance" ? "#100e0c" : "#100c0b",
          color: INK,
          fontFamily: "Geist",
        }}
      >
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 6, display: "flex", background: accent }} />
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 72px 56px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 36,
                  overflow: "hidden",
                  display: "flex",
                  border: `2px solid ${accent}`,
                }}
              >
                <img src={crest} width={76} height={76} alt="" style={{ margin: -2 }} />
              </div>
              <div
                style={{
                  display: "flex",
                  fontFamily: "Geist Mono",
                  fontWeight: 600,
                  fontSize: 22,
                  letterSpacing: 3,
                  color: accent,
                }}
              >
                {`${FACTION_LABEL[shape.faction]} · ${RULESET_LABEL[shape.ruleset]}`.toUpperCase()}
              </div>
            </div>
            <div style={{ display: "flex", fontSize: 24, fontWeight: 600, color: MUTED }}>WoW Roster</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div
              style={{
                display: "flex",
                fontFamily: "Instrument Serif",
                fontSize: titleSize,
                lineHeight: 0.95,
                letterSpacing: -1.5,
              }}
            >
              {roster.title}
            </div>
            <div style={{ display: "flex", fontSize: 30, color: MUTED }}>
              <span style={{ color: INK, fontWeight: 600, marginRight: 10 }}>
                {count === 0 ? "Be the first" : `${count} ${count === 1 ? "friend" : "friends"}`}
              </span>
              {count === 0 ? `to join · ${VERSION_LABEL[shape.version]}` : `playing ${VERSION_LABEL[shape.version]}`}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", gap: 40 }}>
            <div style={{ display: "flex", gap: 28 }}>
              {ROLES.map((role) => (
                <div key={role} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <img src={roleIcons[role]} width={56} height={56} alt="" />
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ display: "flex", fontSize: 40, fontWeight: 600, lineHeight: 1 }}>
                      {summary.roles[role]}
                    </div>
                    <div style={{ display: "flex", fontSize: 18, color: MUTED, lineHeight: 1 }}>{GROUP_LABEL[role]}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", height: 14, borderRadius: 7, overflow: "hidden", gap: 3 }}>
                {summary.classes.length === 0 ? (
                  <div style={{ flex: 1, display: "flex", background: "rgba(244,236,223,0.08)" }} />
                ) : (
                  summary.classes.map(({ classId, count: n }) => (
                    <div key={classId} style={{ flex: n, display: "flex", background: CLASS_COLOR[classId] }} />
                  ))
                )}
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                {shownClasses.map(({ classId, count: n }) => (
                  <div
                    key={classId}
                    style={{
                      height: 40,
                      padding: "0 10px 0 4px",
                      borderRadius: 9,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      background: "#1b1713",
                      border: `1.5px solid ${CLASS_COLOR[classId]}99`,
                      fontFamily: "Geist Mono",
                      fontWeight: 600,
                      fontSize: 17,
                      color: classTextColor(classId),
                    }}
                  >
                    <img src={classIcons[classId]} width={30} height={30} alt="" style={{ borderRadius: 6 }} />
                    {n}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
