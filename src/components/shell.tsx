import type { ReactNode } from "react";
import { TopBar } from "@/components/roster-view";
import type { Faction } from "@/lib/rules";

export function Shell({
  children,
  faction,
  actions,
}: {
  children: ReactNode;
  faction?: Faction;
  actions?: ReactNode;
}) {
  const tone = faction === "alliance" ? "lit-alliance" : faction === "horde" ? "lit-horde" : "lit-gold";
  return (
    <div className={`flex min-h-dvh flex-col ${tone}`}>
      <TopBar>{actions}</TopBar>
      <main className="mx-auto w-full max-w-[1180px] flex-1 px-[18px] pt-8 pb-16 lg:px-12 lg:pt-14">
        {children}
      </main>
    </div>
  );
}
