"use client";

import { useState } from "react";
import { pillButtonClass } from "@/components/ui";

export function CopyButton({
  value,
  label,
  copiedLabel = "Copied",
  className = pillButtonClass,
}: {
  value: string;
  label: string;
  copiedLabel?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1400);
        } catch {
          setCopied(false);
        }
      }}
    >
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
    </button>
  );
}
