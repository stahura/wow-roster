import {
  classIconSrc,
  factionIconSrc,
  raceIconSrc,
  roleIconSrc,
} from "@/lib/icons";
import { CLASS_COLOR, CLASS_LABEL, FACTION_LABEL, RACE_LABEL, ROLE_LABEL } from "@/lib/rules";
import type { ClassId, Faction, Race, Role } from "@/lib/rules";

export function WowIcon({
  src,
  alt,
  size,
  className,
}: {
  src: string;
  alt: string;
  size: number;
  className?: string;
}) {
  return (
    // Vendored Blizzard UI icons. Riley requires a real <img>, not CSS or next/image stand-ins.
    // eslint-disable-next-line @next/next/no-img-element -- fan-use WoW icons must render as raw files
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      draggable={false}
      className={["inline-block shrink-0 object-contain", className].filter(Boolean).join(" ")}
      style={{ width: size, height: size, maxWidth: "none" }}
    />
  );
}

export function FactionCrest({
  faction,
  size = 28,
  className,
  decorative = false,
}: {
  faction: Faction;
  size?: number;
  className?: string;
  decorative?: boolean;
}) {
  return (
    <WowIcon
      src={factionIconSrc(faction)}
      alt={decorative ? "" : FACTION_LABEL[faction]}
      size={size}
      className={className}
    />
  );
}

export function ClassIcon({
  classId,
  size = 28,
  className,
}: {
  classId: ClassId;
  size?: number;
  className?: string;
}) {
  return (
    <WowIcon
      src={classIconSrc(classId)}
      alt={CLASS_LABEL[classId]}
      size={size}
      className={className}
    />
  );
}

export function RoleIcon({
  role,
  size = 28,
  className,
}: {
  role: Role;
  size?: number;
  className?: string;
}) {
  return (
    <WowIcon src={roleIconSrc(role)} alt={ROLE_LABEL[role]} size={size} className={className} />
  );
}

export function RaceIcon({
  race,
  size = 28,
  className,
}: {
  race: Race;
  size?: number;
  className?: string;
}) {
  const src = raceIconSrc(race);
  if (!src) return null;
  return <WowIcon src={src} alt={RACE_LABEL[race]} size={size} className={className} />;
}

/**
 * Class icon in a rounded square with a class-color ring. Size comes from the
 * className (e.g. "size-10") so it can change across breakpoints.
 */
export function ClassBadge({
  classId,
  className = "size-10",
  ring = "soft",
  decorative = false,
}: {
  classId: ClassId;
  className?: string;
  ring?: "soft" | "strong";
  decorative?: boolean;
}) {
  const color = CLASS_COLOR[classId];
  return (
    <span
      className={["relative inline-block shrink-0 overflow-hidden rounded-[22%]", className].join(" ")}
      style={{
        boxShadow:
          ring === "strong"
            ? `0 0 0 1.5px ${color}`
            : `0 0 0 1px color-mix(in oklab, ${color} 60%, transparent)`,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- fan-use WoW icons must render as raw files */}
      <img
        src={classIconSrc(classId)}
        alt={decorative ? "" : CLASS_LABEL[classId]}
        draggable={false}
        className="block size-full object-cover"
      />
    </span>
  );
}

/** Race portrait, or a quiet monogram tile for Skyborne (no official art yet). */
export function RaceBadge({
  race,
  className = "size-9",
  decorative = false,
}: {
  race: Race;
  className?: string;
  decorative?: boolean;
}) {
  const src = raceIconSrc(race);
  const base = ["relative inline-grid shrink-0 place-items-center overflow-hidden rounded-[22%]", className].join(" ");
  if (!src) {
    return (
      <span
        className={`${base} bg-[radial-gradient(circle_at_50%_30%,rgb(224_177_90/0.28),rgb(224_177_90/0.06))] font-mono text-[10px] font-semibold tracking-wide text-gold`}
        role={decorative ? undefined : "img"}
        aria-label={decorative ? undefined : RACE_LABEL[race]}
        aria-hidden={decorative ? true : undefined}
      >
        <svg viewBox="0 0 24 24" className="size-[55%]" aria-hidden="true">
          <path
            d="M12 4c-1.8 2.6-5.6 4.2-9 4.5 2 1.4 4.6 2 7 1.8-1.2 1.6-3 2.8-5 3.4 2.8.6 5.4 0 7-1.2 1.6 1.2 4.2 1.8 7 1.2-2-.6-3.8-1.8-5-3.4 2.4.2 5-.4 7-1.8-3.4-.3-7.2-1.9-9-4.5Z"
            fill="currentColor"
          />
        </svg>
      </span>
    );
  }
  return (
    <span className={base}>
      {/* eslint-disable-next-line @next/next/no-img-element -- fan-use WoW icons must render as raw files */}
      <img
        src={src}
        alt={decorative ? "" : RACE_LABEL[race]}
        draggable={false}
        className="block size-full object-cover"
      />
    </span>
  );
}

/** Faction crest in a faction-tinted ring. */
export function FactionSeal({
  faction,
  className = "size-12",
  decorative = false,
}: {
  faction: Faction;
  className?: string;
  decorative?: boolean;
}) {
  const color = faction === "alliance" ? "121 176 234" : "227 106 92";
  return (
    <span
      className={["relative inline-block shrink-0 overflow-hidden rounded-full", className].join(" ")}
      style={{ boxShadow: `0 0 0 1px rgb(${color} / 0.6), 0 0 28px rgb(${color} / 0.25)` }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- fan-use WoW icons must render as raw files */}
      <img
        src={factionIconSrc(faction)}
        alt={decorative ? "" : FACTION_LABEL[faction]}
        draggable={false}
        className="block size-full scale-[1.12] object-cover"
      />
    </span>
  );
}

/** LFG role icon sized by className, so it can change across breakpoints. */
export function RoleBadge({
  role,
  className = "size-[34px]",
  decorative = false,
}: {
  role: Role;
  className?: string;
  decorative?: boolean;
}) {
  return (
    <span className={["inline-block shrink-0", className].join(" ")}>
      {/* eslint-disable-next-line @next/next/no-img-element -- fan-use WoW icons must render as raw files */}
      <img
        src={roleIconSrc(role)}
        alt={decorative ? "" : ROLE_LABEL[role]}
        draggable={false}
        className="block size-full object-contain"
      />
    </span>
  );
}
