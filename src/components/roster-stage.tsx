import { CopyButton } from "@/components/copy-button";
import { PlayerCard } from "@/components/player-card";
import { FactionCrest } from "@/components/wow-icon";
import {
  FACTION_LABEL,
  ROLE_LABEL,
  ROLES,
  rosterShareDescription,
  sortByClassThenNickname,
  type CharacterLine,
  type Faction,
  type Ruleset,
  type Version,
} from "@/lib/rules";

export function RosterStage({
  title,
  version,
  ruleset,
  faction,
  cap,
  characters,
  listText,
}: {
  title: string;
  version: Version;
  ruleset: Ruleset;
  faction: Faction;
  cap: number;
  characters: (CharacterLine & { id: string })[];
  listText: string;
}) {
  const factionClass = faction === "alliance" ? "text-alliance" : "text-horde";

  return (
    <div>
      <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-4">
          <FactionCrest faction={faction} size={64} className="mt-1 shrink-0 drop-shadow-lg" />
          <div>
            <p className={`text-xs font-medium tracking-[0.2em] uppercase ${factionClass}`}>
              {FACTION_LABEL[faction]}
            </p>
            <h1 className="mt-2 font-serif text-4xl leading-tight text-ink sm:text-5xl">{title}</h1>
            <p className="mt-2 text-sm text-muted">
              {rosterShareDescription({
                version,
                ruleset,
                faction,
                count: characters.length,
                cap,
              })}
            </p>
          </div>
        </div>
        <CopyButton value={listText} label="Copy markdown" />
      </div>

      <div className="grid gap-8">
        {ROLES.map((role) => {
          const people = characters
            .filter((character) => character.role === role)
            .slice()
            .sort(sortByClassThenNickname);

          return (
            <section key={role}>
              <div className="mb-3 flex items-center gap-3">
                <h2 className="font-serif text-2xl tracking-wide text-ink">{ROLE_LABEL[role]}</h2>
                <span className="text-sm text-muted">{people.length}</span>
                <div className="h-px flex-1 bg-gradient-to-r from-gold/50 to-transparent" />
              </div>
              {people.length === 0 ? (
                <p className="text-sm text-muted">No one on stage yet.</p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {people.map((character) => (
                    <PlayerCard key={character.id} character={character} faction={faction} featured />
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
