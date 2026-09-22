import Image from "next/image";
import { CLASS_LABEL, FACTION_LABEL, type ClassId, type Faction } from "@/lib/rules";

export function FactionCrest({
  faction,
  size = 28,
  className,
}: {
  faction: Faction;
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src={`/icons/${faction}.svg`}
      alt={FACTION_LABEL[faction]}
      width={size}
      height={size}
      className={className}
      unoptimized
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
    <Image
      src={`/icons/${classId}.svg`}
      alt={CLASS_LABEL[classId]}
      width={size}
      height={size}
      className={className}
      unoptimized
    />
  );
}
