import { ImageResponse } from "next/og";
import {
  assertRosterShape,
  getRoster,
  listCharacters,
  visibleCharacters,
} from "@/lib/mutate";
import {
  FACTION_LABEL,
  ROLES,
  ROLE_LABEL,
  rosterShareDescription,
} from "@/lib/rules";

export const runtime = "nodejs";
export const alt = "WoW: Forever roster";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const roster = await getRoster(id);
  if (!roster) {
    return new ImageResponse(
      <Card title="Roster not found" subtitle="WoW Roster" names={[]} accent="#e0b15a" />,
      { ...size },
    );
  }

  const shape = assertRosterShape(roster);
  const people = visibleCharacters(await listCharacters(roster.id));
  const accent = shape.faction === "alliance" ? "#79b0ea" : "#e36a5c";
  const names = people.slice(0, 12).map((person) => person.nickname);
  const subtitle = rosterShareDescription({
    version: shape.version,
    ruleset: shape.ruleset,
    faction: shape.faction,
    count: people.length,
    cap: roster.cap,
  });

  return new ImageResponse(
    <Card
      title={roster.title}
      subtitle={`${FACTION_LABEL[shape.faction]} · ${subtitle}`}
      names={names}
      more={Math.max(0, people.length - names.length)}
      accent={accent}
      roles={ROLES.map((role) => ({
        label: ROLE_LABEL[role],
        count: people.filter((person) => person.role === role).length,
      }))}
    />,
    { ...size },
  );
}

function Card({
  title,
  subtitle,
  names,
  more = 0,
  accent,
  roles = [],
}: {
  title: string;
  subtitle: string;
  names: string[];
  more?: number;
  accent: string;
  roles?: { label: string; count: number }[];
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 64,
        background: `radial-gradient(ellipse 80% 60% at 50% -10%, ${accent}55, transparent 55%), #14110e`,
        color: "#f4ecdf",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 4, color: accent, textTransform: "uppercase" }}>
          WoW Roster
        </div>
        <div style={{ display: "flex", fontSize: 64, fontWeight: 700, marginTop: 18, lineHeight: 1.1 }}>
          {title}
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#b6a892", marginTop: 16 }}>
          {subtitle}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {roles.length > 0 ? (
          <div style={{ display: "flex", gap: 28, fontSize: 24, color: "#f4ecdf" }}>
            {roles.map((role) => (
              <div key={role.label} style={{ display: "flex" }}>
                {role.label} {role.count}
              </div>
            ))}
          </div>
        ) : null}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {names.map((name) => (
            <div
              key={name}
              style={{
                display: "flex",
                border: "1px solid #3d342b",
                background: "#221c17",
                padding: "8px 14px",
                fontSize: 24,
              }}
            >
              {name}
            </div>
          ))}
          {more > 0 ? (
            <div style={{ display: "flex", color: "#b6a892", fontSize: 24, padding: "8px 6px" }}>
              +{more} more
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
