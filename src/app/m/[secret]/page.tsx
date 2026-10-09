import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ManagePanel } from "@/components/manage-panel";
import { RememberManageLink } from "@/components/saved-rosters";
import { EmptyRoster, RosterGroups, RosterHeader, RosterStats, TopBar } from "@/components/roster-view";
import { pillButtonClass } from "@/components/ui";
import { requestOrigin } from "@/lib/http";
import {
  assertRosterShape,
  getRosterBySecret,
  listCharacters,
  visibleCharacters,
} from "@/lib/mutate";
import { formatRosterText, rosterSummary } from "@/lib/rules";

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
  const summary = rosterSummary(people);
  const locked = Boolean(roster.locked);
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
    <div className={`min-h-dvh ${shape.faction === "alliance" ? "lit-alliance" : "lit-horde"}`}>
      <RememberManageLink id={roster.id} title={roster.title} href={`/m/${secret}`} />
      <TopBar>
        <Link href={`/r/${roster.id}`} className={pillButtonClass}>
          View public page
        </Link>
      </TopBar>
      <main className="mx-auto grid max-w-[1376px] items-start gap-x-12 gap-y-[22px] px-[18px] pt-[26px] pb-16 lg:grid-cols-[minmax(0,1fr)_400px] lg:grid-rows-[auto_1fr] lg:gap-y-8 lg:px-12 lg:pt-11">
        <RosterHeader
          title={roster.title}
          version={shape.version}
          ruleset={shape.ruleset}
          faction={shape.faction}
          count={people.length}
          cap={roster.cap}
          badge={
            <span className="ml-auto rounded-full border border-[rgb(244_236_223/0.12)] px-2.5 py-1 font-mono text-[10.5px] leading-none font-semibold tracking-[0.08em] text-muted lg:ml-2">
              {locked ? "LOCKED" : "ORGANIZER"}
            </span>
          }
        />
        <aside className="lg:sticky lg:top-6 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <ManagePanel
            secret={secret}
            publicUrl={publicUrl}
            manageUrl={manageUrl}
            cap={roster.cap}
            count={people.length}
            locked={locked}
            signupCode={roster.signupCode}
            listText={listText}
          />
        </aside>
        <div className="flex min-w-0 flex-col gap-[22px] lg:gap-8">
          <RosterStats roles={summary.roles} classes={summary.classes} />
          {people.length === 0 ? (
            <EmptyRoster
              title="No signups yet."
              body="Copy the signup link and drop it in your Discord. Names show up here as people join."
            />
          ) : (
            <RosterGroups characters={people} secret={secret} />
          )}
        </div>
      </main>
    </div>
  );
}
