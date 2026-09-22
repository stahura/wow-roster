"use client";

import { useActionState, type ReactNode } from "react";
import { deleteRoster, setLocked, updateCap, type ActionState } from "@/app/actions";
import { CopyButton } from "@/components/copy-button";
import {
  dangerButtonClass,
  FormError,
  inputClass,
  labelClass,
  secondaryButtonClass,
} from "@/components/ui";
import { MAX_CAP } from "@/lib/rules";

const initial: ActionState = {};

export function ManagePanel({
  secret,
  publicUrl,
  manageUrl,
  cap,
  count,
  locked,
  signupCode,
  listText,
  children,
}: {
  secret: string;
  publicUrl: string;
  manageUrl: string;
  cap: number;
  count: number;
  locked: boolean;
  signupCode: string;
  listText: string;
  children: ReactNode;
}) {
  const [capState, capAction, capPending] = useActionState(updateCap, initial);
  const [deleteState, deleteAction, deletePending] = useActionState(deleteRoster, initial);

  return (
    <div className="grid gap-6">
      <section className="rounded-2xl border border-gold/40 bg-panel p-5">
        <h2 className="font-serif text-xl text-ink">Organizer link</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Bookmark this page. Anyone with this link can remove people, lock signup, or delete the
          roster. The signup link cannot.
        </p>
        <dl className="mt-4 grid gap-3">
          <div>
            <dt className={labelClass}>Signup link</dt>
            <dd className="mt-1.5 flex flex-col gap-2 sm:flex-row sm:items-center">
              <code className="block min-w-0 flex-1 truncate rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink">
                {publicUrl}
              </code>
              <CopyButton value={publicUrl} label="Copy signup link" />
            </dd>
          </div>
          <div>
            <dt className={labelClass}>Organizer link</dt>
            <dd className="mt-1.5 flex flex-col gap-2 sm:flex-row sm:items-center">
              <code className="block min-w-0 flex-1 truncate rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink">
                {manageUrl}
              </code>
              <CopyButton value={manageUrl} label="Copy organizer link" />
            </dd>
          </div>
          {signupCode ? (
            <div>
              <dt className={labelClass}>Signup code</dt>
              <dd className="mt-1.5 flex flex-col gap-2 sm:flex-row sm:items-center">
                <code className="block min-w-0 flex-1 truncate rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink">
                  {signupCode}
                </code>
                <CopyButton value={signupCode} label="Copy code" />
              </dd>
            </div>
          ) : null}
        </dl>
      </section>

      <section className="flex flex-col gap-4 rounded-2xl border border-line bg-panel p-5 lg:flex-row lg:items-end lg:justify-between">
        <form action={setLocked}>
          <input type="hidden" name="secret" value={secret} />
          <input type="hidden" name="locked" value={locked ? "0" : "1"} />
          <button type="submit" className={secondaryButtonClass}>
            {locked ? "Unlock signup" : "Lock signup"}
          </button>
        </form>
        <form action={capAction} className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <input type="hidden" name="secret" value={secret} />
          <div>
            <label className={labelClass} htmlFor="cap">
              Cap ({count} signed up)
            </label>
            <input
              id="cap"
              name="cap"
              type="number"
              min={1}
              max={MAX_CAP}
              defaultValue={cap}
              className={`${inputClass} sm:w-32`}
            />
          </div>
          <button type="submit" className={secondaryButtonClass} disabled={capPending}>
            {capPending ? "Saving…" : "Update cap"}
          </button>
        </form>
        <CopyButton value={listText} label="Copy list" />
      </section>
      <FormError message={capState.error} />
      {capState.saved ? <p className="text-sm text-muted">Cap updated.</p> : null}

      {children}

      <section className="rounded-2xl border border-danger/30 bg-panel p-5">
        <h2 className="font-serif text-lg text-ink">Delete roster</h2>
        <p className="mt-1 text-sm text-muted">Removes the sheet and every name on it.</p>
        <form action={deleteAction} className="mt-4 grid gap-3">
          <input type="hidden" name="secret" value={secret} />
          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" name="confirm" value="yes" className="size-4 accent-gold" />
            I want to delete this roster
          </label>
          <FormError message={deleteState.error} />
          <button type="submit" className={`${dangerButtonClass} w-fit`} disabled={deletePending}>
            {deletePending ? "Deleting…" : "Delete roster"}
          </button>
        </form>
      </section>
    </div>
  );
}
