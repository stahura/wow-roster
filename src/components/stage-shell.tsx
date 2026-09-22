import type { ReactNode } from "react";
import Link from "next/link";
import { FactionCrest } from "@/components/wow-icon";
import { type Faction } from "@/lib/rules";

export function StageShell({
  faction,
  children,
}: {
  faction: Faction;
  children: ReactNode;
}) {
  return (
    <div className={faction === "alliance" ? "stage-alliance" : "stage-horde"}>
      <div className="stage-watermark" aria-hidden="true">
        <FactionCrest faction={faction} size={420} className="opacity-[0.07]" />
      </div>
      <div className="relative mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-4 py-8 sm:px-6">
        <header className="mb-10 flex items-baseline justify-between gap-4">
          <Link href="/" className="font-serif text-xl tracking-tight text-ink">
            WoW Roster
          </Link>
          <p className="text-xs tracking-[0.16em] text-muted uppercase">Forever</p>
        </header>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
