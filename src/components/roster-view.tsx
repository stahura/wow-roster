import type { ReactNode } from "react";
import Link from "next/link";
import { PlayerTile } from "@/components/player-tile";
import { cardClass } from "@/components/ui";
import { FactionSeal, RoleBadge } from "@/components/wow-icon";
import { classTextColor, FACTION_COLOR, ROLE_COLOR } from "@/lib/icons";
import {
  CLASS_COLOR,
  CLASS_LABEL,
  FACTION_LABEL,
  ROLES,
  RULESET_LABEL,
  sortByClassThenNickname,
  VERSION_LABEL,
  type CharacterLine,
  type ClassMix,
  type Faction,
  type Role,
  type Ruleset,
  type Version,
} from "@/lib/rules";

type Player = CharacterLine & { id: string };

const GROUP_LABEL: Record<Role, string> = { tank: "Tanks", healer: "Healers", dps: "DPS" };
const EMPTY_LABEL: Record<Role, string> = {
  tank: "No tanks yet",
  healer: "No healers yet",
  dps: "No DPS yet",
};

/** Top bar shared by roster pages: wordmark on the left, actions on the right. */
export function TopBar({ children }: { children?: ReactNode }) {
  return (
    <header className="flex items-center justify-between gap-3 border-b border-[rgb(244_236_223/0.06)] px-[18px] py-4 lg:px-12 lg:py-[22px]">
      <Link
        href="/"
        className="rounded text-[13px] font-semibold text-muted transition hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold lg:text-[14px]"
      >
        WoW Roster
      </Link>
      {children ? <div className="flex items-center gap-2">{children}</div> : null}
    </header>
  );
}

export function RosterHeader({
  title,
  version,
  ruleset,
  faction,
  count,
  cap,
  badge,
}: {
  title: string;
  version: Version;
  ruleset: Ruleset;
  faction: Faction;
  count: number;
  cap: number;
  badge?: ReactNode;
}) {
  const pct = Math.min(100, (count / Math.max(cap, 1)) * 100);
  const full = count >= cap;

  return (
    <div className="flex flex-col gap-[18px] lg:flex-row lg:items-end lg:justify-between lg:gap-8">
      <div className="flex min-w-0 flex-col gap-3.5 lg:gap-4">
        <div className="flex items-center gap-3">
          <FactionSeal faction={faction} className="size-11 lg:size-12" decorative />
          <div className="flex flex-col gap-[5px]">
            <span
              className="font-mono text-[11px] leading-none font-semibold tracking-[0.12em] uppercase lg:text-[11.5px]"
              style={{ color: FACTION_COLOR[faction] }}
            >
              {FACTION_LABEL[faction]}
            </span>
            <span className="text-[12.5px] leading-none text-muted lg:text-[13px]">
              {VERSION_LABEL[version]} · {RULESET_LABEL[ruleset]}
            </span>
          </div>
          {badge}
        </div>
        <h1 className="font-serif text-[38px] leading-[1.02] tracking-[-0.01em] break-words text-ink lg:text-[64px] lg:leading-none lg:tracking-[-0.015em]">
          {title}
        </h1>
      </div>
      <div className="flex w-full shrink-0 flex-col gap-2 lg:w-[220px] lg:pb-1.5">
        <div className="flex justify-between font-mono text-[12px] leading-none font-medium text-muted lg:text-[12.5px]">
          <span>
            <span className="text-ink">{count}</span> {count === 1 ? "friend" : "friends"}
          </span>
          <span>{full ? "Full" : `cap ${cap}`}</span>
        </div>
        <div
          className="h-1 overflow-hidden rounded-sm bg-[rgb(244_236_223/0.08)]"
          role="progressbar"
          aria-label="Spots filled"
          aria-valuemin={0}
          aria-valuemax={cap}
          aria-valuenow={count}
        >
          <div className="h-full rounded-sm bg-gold" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}

function ClassBar({ classes }: { classes: ClassMix }) {
  if (classes.length === 0) {
    return <div className="h-1.5 rounded-[3px] bg-[rgb(244_236_223/0.08)]" />;
  }
  return (
    <div className="flex h-1.5 gap-0.5 overflow-hidden rounded-[3px]" aria-hidden="true">
      {classes.map(({ classId, count }) => (
        <div key={classId} style={{ flex: count, background: CLASS_COLOR[classId] }} />
      ))}
    </div>
  );
}

function ClassLegend({ classes }: { classes: ClassMix }) {
  if (classes.length === 0) {
    return <p className="text-[12px] leading-none text-faint">No classes yet</p>;
  }
  return (
    <ul className="flex flex-wrap gap-x-3 gap-y-1.5" aria-label="Class mix">
      {classes.map(({ classId, count }) => (
        <li
          key={classId}
          className="text-[11.5px] leading-none font-medium lg:text-[12px]"
          style={{ color: classTextColor(classId) }}
        >
          {CLASS_LABEL[classId]} <span className="font-mono text-faint">{count}</span>
        </li>
      ))}
    </ul>
  );
}

/** Role tiles plus "what are we all playing?" as a class-mix bar. */
export function RosterStats({
  roles,
  classes,
}: {
  roles: Record<Role, number>;
  classes: ClassMix;
}) {
  return (
    <section aria-label="Role summary" className="grid gap-2 lg:grid-cols-[repeat(3,minmax(0,1fr))_minmax(0,2fr)]">
      <div className="grid grid-cols-3 gap-1.5 lg:contents">
        {ROLES.map((role) => (
          <div
            key={role}
            className={`${cardClass} flex items-center gap-2.5 rounded-[12px] px-3 py-2.5 lg:gap-3 lg:rounded-[14px] lg:p-4`}
          >
            <RoleBadge role={role} className="size-[26px] lg:size-[34px]" decorative />
            <div className="flex flex-col gap-[3px] lg:gap-1">
              <span className="text-[19px] leading-none font-semibold tabular-nums lg:text-[24px]">
                {roles[role]}
              </span>
              <span className="text-[11.5px] leading-none text-muted lg:text-[12.5px]">
                {GROUP_LABEL[role]}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className={`${cardClass} flex flex-col justify-center gap-2.5 rounded-[12px] px-3 py-3 lg:rounded-[14px] lg:p-4`}>
        <ClassBar classes={classes} />
        <ClassLegend classes={classes} />
      </div>
    </section>
  );
}

export function RosterGroups({
  characters,
  secret,
  highlightId,
}: {
  characters: Player[];
  secret?: string;
  highlightId?: string;
}) {
  return (
    <div className="flex flex-col gap-[22px] lg:gap-8">
      {ROLES.map((role) => {
        const people = characters
          .filter((character) => character.role === role)
          .slice()
          .sort(sortByClassThenNickname);

        return (
          <section key={role} aria-labelledby={`group-${role}`} className="flex flex-col gap-2 lg:gap-2.5">
            <div className="flex items-center gap-2 lg:gap-2.5">
              <RoleBadge role={role} className="size-[22px]" decorative />
              <h2
                id={`group-${role}`}
                className="text-[14px] leading-none font-semibold text-ink lg:font-serif lg:text-[24px] lg:font-normal"
              >
                {GROUP_LABEL[role]}
              </h2>
              <span className="font-mono text-[12px] leading-none font-medium text-faint lg:text-[12.5px]">
                {people.length}
              </span>
              <span
                aria-hidden="true"
                className="h-px flex-1"
                style={{
                  background: `linear-gradient(90deg, color-mix(in oklab, ${ROLE_COLOR[role]} 45%, transparent), rgb(244 236 223 / 0.06) 40%)`,
                }}
              />
            </div>
            {people.length === 0 ? (
              <p className="rounded-[10px] border border-dashed border-[rgb(244_236_223/0.1)] px-3.5 py-3 text-[12.5px] text-faint">
                {EMPTY_LABEL[role]}
              </p>
            ) : (
              <ul className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:gap-2">
                {people.map((character) => (
                  <PlayerTile
                    key={character.id}
                    character={character}
                    secret={secret}
                    highlight={character.id === highlightId}
                  />
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}

/** First-visitor state: nobody has signed up yet. */
export function EmptyRoster({
  title = "Nobody here yet.",
  body = "Be the first name on the lineup. It takes about 20 seconds.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="relative overflow-hidden rounded-[18px] border border-dashed border-[rgb(244_236_223/0.14)] px-5 py-9 text-center lg:py-14">
      <div className="mx-auto mb-5 flex w-fit -space-x-2" aria-hidden="true">
        {ROLES.map((role) => (
          <span key={role} className="rounded-full bg-paper p-0.5 opacity-80">
            <RoleBadge role={role} className="size-9" decorative />
          </span>
        ))}
      </div>
      <h2 className="font-serif text-[30px] leading-none text-ink lg:text-[36px]">{title}</h2>
      <p className="mx-auto mt-3 max-w-xs text-[14px] leading-6 text-muted">
        {body}
      </p>
    </section>
  );
}
