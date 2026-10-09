"use client";

import { useActionState } from "react";
import { createRoster, type ActionState } from "@/app/actions";
import {
  FormError,
  groupLabelClass,
  Honeypot,
  inputClass,
  labelClass,
  optionalClass,
  primaryButtonClass,
  sheetClass,
} from "@/components/ui";
import { submitWithoutReset } from "@/components/submit-without-reset";
import { FactionSeal } from "@/components/wow-icon";
import { FACTION_COLOR } from "@/lib/icons";
import {
  DEFAULT_CAP,
  FACTIONS,
  FACTION_LABEL,
  MAX_CAP,
  RULESETS,
  RULESET_LABEL,
  TITLE_MAX,
  VERSION_LABEL,
} from "@/lib/rules";

const initial: ActionState = {};

const focusWithin =
  "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold";

export function CreateRosterForm() {
  const [state, action, pending] = useActionState(createRoster, initial);

  return (
    <form onSubmit={submitWithoutReset(action)} className={`${sheetClass} relative flex flex-col gap-5 p-5 sm:p-[22px]`}>
      <Honeypot />
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-serif text-[30px] leading-none text-ink">New roster</h2>
        <span className="text-[12.5px] text-faint">{VERSION_LABEL.forever}</span>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className={labelClass}>Roster name</span>
        <input
          name="title"
          required
          maxLength={TITLE_MAX}
          placeholder="Molten Core Sunday"
          className={inputClass}
        />
      </label>

      <fieldset className="flex min-w-0 flex-col">
        <legend className={`${groupLabelClass} mb-2`}>Faction</legend>
        <div className="grid grid-cols-2 gap-2">
          {FACTIONS.map((faction) => (
            <label
              key={faction}
              className={`group flex cursor-pointer items-center gap-3 rounded-[14px] border border-[rgb(244_236_223/0.08)] bg-chip p-3 transition hover:border-[rgb(244_236_223/0.18)] has-[:checked]:border-[var(--faction)] has-[:checked]:bg-[color-mix(in_oklab,var(--faction)_12%,#211b16)] ${focusWithin}`}
              style={{ ["--faction" as string]: FACTION_COLOR[faction] }}
            >
              <input
                className="peer sr-only"
                type="radio"
                name="faction"
                value={faction}
                defaultChecked={faction === "alliance"}
              />
              <FactionSeal faction={faction} className="size-10" decorative />
              <span className="text-[15px] leading-none font-semibold text-soft group-has-[:checked]:text-ink">
                {FACTION_LABEL[faction]}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex min-w-0 flex-col">
        <legend className={`${groupLabelClass} mb-2`}>Ruleset</legend>
        <div className="grid grid-cols-4 gap-1 rounded-[12px] border border-[rgb(244_236_223/0.08)] bg-well p-1">
          {RULESETS.map((ruleset) => (
            <label
              key={ruleset}
              className={`flex h-[38px] cursor-pointer items-center justify-center rounded-[8px] text-[13.5px] font-medium text-muted transition hover:text-ink has-[:checked]:bg-raised has-[:checked]:font-semibold has-[:checked]:text-ink has-[:checked]:shadow-[inset_0_0_0_1px_rgb(224_177_90/0.5)] ${focusWithin}`}
            >
              <input
                className="sr-only"
                type="radio"
                name="ruleset"
                value={ruleset}
                defaultChecked={ruleset === "pve"}
              />
              {RULESET_LABEL[ruleset]}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-2 gap-2.5">
        <label className="flex min-w-0 flex-col gap-1.5">
          <span className={labelClass}>Size cap</span>
          <input
            name="cap"
            type="number"
            inputMode="numeric"
            min={1}
            max={MAX_CAP}
            defaultValue={DEFAULT_CAP}
            required
            className={`${inputClass} font-mono`}
          />
        </label>
        <label className="flex min-w-0 flex-col gap-1.5">
          <span className={labelClass}>
            Signup code <span className={optionalClass}>optional</span>
          </span>
          <input
            name="signupCode"
            maxLength={32}
            placeholder="mc sunday"
            autoComplete="off"
            className={`${inputClass} font-mono`}
          />
        </label>
      </div>
      <p className="-mt-2 text-[12.5px] leading-5 text-faint">
        A raid is usually 40; a guild list can go to 1000. With a code, friends type it to join;
        without one, the link is enough.
      </p>

      <FormError message={state.error} />
      <button type="submit" className={`${primaryButtonClass} w-full`} disabled={pending}>
        {pending ? "Creating…" : "Create roster"}
      </button>
    </form>
  );
}
