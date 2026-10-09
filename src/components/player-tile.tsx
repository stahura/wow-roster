import { removeCharacter } from "@/app/actions";
import { ClassBadge } from "@/components/wow-icon";
import { classTextColor } from "@/lib/icons";
import { CLASS_COLOR, CLASS_LABEL, RACE_LABEL, type CharacterLine } from "@/lib/rules";

/**
 * A roster tile, styled like a raid frame: class icon, nickname, class and
 * race, with a thin class-color bar along the bottom edge.
 */
export function PlayerTile({
  character,
  secret,
  highlight = false,
}: {
  character: CharacterLine & { id: string };
  secret?: string;
  highlight?: boolean;
}) {
  const color = CLASS_COLOR[character.className];
  const text = classTextColor(character.className);

  return (
    <li
      className={`relative flex min-w-0 gap-2.5 overflow-hidden rounded-[10px] border bg-tile px-2.5 pt-[9px] pb-[11px] sm:gap-3 sm:rounded-[11px] sm:px-3.5 sm:pt-[13px] sm:pb-[15px] ${
        highlight
          ? "animate-glow border-gold/70 shadow-[0_0_0_2px_rgb(224_177_90/0.6)]"
          : "border-[rgb(244_236_223/0.06)]"
      }`}
    >
      <ClassBadge classId={character.className} className="size-[30px] sm:size-10" decorative />
      <div className="flex min-w-0 flex-1 flex-col gap-[3px] sm:gap-[5px]">
        <p className="flex min-w-0 items-baseline gap-[7px]">
          <span className="truncate text-[13.5px] leading-[1.15] font-semibold text-ink sm:text-[15px]">
            {character.nickname}
          </span>
          {character.characterName && !highlight ? (
            <span className="hidden truncate text-[12.5px] leading-[1.15] text-faint sm:inline">
              {character.characterName}
            </span>
          ) : null}
          {highlight ? (
            <span className="ml-auto shrink-0 rounded-full bg-gold px-1.5 py-0.5 font-mono text-[9.5px] leading-none font-semibold tracking-[0.08em] text-[#1a1206]">
              YOU
            </span>
          ) : null}
        </p>
        <p className="truncate text-[11.5px] leading-[1.15] font-medium sm:text-[12.5px]" style={{ color: text }}>
          {CLASS_LABEL[character.className]}{" "}
          <span className="font-normal text-muted">· {RACE_LABEL[character.race]}</span>
        </p>
        {character.note ? (
          <p className="line-clamp-2 text-[12px] leading-[1.35] break-words text-muted italic sm:text-[12.5px]">
            “{character.note}”
          </p>
        ) : null}
        {secret ? (
          <form action={removeCharacter} className="mt-1">
            <input type="hidden" name="secret" value={secret} />
            <input type="hidden" name="characterId" value={character.id} />
            <button
              type="submit"
              className="rounded text-[12px] text-faint underline-offset-2 transition hover:text-danger hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              Remove<span className="sr-only"> {character.nickname}</span>
            </button>
          </form>
        ) : null}
      </div>
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[2px] opacity-85"
        style={{ background: color }}
      />
    </li>
  );
}
