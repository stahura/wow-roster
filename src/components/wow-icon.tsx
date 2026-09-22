import {
  classIconSrc,
  factionIconSrc,
  raceIconSrc,
  roleIconSrc,
} from "@/lib/icons";
import { CLASS_LABEL, FACTION_LABEL, RACE_LABEL, ROLE_LABEL } from "@/lib/rules";
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
