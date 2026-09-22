import { removeCharacter } from "@/app/actions";
import { ClassIcon, FactionCrest } from "@/components/wow-icon";
import { playerSecondaryLine, type CharacterLine, type Faction } from "@/lib/rules";

export function PlayerCard({
  character,
  faction,
  secret,
  featured = false,
}: {
  character: CharacterLine & { id: string };
  faction: Faction;
  secret?: string;
  featured?: boolean;
}) {
  return (
    <article
      className={
        featured
          ? "min-w-[220px] flex-1 rounded-xl border border-white/10 bg-black/35 px-4 py-3 backdrop-blur-sm"
          : "rounded-lg border border-line bg-paper px-3 py-2"
      }
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <FactionCrest faction={faction} size={featured ? 28 : 22} className="shrink-0" />
            <ClassIcon classId={character.className} size={featured ? 28 : 22} className="shrink-0" />
            <p className="truncate font-semibold text-ink">
              {character.nickname}
              {character.characterName ? (
                <span className="font-normal text-muted"> ({character.characterName})</span>
              ) : null}
            </p>
          </div>
          <p className="mt-1 text-sm text-muted">{playerSecondaryLine(character)}</p>
          {character.note ? (
            <p className="mt-1 text-sm break-words text-ink/70">{character.note}</p>
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
    </article>
  );
}
