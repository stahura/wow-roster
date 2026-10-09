"use client";

import { useActionState } from "react";
import { deleteRoster, setLocked, updateCap, type ActionState } from "@/app/actions";
import { CopyButton } from "@/components/copy-button";
import {
  dangerButtonClass,
  FormError,
  inputClass,
  labelClass,
  pillButtonClass,
  primaryButtonClass,
  secondaryButtonClass,
  sheetClass,
} from "@/components/ui";
import { MAX_CAP } from "@/lib/rules";

const initial: ActionState = {};

const linkFieldClass =
  "block min-w-0 flex-1 truncate rounded-[10px] border border-[rgb(244_236_223/0.1)] bg-well px-3 py-3 font-mono text-[12.5px] text-soft";

export function ManagePanel({
  secret,
  publicUrl,
  manageUrl,
  cap,
  count,
  locked,
  signupCode,
  listText,
}: {
  secret: string;
  publicUrl: string;
  manageUrl: string;
  cap: number;
  count: number;
  locked: boolean;
  signupCode: string;
  listText: string;
}) {
  const [capState, capAction, capPending] = useActionState(updateCap, initial);
  const [deleteState, deleteAction, deletePending] = useActionState(deleteRoster, initial);

  return (
    <div className="flex flex-col gap-3">
      <section className={`${sheetClass} relative flex flex-col gap-4 overflow-hidden p-5 lg:p-[22px]`}>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(320px_160px_at_0%_0%,rgb(224_177_90/0.14),transparent_70%)]"
        />
        <div className="relative flex flex-col gap-1.5">
          <span className="font-mono text-[11px] leading-none font-semibold tracking-[0.12em] text-gold">
            SHARE THIS
          </span>
          <h2 className="font-serif text-[28px] leading-none text-ink">Signup link</h2>
          <p className="text-[13px] leading-5 text-muted">
            Post it anywhere. People can join with it, but can&apos;t change the roster.
          </p>
        </div>
        <code className={`${linkFieldClass} relative`}>{publicUrl}</code>
        <CopyButton
          value={publicUrl}
          label="Copy signup link"
          copiedLabel="Signup link copied"
          className={`${primaryButtonClass} relative w-full`}
        />
        {signupCode ? (
          <div className="relative flex items-center gap-2">
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <span className={labelClass}>Signup code</span>
              <code className="truncate font-mono text-[14px] text-ink">{signupCode}</code>
            </div>
            <CopyButton value={signupCode} label="Copy code" />
          </div>
        ) : null}
      </section>

      <section className="flex flex-col gap-3 rounded-[20px] border border-danger/30 bg-[color-mix(in_oklab,#ff7a6b_6%,#1a1612)] p-5 lg:p-[22px]">
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-[11px] leading-none font-semibold tracking-[0.12em] text-danger">
            KEEP THIS SECRET
          </span>
          <h2 className="font-serif text-[24px] leading-none text-ink">Organizer link</h2>
          <p className="text-[13px] leading-5 text-muted">
            This page&apos;s address. Anyone with it can remove people, lock signups or delete the
            roster. Bookmark it, and never post it in a public channel.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <code className={linkFieldClass}>{manageUrl}</code>
          <CopyButton value={manageUrl} label="Copy" />
        </div>
      </section>

      <section className={`${sheetClass} flex flex-col gap-4 p-5 lg:p-[22px]`}>
        <h2 className="font-serif text-[24px] leading-none text-ink">Controls</h2>
        <form action={setLocked} className="flex items-center justify-between gap-3">
          <input type="hidden" name="secret" value={secret} />
          <input type="hidden" name="locked" value={locked ? "0" : "1"} />
          <div className="flex flex-col gap-1">
            <span className="text-[14px] font-semibold text-ink">
              {locked ? "Signups are locked" : "Signups are open"}
            </span>
            <span className="text-[12.5px] text-faint">
              {locked ? "Nobody new can join." : "Anyone with the link can join."}
            </span>
          </div>
          <button type="submit" className={secondaryButtonClass}>
            {locked ? "Unlock" : "Lock"}
          </button>
        </form>
        <form action={capAction} className="flex items-end gap-2">
          <input type="hidden" name="secret" value={secret} />
          <label className="flex min-w-0 flex-1 flex-col gap-1.5">
            <span className={labelClass}>
              Size cap <span className="font-normal text-faint">{count} signed up</span>
            </span>
            <input
              name="cap"
              type="number"
              inputMode="numeric"
              min={Math.max(1, count)}
              max={MAX_CAP}
              defaultValue={cap}
              className={`${inputClass} font-mono`}
            />
          </label>
          <button type="submit" className={secondaryButtonClass} disabled={capPending}>
            {capPending ? "Saving…" : "Save"}
          </button>
        </form>
        <FormError message={capState.error} />
        {capState.saved ? (
          <p className="text-[13px] text-muted" role="status">
            Cap updated.
          </p>
        ) : null}
        <CopyButton value={listText} label="Copy roster as text" className={`${pillButtonClass} w-full`} />
      </section>

      <details className="group rounded-[20px] border border-[rgb(244_236_223/0.08)] p-5 lg:p-[22px]">
        <summary className="cursor-pointer list-none rounded text-[14px] font-medium text-muted transition hover:text-danger focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold">
          Delete roster…
        </summary>
        <form action={deleteAction} className="mt-4 flex flex-col gap-3">
          <input type="hidden" name="secret" value={secret} />
          <p className="text-[13px] leading-5 text-muted">
            Removes the sheet and every name on it. This can&apos;t be undone.
          </p>
          <label className="flex items-center gap-2.5 text-[13.5px] text-ink">
            <input type="checkbox" name="confirm" value="yes" className="size-4 accent-[#ff7a6b]" />
            I want to delete this roster
          </label>
          <FormError message={deleteState.error} />
          <button type="submit" className={`${dangerButtonClass} w-full`} disabled={deletePending}>
            {deletePending ? "Deleting…" : "Delete roster"}
          </button>
        </form>
      </details>
    </div>
  );
}
