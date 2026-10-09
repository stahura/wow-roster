import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyButton } from "@/components/copy-button";
import { JoinPanel } from "@/components/join-panel";
import { PlayerTile } from "@/components/player-tile";
import {
  EmptyRoster,
  RosterGroups,
  RosterHeader,
  RosterStats,
  TopBar,
} from "@/components/roster-view";
import { pillButtonClass, primaryButtonClass, sheetClass } from "@/components/ui";
import { requestOrigin } from "@/lib/http";
import { metadataBaseFromOrigin } from "@/lib/site-url";
import {
  assertRosterShape,
  getRoster,
  listCharacters,
  visibleCharacters,
} from "@/lib/mutate";
import { formatRosterText, rosterShareDescription, rosterSummary } from "@/lib/rules";

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
  const metadataBase = metadataBaseFromOrigin(origin);

  return {
    title: roster.title,
    description,
    ...(metadataBase ? { metadataBase } : {}),
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

export default async function RosterPage({ params, searchParams }: PageProps<"/r/[id]">) {
  const { id } = await params;
  const query = await searchParams;
  const roster = await getRoster(id);
  if (!roster) notFound();

  const shape = assertRosterShape(roster);
  const people = visibleCharacters(await listCharacters(roster.id));
  const summary = rosterSummary(people);
  const full = people.length >= roster.cap;
  const locked = Boolean(roster.locked);
  const joinedId = typeof query.joined === "string" ? query.joined : undefined;
  const joined = joinedId ? people.find((person) => person.id === joinedId) : undefined;
  const canJoin = !locked && !full && !joined;
  const origin = await requestOrigin();
  const publicUrl = origin ? `${origin}/r/${roster.id}` : `/r/${roster.id}`;
  const listText = formatRosterText({
    title: roster.title,
    version: shape.version,
    ruleset: shape.ruleset,
    faction: shape.faction,
    cap: roster.cap,
    characters: people,
  });

  const notice = joined ? (
    <JoinedCard player={joined} rosterId={roster.id} publicUrl={publicUrl} canAddMore={!locked && !full} />
  ) : locked ? (
    <StatusCard title="Signups are locked" body="The organizer closed this roster. The lineup below is final for now." />
  ) : full ? (
    <StatusCard
      title="Roster is full"
      body={`All ${roster.cap} spots are taken. Ask the organizer to raise the cap.`}
    />
  ) : null;

  return (
    <div className={`min-h-dvh ${shape.faction === "alliance" ? "lit-alliance" : "lit-horde"}`}>
      <TopBar>
        <CopyButton value={listText} label="Copy as text" />
        <CopyButton value={publicUrl} label="Copy link" />
      </TopBar>

      <main
        className={`mx-auto grid max-w-[1376px] items-start gap-x-12 gap-y-[22px] px-[18px] pt-[26px] lg:grid-cols-[minmax(0,1fr)_400px] lg:grid-rows-[auto_1fr] lg:gap-y-8 lg:px-12 lg:pt-11 lg:pb-14 ${
          canJoin ? "pb-32" : "pb-14"
        }`}
      >
        <RosterHeader
          title={roster.title}
          version={shape.version}
          ruleset={shape.ruleset}
          faction={shape.faction}
          count={people.length}
          cap={roster.cap}
        />
        {canJoin ? (
          <div className="contents lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:block lg:self-stretch">
            <JoinPanel
              rosterId={roster.id}
              version={shape.version}
              faction={shape.faction}
              needsCode={roster.signupCode.length > 0}
              spotsLeft={roster.cap - people.length}
            />
          </div>
        ) : notice ? (
          <aside className="lg:sticky lg:top-6 lg:col-start-2 lg:row-span-2 lg:row-start-1">{notice}</aside>
        ) : null}
        <div className="flex min-w-0 flex-col gap-[22px] lg:gap-8">
          <RosterStats roles={summary.roles} classes={summary.classes} />
          {people.length === 0 ? <EmptyRoster /> : <RosterGroups characters={people} highlightId={joined?.id} />}
        </div>
      </main>
    </div>
  );
}

function StatusCard({ title, body }: { title: string; body: string }) {
  return (
    <section className={`${sheetClass} flex flex-col gap-2 p-5 lg:p-[22px]`} role="status">
      <h2 className="font-serif text-[26px] leading-none text-ink lg:text-[30px]">{title}</h2>
      <p className="text-[14px] leading-6 text-muted">{body}</p>
    </section>
  );
}

function JoinedCard({
  player,
  rosterId,
  publicUrl,
  canAddMore,
}: {
  player: Parameters<typeof PlayerTile>[0]["character"];
  rosterId: string;
  publicUrl: string;
  canAddMore: boolean;
}) {
  return (
    <section
      className={`${sheetClass} animate-rise relative flex flex-col gap-4 overflow-hidden p-5 lg:p-[22px]`}
      role="status"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(320px_160px_at_0%_0%,rgb(224_177_90/0.16),transparent_70%)]"
      />
      <div className="relative flex flex-col gap-1.5">
        <span className="font-mono text-[11px] leading-none font-semibold tracking-[0.12em] text-gold">
          YOU&apos;RE IN
        </span>
        <h2 className="font-serif text-[30px] leading-none text-ink lg:text-[34px]">
          See you there, {player.nickname}.
        </h2>
      </div>
      <ul className="relative grid">
        <PlayerTile character={player} />
      </ul>
      <p className="relative text-[13.5px] leading-6 text-muted">
        Your card is highlighted on the roster. Send the link to whoever else is coming.
      </p>
      <div className="relative flex flex-col gap-2">
        <CopyButton
          value={publicUrl}
          label="Copy the signup link"
          copiedLabel="Link copied"
          className={`${primaryButtonClass} w-full`}
        />
        {canAddMore ? (
          <Link href={`/r/${rosterId}`} className={`${pillButtonClass} w-full`}>
            Sign up someone else
          </Link>
        ) : null}
      </div>
    </section>
  );
}
