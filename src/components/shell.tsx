import type { ReactNode } from "react";
import Link from "next/link";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-4 py-8 sm:px-6">
      <header className="mb-8 flex items-baseline justify-between gap-4">
        <Link href="/" className="font-serif text-xl tracking-tight text-ink">
          WoW Roster
        </Link>
        <p className="text-xs tracking-[0.16em] text-muted uppercase">No accounts</p>
      </header>
      <div className="flex-1">{children}</div>
    </div>
  );
}
