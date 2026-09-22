import { PlayerCard } from "@/components/player-card";
import { RoleIcon } from "@/components/wow-icon";
import {
  ROLES,
  ROLE_LABEL,
  sortByClassThenNickname,
  type CharacterLine,
  type Faction,
} from "@/lib/rules";

export function RosterList({
  characters,
  faction,
  secret,
}: {
  characters: (CharacterLine & { id: string })[];
  faction: Faction;
  secret?: string;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {ROLES.map((role) => {
        const people = characters
          .filter((character) => character.role === role)
          .slice()
          .sort(sortByClassThenNickname);

        return (
          <section key={role} className="rounded-2xl border border-line bg-panel/70 p-4">
            <h2 className="flex items-center gap-2 font-serif text-lg text-ink">
              <RoleIcon role={role} size={28} />
              {ROLE_LABEL[role]}{" "}
              <span className="text-sm text-muted">{people.length}</span>
            </h2>
            {people.length === 0 ? (
              <p className="mt-3 text-sm text-muted">None yet.</p>
            ) : (
              <ul className="mt-3 grid gap-2">
                {people.map((character) => (
                  <li key={character.id}>
                    <PlayerCard character={character} faction={faction} secret={secret} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
