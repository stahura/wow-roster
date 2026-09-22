import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ManagePanel } from "@/components/manage-panel";
import { RememberManageLink } from "@/components/saved-rosters";
import { RosterList } from "@/components/roster-list";
import { Shell } from "@/components/shell";
import { FactionCrest } from "@/components/wow-icon";
import { requestOrigin } from "@/lib/http";
import { FACTION_COLOR } from "@/lib/icons";
import {
  assertRosterShape,
  getRosterBySecret,
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

export const metadata: Metadata = {
  title: "Organize roster",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function ManagePage({
  params,
}: {
  params: Promise<{ secret: string }>;
}) {
  const { secret } = await params;
  const roster = await getRosterBySecret(secret);
  if (!roster) notFound();

  const shape = assertRosterShape(roster);
  const people = visibleCharacters(await listCharacters(roster.id));
  const origin = await requestOrigin();
  const publicUrl = `${origin}/r/${roster.id}`;
  const manageUrl = `${origin}/m/${secret}`;
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
      <RememberManageLink id={roster.id} title={roster.title} href={`/m/${secret}`} />
      <div className="mb-6">
        <p
          className="flex items-center gap-2 text-xs font-medium tracking-[0.16em] uppercase"
          style={{ color: FACTION_COLOR[shape.faction] }}
        >
          <FactionCrest faction={shape.faction} size={22} />
          {FACTION_LABEL[shape.faction]} · {VERSION_LABEL[shape.version]} ·{" "}
          {RULESET_LABEL[shape.ruleset]}
        </p>
        <h1 className="mt-2 font-serif text-4xl text-ink">{roster.title}</h1>
        <p className="mt-2 text-sm text-muted">
          {people.length}/{roster.cap}
          {roster.locked ? " · signup locked" : ""}
        </p>
      </div>
      <ManagePanel
        secret={secret}
        publicUrl={publicUrl}
        manageUrl={manageUrl}
        cap={roster.cap}
        count={people.length}
        locked={Boolean(roster.locked)}
        signupCode={roster.signupCode}
        listText={listText}
      >
        <RosterList characters={people} faction={shape.faction} secret={secret} />
      </ManagePanel>
    </Shell>
  );
}
