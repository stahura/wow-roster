import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CopyButton } from "@/components/copy-button";
import { RosterList } from "@/components/roster-list";
import { Shell } from "@/components/shell";
import { SignupForm } from "@/components/signup-form";
import {
  assertRosterShape,
  getRoster,
  listCharacters,
  visibleCharacters,
} from "@/lib/mutate";
import {
  FACTION_LABEL,
  formatRosterText,
  RULESET_LABEL,
  VERSION_LABEL,
} from "@/lib/rules";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const roster = await getRoster(id);
  if (!roster) return { title: "Roster not found" };
  return {
    title: roster.title,
    robots: { index: false, follow: false },
  };
}

export default async function RosterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const roster = await getRoster(id);
  if (!roster) notFound();

  const shape = assertRosterShape(roster);
  const people = visibleCharacters(await listCharacters(roster.id));
  const full = people.length >= roster.cap;
  const factionClass = shape.faction === "alliance" ? "text-alliance" : "text-horde";
  const listText = formatRosterText({
    title: roster.title,
    version: shape.version,
    ruleset: shape.ruleset,
    faction: shape.faction,
    cap: roster.cap,
    characters: people,
  });

  return (
    <Shell>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className={`text-xs font-medium tracking-[0.16em] uppercase ${factionClass}`}>
            {FACTION_LABEL[shape.faction]}
          </p>
          <h1 className="mt-2 font-serif text-4xl text-ink">{roster.title}</h1>
          <p className="mt-2 text-sm text-muted">
            {VERSION_LABEL[shape.version]} · {RULESET_LABEL[shape.ruleset]} · {people.length}/
            {roster.cap}
          </p>
        </div>
        <CopyButton value={listText} label="Copy list" />
      </div>

      {roster.locked ? (
        <p className="mb-4 rounded-xl border border-line bg-panel px-4 py-3 text-sm text-muted">
          Signup is locked.
        </p>
      ) : null}
      {!roster.locked && full ? (
        <p className="mb-4 rounded-xl border border-line bg-panel px-4 py-3 text-sm text-muted">
          This roster is full.
        </p>
      ) : null}

      {!roster.locked && !full ? (
        <div className="mb-6">
          <SignupForm
            key={people.length}
            rosterId={roster.id}
            version={shape.version}
            faction={shape.faction}
            needsCode={roster.signupCode.length > 0}
          />
        </div>
      ) : null}

      <RosterList characters={people} />
    </Shell>
  );
}
