"use client";

import { useEffect, useSyncExternalStore } from "react";

const STORAGE_KEY = "wow-roster-manage-links";

type SavedLink = {
  id: string;
  title: string;
  href: string;
};

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("focus", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("focus", callback);
  };
}

function readSnapshot(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

function parseLinks(raw: string): SavedLink[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((item) => {
      if (!item || typeof item !== "object") return [];
      const record = item as Record<string, unknown>;
      if (
        typeof record.id !== "string" ||
        typeof record.title !== "string" ||
        typeof record.href !== "string" ||
        !record.href.startsWith("/m/")
      ) {
        return [];
      }
      return [{ id: record.id, title: record.title, href: record.href }];
    });
  } catch {
    return [];
  }
}

export function RememberManageLink({
  id,
  title,
  href,
}: {
  id: string;
  title: string;
  href: string;
}) {
  useEffect(() => {
    try {
      const next = [
        { id, title, href },
        ...parseLinks(readSnapshot()).filter((item) => item.id !== id),
      ].slice(0, 20);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage can be blocked. The organizer URL still works.
    }
  }, [id, title, href]);

  return null;
}

export function SavedRosters() {
  const raw = useSyncExternalStore(subscribe, readSnapshot, () => "");
  const links = parseLinks(raw);
  if (links.length === 0) return null;

  return (
    <section className="flex max-w-md flex-col gap-3">
      <h2 className="font-mono text-[11px] leading-none font-semibold tracking-[0.12em] text-faint">
        ON THIS BROWSER
      </h2>
      <ul className="grid gap-1.5">
        {links.map((link) => (
          <li key={link.id}>
            <a
              href={link.href}
              className="flex items-center justify-between gap-3 rounded-[10px] border border-[rgb(244_236_223/0.06)] bg-tile px-3.5 py-3 text-[14px] font-medium text-ink transition hover:border-gold/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <span className="truncate">{link.title}</span>
              <span className="shrink-0 text-[12px] font-normal text-faint">Manage →</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
