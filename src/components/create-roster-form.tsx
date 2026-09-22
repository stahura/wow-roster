"use client";

import { useActionState } from "react";
import { createRoster, type ActionState } from "@/app/actions";
import { FormError, Honeypot, inputClass, labelClass, primaryButtonClass } from "@/components/ui";
import { FactionCrest } from "@/components/wow-icon";
import { FACTION_COLOR } from "@/lib/icons";
import {
  DEFAULT_CAP,
  FACTIONS,
  FACTION_LABEL,
  MAX_CAP,
  RULESETS,
  RULESET_LABEL,
  VERSION_LABEL,
} from "@/lib/rules";

const initial: ActionState = {};

export function CreateRosterForm() {
  const [state, action, pending] = useActionState(createRoster, initial);

  return (
    <form action={action} className="relative grid gap-4 rounded-2xl border border-line bg-panel p-5 sm:p-6">
      <Honeypot />
      <div>
        <label className={labelClass} htmlFor="title">
          Roster name
        </label>
        <input
          id="title"
          name="title"
          required
          maxLength={60}
          placeholder="Molten Core Sunday"
          className={inputClass}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className={labelClass}>Game</p>
          <p className="mt-1.5 rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink">
            {VERSION_LABEL.forever}
          </p>
        </div>
        <div>
          <label className={labelClass} htmlFor="ruleset">
            Ruleset
          </label>
          <select id="ruleset" name="ruleset" className={inputClass} defaultValue="pve">
            {RULESETS.map((ruleset) => (
              <option key={ruleset} value={ruleset}>
                {RULESET_LABEL[ruleset]}
              </option>
            ))}
          </select>
        </div>
      </div>
      <fieldset>
        <legend className={labelClass}>Faction</legend>
        <div className="mt-1.5 grid grid-cols-2 gap-2">
          {FACTIONS.map((faction) => (
            <label
              key={faction}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-line px-3 py-3 text-sm font-medium has-[:checked]:border-gold has-[:checked]:bg-paper has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold"
              style={{ color: FACTION_COLOR[faction] }}
            >
              <input
                className="sr-only"
                type="radio"
                name="faction"
                value={faction}
                defaultChecked={faction === "alliance"}
              />
              <FactionCrest faction={faction} size={28} />
              {FACTION_LABEL[faction]}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="cap">
            Size cap
          </label>
          <input
            id="cap"
            name="cap"
            type="number"
            min={1}
            max={MAX_CAP}
            defaultValue={DEFAULT_CAP}
            required
            className={inputClass}
          />
          <p className="mt-1.5 text-xs text-muted">A raid is often 40. A guild list can go to 1000.</p>
        </div>
        <div>
          <label className={labelClass} htmlFor="signupCode">
            Signup code
          </label>
          <input
            id="signupCode"
            name="signupCode"
            maxLength={32}
            placeholder="Optional"
            autoComplete="off"
            className={inputClass}
          />
          <p className="mt-1.5 text-xs text-muted">Leave blank and the link is enough. Otherwise friends type this code.</p>
        </div>
      </div>
      <FormError message={state.error} />
      <button type="submit" className={primaryButtonClass} disabled={pending}>
        {pending ? "Creating…" : "Create roster"}
      </button>
    </form>
  );
}
