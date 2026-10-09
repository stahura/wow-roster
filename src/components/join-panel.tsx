"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { SignupForm } from "@/components/signup-form";
import { primaryButtonClass, sheetClass } from "@/components/ui";
import type { Faction, Version } from "@/lib/rules";

const DESKTOP = "(min-width: 1024px)";

function subscribe(callback: () => void) {
  const query = window.matchMedia(DESKTOP);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function useDesktop(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(DESKTOP).matches,
    () => true,
  );
}

/**
 * The join form. On desktop it is pinned beside the roster; on a phone it is
 * a bottom sheet opened from a sticky "Join the lineup" bar.
 */
export function JoinPanel({
  rosterId,
  version,
  faction,
  needsCode,
  spotsLeft,
}: {
  rosterId: string;
  version: Version;
  faction: Faction;
  needsCode: boolean;
  spotsLeft: number;
}) {
  const desktop = useDesktop();
  const [open, setOpen] = useState(false);
  const nicknameRef = useRef<HTMLInputElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const sheet = !desktop;
  const hidden = sheet && !open;

  useEffect(() => {
    if (!sheet || !open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    nicknameRef.current?.focus({ preventScroll: true });
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    const opener = openerRef.current;
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
      opener?.focus({ preventScroll: true });
    };
  }, [sheet, open]);

  const left = `${spotsLeft} ${spotsLeft === 1 ? "spot" : "spots"} left`;

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-30 bg-[linear-gradient(to_top,#100e0c_55%,rgb(16_14_12/0))] px-4 pt-7 pb-[max(22px,env(safe-area-inset-bottom))] lg:hidden">
        <button
          ref={openerRef}
          type="button"
          className={`${primaryButtonClass} w-full text-[16px]`}
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          Join the lineup
          <span className="font-mono text-[12px] font-medium opacity-70">{spotsLeft} left</span>
        </button>
      </div>

      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <section
        id="join"
        aria-labelledby="join-title"
        role={sheet ? "dialog" : undefined}
        aria-modal={sheet ? true : undefined}
        inert={hidden}
        className={`${sheetClass} no-scrollbar fixed inset-x-0 top-11 bottom-0 z-50 overflow-y-auto rounded-b-none transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] lg:sticky lg:inset-x-auto lg:top-6 lg:bottom-auto lg:z-auto lg:max-h-[calc(100dvh-48px)] lg:translate-y-0 lg:rounded-b-[20px] ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex justify-center pt-2.5 lg:hidden" aria-hidden="true">
          <span className="h-1 w-[38px] rounded-sm bg-[rgb(244_236_223/0.2)]" />
        </div>
        <div className="flex flex-col gap-5 px-[18px] pt-3.5 pb-8 lg:p-[22px]">
          <div className="flex items-center justify-between gap-3 lg:items-baseline">
            <h2 id="join-title" className="font-serif text-[28px] leading-none text-ink lg:text-[30px]">
              Join the lineup
            </h2>
            <span className="hidden text-[12.5px] text-faint lg:inline">{left}</span>
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="grid size-10 place-items-center rounded-full bg-[rgb(244_236_223/0.06)] text-[18px] text-muted transition hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold lg:hidden"
            >
              ×
            </button>
          </div>
          <SignupForm
            rosterId={rosterId}
            version={version}
            faction={faction}
            needsCode={needsCode}
            nicknameRef={nicknameRef}
          />
        </div>
      </section>
    </>
  );
}
