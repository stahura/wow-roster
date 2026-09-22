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
    <section className="mt-8">
      <h2 className="text-xs font-medium tracking-[0.14em] text-muted uppercase">
        On this browser
      </h2>
      <ul className="mt-3 grid gap-2">
        {links.map((link) => (
          <li key={link.id}>
            <a
              href={link.href}
              className="block truncate rounded-lg border border-line bg-panel px-3 py-2 text-sm text-ink hover:border-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              {link.title}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
