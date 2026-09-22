"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { WowIcon } from "@/components/wow-icon";
import { inputClass } from "@/components/ui";

export type IconOption = {
  value: string;
  label: string;
  iconSrc?: string | null;
  color?: string;
};

export function IconSelect({
  id,
  name,
  value,
  options,
  onChange,
}: {
  id: string;
  name: string;
  value: string;
  options: IconOption[];
  onChange: (value: string) => void;
}) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value) ?? options[0];
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === selected?.value),
  );
  const [activeIndex, setActiveIndex] = useState(selectedIndex);
  const active = options[activeIndex] ?? selected;

  function setOpenAndHighlight(nextOpen: boolean) {
    if (nextOpen) setActiveIndex(selectedIndex);
    setOpen(nextOpen);
  }

  useEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onDocumentKey(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onDocumentKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onDocumentKey);
    };
  }, [open]);

  const optionIds = useMemo(
    () => options.map((option) => `${listId}-${option.value}`),
    [listId, options],
  );

  function choose(next: string) {
    onChange(next);
    setOpen(false);
  }

  function onButtonKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpenAndHighlight(true);
    }
  }

  function onListKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(options.length - 1, index + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(0, index - 1));
    } else if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(options.length - 1);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (active) choose(active.value);
    }
  }

  return (
    <div ref={rootRef} className="relative mt-1.5">
      <input type="hidden" name={name} value={selected?.value ?? ""} />
      <button
        id={id}
        type="button"
        className={`${inputClass} mt-0 flex items-center gap-2 text-left`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpenAndHighlight(!open)}
        onKeyDown={onButtonKeyDown}
        style={selected?.color ? { color: selected.color } : undefined}
      >
        {selected?.iconSrc ? <WowIcon src={selected.iconSrc} alt="" size={22} /> : null}
        <span className="min-w-0 flex-1 truncate font-medium">{selected?.label ?? ""}</span>
        <span className="text-muted" aria-hidden="true">
          ▾
        </span>
      </button>
      {open ? (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          tabIndex={0}
          aria-activedescendant={optionIds[activeIndex]}
          className="absolute z-30 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-line bg-paper py-1 shadow-lg outline-none"
          onKeyDown={onListKeyDown}
        >
          {options.map((option, index) => {
            const isSelected = option.value === selected?.value;
            const isActive = index === activeIndex;
            return (
              <li
                key={option.value}
                id={optionIds[index]}
                role="option"
                aria-selected={isSelected}
                className={`flex cursor-pointer items-center gap-2 px-3 py-2 text-sm font-medium ${
                  isActive ? "bg-line/60" : "hover:bg-line/40"
                }`}
                style={option.color ? { color: option.color } : undefined}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => choose(option.value)}
              >
                {option.iconSrc ? <WowIcon src={option.iconSrc} alt="" size={22} /> : null}
                <span className="truncate">{option.label}</span>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
