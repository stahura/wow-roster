import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RosterStage } from "@/components/roster-stage";
import { SignupForm } from "@/components/signup-form";
import { StageShell } from "@/components/stage-shell";
import { requestOrigin } from "@/lib/http";
import {
  assertRosterShape,
  getRoster,
  listCharacters,
  visibleCharacters,
} from "@/lib/mutate";
import { formatRosterText, rosterShareDescription } from "@/lib/rules";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const roster = await getRoster(id);
  if (!roster) return { title: "Roster not found" };

  const shape = assertRosterShape(roster);
  const people = visibleCharacters(await listCharacters(roster.id));
  const description = rosterShareDescription({
    version: shape.version,
    ruleset: shape.ruleset,
    faction: shape.faction,
    count: people.length,
    cap: roster.cap,
  });
  const origin = await requestOrigin();
  const url = origin ? `${origin}/r/${roster.id}` : undefined;

  return {
    title: roster.title,
    description,
    robots: { index: false, follow: false },
    openGraph: {
      title: roster.title,
      description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: roster.title,
      description,
    },
  };
}

export default async function RosterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const roster = await getRoster(id);
  if (!roster) notFound();

  const shape = assertRosterShape(roster);
  const people = visibleCharacters(await listCharacters(roster.id));
  const full = people.length >= roster.cap;
  const listText = formatRosterText({
    title: roster.title,
    version: shape.version,
    ruleset: shape.ruleset,
    faction: shape.faction,
    cap: roster.cap,
    characters: people,
  });

  return (
    <StageShell faction={shape.faction}>
      <RosterStage
        title={roster.title}
        version={shape.version}
        ruleset={shape.ruleset}
        faction={shape.faction}
        cap={roster.cap}
        characters={people}
        listText={listText}
      />

      {roster.locked ? (
        <p className="mt-8 rounded-xl border border-line bg-panel/80 px-4 py-3 text-sm text-muted">
          Signup is locked.
        </p>
      ) : null}
      {!roster.locked && full ? (
        <p className="mt-8 rounded-xl border border-line bg-panel/80 px-4 py-3 text-sm text-muted">
          This roster is full.
        </p>
      ) : null}

      {!roster.locked && !full ? (
        <div className="mt-10">
          <h2 className="mb-3 font-serif text-2xl text-ink">Join the lineup</h2>
          <SignupForm
            key={people.length}
            rosterId={roster.id}
            version={shape.version}
            faction={shape.faction}
            needsCode={roster.signupCode.length > 0}
          />
        </div>
      ) : null}
    </StageShell>
  );
}
