import { removeCharacter } from "@/app/actions";
import {
  CLASS_COLOR,
  CLASS_LABEL,
  RACE_LABEL,
  ROLES,
  ROLE_LABEL,
  type CharacterLine,
} from "@/lib/rules";

export function RosterList({
  characters,
  secret,
}: {
  characters: (CharacterLine & { id: string })[];
  secret?: string;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {ROLES.map((role) => {
        const people = characters
          .filter((character) => character.role === role)
          .slice()
          .sort((a, b) => {
            const byClass = CLASS_LABEL[a.className].localeCompare(CLASS_LABEL[b.className]);
            return byClass === 0 ? a.name.localeCompare(b.name) : byClass;
          });

        return (
          <section key={role} className="rounded-2xl border border-line bg-panel/70 p-4">
            <h2 className="font-serif text-lg text-ink">
              {ROLE_LABEL[role]}{" "}
              <span className="text-sm text-muted">{people.length}</span>
            </h2>
            {people.length === 0 ? (
              <p className="mt-3 text-sm text-muted">None yet.</p>
            ) : (
              <ul className="mt-3 grid gap-2">
                {people.map((character) => (
                  <li
                    key={character.id}
                    className="rounded-lg border border-line border-l-4 bg-paper px-3 py-2"
                    style={{ borderLeftColor: CLASS_COLOR[character.className] }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-medium text-ink">{character.name}</p>
                        <p className="text-sm text-muted">
                          {RACE_LABEL[character.race]} {CLASS_LABEL[character.className]}
                        </p>
                        {character.note ? (
                          <p className="mt-1 text-sm break-words text-ink/80">{character.note}</p>
                        ) : null}
                      </div>
                      {secret ? (
                        <form action={removeCharacter}>
                          <input type="hidden" name="secret" value={secret} />
                          <input type="hidden" name="characterId" value={character.id} />
                          <button
                            type="submit"
                            className="text-xs text-muted underline-offset-2 hover:text-danger hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                          >
                            Remove
                          </button>
                        </form>
                      ) : null}
                    </div>
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
