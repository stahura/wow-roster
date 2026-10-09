"use client";

import { useActionState, useState, type Ref } from "react";
import { addCharacter, type ActionState } from "@/app/actions";
import {
  FormError,
  groupLabelClass,
  Honeypot,
  inputClass,
  labelClass,
  optionalClass,
  primaryButtonClass,
} from "@/components/ui";
import { submitWithoutReset } from "@/components/submit-without-reset";
import { ClassBadge, RaceBadge, RoleBadge } from "@/components/wow-icon";
import { classTextColor, ROLE_COLOR } from "@/lib/icons";
import {
  CHARACTER_NAME_MAX,
  CLASSES,
  classesFor,
  classPlural,
  CLASS_COLOR,
  CLASS_LABEL,
  NICKNAME_MAX,
  NICKNAME_MIN,
  NOTE_MAX,
  racesFor,
  RACE_LABEL,
  rolesFor,
  ROLE_LABEL,
  type ClassId,
  type Faction,
  type Race,
  type Role,
  type Version,
} from "@/lib/rules";

const initial: ActionState = {};

const focusWithin =
  "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold";

/**
 * Class-first picker: class grid, then race (combos the class can't be are
 * dimmed and disabled), then role only when the class has more than one.
 * Every group is a native radio group, so Tab moves between groups and the
 * arrow keys move inside one.
 */
export function SignupForm({
  rosterId,
  version,
  faction,
  needsCode,
  nicknameRef,
}: {
  rosterId: string;
  version: Version;
  faction: Faction;
  needsCode: boolean;
  nicknameRef?: Ref<HTMLInputElement>;
}) {
  const races = racesFor(version, faction);
  const [nickname, setNickname] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [classId, setClassId] = useState<ClassId | null>(null);
  const [race, setRace] = useState<Race | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [note, setNote] = useState("");
  const [state, action, pending] = useActionState(addCharacter, initial);

  const validRaces = classId
    ? races.filter((option) => classesFor(version, faction, option).includes(classId))
    : races;
  const roles = classId ? rolesFor(classId) : [];
  const pickedRole: Role | null = roles.length === 1 ? roles[0] : role;

  function chooseClass(next: ClassId) {
    setClassId(next);
    const nextRaces = races.filter((option) => classesFor(version, faction, option).includes(next));
    if (nextRaces.length === 1) setRace(nextRaces[0]);
    else if (race && !nextRaces.includes(race)) setRace(null);
    if (role && !rolesFor(next).includes(role)) setRole(null);
  }

  const missing = !classId ? "Pick a class" : !race ? "Pick a race" : !pickedRole ? "Pick a role" : null;
  const submitLabel = missing
    ? missing
    : `Join as ${RACE_LABEL[race!]} ${CLASS_LABEL[classId!]} · ${ROLE_LABEL[pickedRole!]}`;

  return (
    <form onSubmit={submitWithoutReset(action)} className="relative flex flex-col gap-5">
      <Honeypot />
      <input type="hidden" name="rosterId" value={rosterId} />

      <PreviewCard
        nickname={nickname.trim()}
        characterName={characterName.trim()}
        classId={classId}
        race={race}
        role={pickedRole}
      />

      <div className="grid grid-cols-2 gap-2.5">
        <label className="flex min-w-0 flex-col gap-1.5">
          <span className={labelClass}>Nickname</span>
          <input
            ref={nicknameRef}
            name="nickname"
            required
            minLength={NICKNAME_MIN}
            maxLength={NICKNAME_MAX}
            placeholder="Saskia"
            autoComplete="off"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            className={inputClass}
          />
        </label>
        <label className="flex min-w-0 flex-col gap-1.5">
          <span className={labelClass}>
            Character <span className={optionalClass}>optional</span>
          </span>
          <input
            name="characterName"
            maxLength={CHARACTER_NAME_MAX}
            placeholder="Moonwhisper"
            autoComplete="off"
            value={characterName}
            onChange={(event) => setCharacterName(event.target.value)}
            className={inputClass}
          />
        </label>
      </div>

      <fieldset className="flex min-w-0 flex-col">
        <legend className={`${groupLabelClass} mb-2`}>Class</legend>
        <div className="grid grid-cols-3 gap-1.5">
          {CLASSES.map((option) => {
            const selected = option === classId;
            const color = CLASS_COLOR[option];
            return (
              <label
                key={option}
                className={`relative flex h-[42px] cursor-pointer items-center gap-2 rounded-[10px] px-2 text-[13px] leading-none transition ${focusWithin} ${
                  selected
                    ? "font-semibold"
                    : "border border-[rgb(244_236_223/0.06)] bg-chip font-medium text-soft hover:border-[rgb(244_236_223/0.16)]"
                }`}
                style={
                  selected
                    ? {
                        color: classTextColor(option),
                        background: `color-mix(in oklab, ${color} 12%, #1a1612)`,
                        boxShadow: `inset 0 0 0 1.5px ${color}`,
                      }
                    : undefined
                }
              >
                <input
                  type="radio"
                  name="className"
                  value={option}
                  checked={selected}
                  onChange={() => chooseClass(option)}
                  className="sr-only"
                  required
                />
                <ClassBadge classId={option} className="size-[26px]" decorative ring={selected ? "strong" : "soft"} />
                <span className="truncate">{CLASS_LABEL[option]}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="flex min-w-0 flex-col">
        <legend className="mb-2 flex w-full items-baseline justify-between gap-3">
          <span className={groupLabelClass}>Race</span>
          {classId && validRaces.length < races.length ? (
            <span className="text-right text-[12px] leading-tight font-normal text-faint">
              Dimmed races can&apos;t be {classPlural(classId)}
            </span>
          ) : null}
        </legend>
        <div className="grid grid-cols-5 gap-1.5">
          {races.map((option) => {
            const valid = validRaces.includes(option);
            const selected = option === race;
            return (
              <label
                key={option}
                className={`flex flex-col items-center gap-1.5 rounded-[10px] bg-chip px-0.5 py-2 transition ${focusWithin} ${
                  valid ? "cursor-pointer hover:bg-raised" : "cursor-not-allowed opacity-40"
                }`}
              >
                <input
                  type="radio"
                  name="race"
                  value={option}
                  checked={selected}
                  disabled={!valid}
                  onChange={() => setRace(option)}
                  className="sr-only"
                  required
                />
                <span
                  className={`rounded-[22%] transition ${
                    selected ? "shadow-[0_0_0_2px_#e0b15a]" : "shadow-[0_0_0_1px_rgb(244_236_223/0.1)]"
                  }`}
                >
                  <RaceBadge race={option} className="size-9" decorative />
                </span>
                <span
                  className={`text-center text-[11px] leading-[1.1] ${selected ? "font-semibold text-ink" : "font-medium text-soft"}`}
                >
                  {RACE_LABEL[option]}
                </span>
                {!valid && classId ? <span className="sr-only">, can&apos;t be a {CLASS_LABEL[classId]}</span> : null}
              </label>
            );
          })}
        </div>
      </fieldset>

      {roles.length > 1 ? (
        <fieldset className="flex min-w-0 flex-col">
          <legend className="mb-2 flex w-full items-baseline justify-between gap-3">
            <span className={groupLabelClass}>Role</span>
            <span className="text-[12px] font-normal text-faint">
              {classPlural(classId!)} can{" "}
              {roles.length === 3 ? "tank, heal or DPS" : roles.includes("tank") ? "tank or DPS" : "heal or DPS"}
            </span>
          </legend>
          <div
            className="grid gap-1 rounded-[12px] border border-[rgb(244_236_223/0.08)] bg-well p-1"
            style={{ gridTemplateColumns: `repeat(${roles.length}, minmax(0, 1fr))` }}
          >
            {roles.map((option) => {
              const selected = option === role;
              const color = ROLE_COLOR[option];
              return (
                <label
                  key={option}
                  className={`flex h-[38px] cursor-pointer items-center justify-center gap-2 rounded-[8px] text-[13.5px] leading-none transition ${focusWithin} ${
                    selected ? "font-semibold text-ink" : "font-medium text-muted hover:text-ink"
                  }`}
                  style={
                    selected
                      ? {
                          background: `color-mix(in oklab, ${color} 16%, #2a231c)`,
                          boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${color} 50%, transparent)`,
                        }
                      : undefined
                  }
                >
                  <input
                    type="radio"
                    name="role"
                    value={option}
                    checked={selected}
                    onChange={() => setRole(option)}
                    className="sr-only"
                    required
                  />
                  <RoleBadge role={option} className="size-[18px]" decorative />
                  {ROLE_LABEL[option]}
                </label>
              );
            })}
          </div>
        </fieldset>
      ) : pickedRole ? (
        <input type="hidden" name="role" value={pickedRole} />
      ) : null}

      <label className="flex flex-col gap-1.5">
        <span className={`${labelClass} justify-between`}>
          <span>
            Note <span className={optionalClass}>optional</span>
          </span>
          {note.length > 0 ? (
            <span className="font-mono text-faint">
              {note.length}/{NOTE_MAX}
            </span>
          ) : null}
        </span>
        <input
          name="note"
          maxLength={NOTE_MAX}
          placeholder="Spec, server, or who invited you"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          className={inputClass}
        />
      </label>

      {needsCode ? (
        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>
            Signup code <span className={optionalClass}>from the organizer</span>
          </span>
          <input
            name="signupCode"
            required
            autoComplete="off"
            className={`${inputClass} font-mono tracking-[0.04em]`}
          />
        </label>
      ) : null}

      <div className="sticky bottom-0 z-10 -mx-[18px] -mb-8 border-t border-[rgb(244_236_223/0.08)] bg-sheet px-[18px] pt-3 pb-[max(16px,env(safe-area-inset-bottom))] lg:-mx-[22px] lg:-mb-[22px] lg:px-[22px] lg:pb-[22px]">
        <FormError message={state.error} />
        <button
          type="submit"
          className={`${primaryButtonClass} w-full ${state.error ? "mt-2.5" : ""}`}
          disabled={pending || missing !== null}
        >
          <span className="truncate">{pending ? "Adding you…" : submitLabel}</span>
        </button>
      </div>
    </form>
  );
}

/** Live preview of the tile friends will see, filled in as you pick. */
function PreviewCard({
  nickname,
  characterName,
  classId,
  race,
  role,
}: {
  nickname: string;
  characterName: string;
  classId: ClassId | null;
  race: Race | null;
  role: Role | null;
}) {
  const color = classId ? CLASS_COLOR[classId] : "#8a7e6c";

  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden rounded-[14px] p-3.5 transition-colors duration-300"
      style={{
        background: `radial-gradient(220px 130px at 0% 0%, color-mix(in oklab, ${color} 14%, transparent), transparent 70%), #13100e`,
        border: `1px solid color-mix(in oklab, ${color} 30%, transparent)`,
      }}
    >
      <div className="flex items-center gap-3">
        {classId ? (
          <ClassBadge classId={classId} className="size-11" ring="strong" decorative />
        ) : (
          <span className="grid size-11 shrink-0 place-items-center rounded-[22%] border border-dashed border-[rgb(244_236_223/0.2)] font-mono text-[15px] text-faint">
            ?
          </span>
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className={`truncate text-[16px] leading-none font-semibold ${nickname ? "text-ink" : "text-faint"}`}>
            {nickname || "Your nickname"}
          </span>
          <span className="truncate text-[12.5px] leading-none text-muted">
            {characterName ? `${characterName} · ` : null}
            {race ? `${RACE_LABEL[race]} ` : null}
            {classId ? (
              <span className="font-medium" style={{ color: classTextColor(classId) }}>
                {CLASS_LABEL[classId]}
              </span>
            ) : (
              <span className="text-faint">Pick a class below</span>
            )}
          </span>
        </div>
        {role ? (
          <span
            className="flex h-[26px] shrink-0 items-center gap-1.5 rounded-full px-2.5 text-[12px] leading-none font-semibold"
            style={{
              color: ROLE_COLOR[role],
              background: `color-mix(in oklab, ${ROLE_COLOR[role]} 12%, transparent)`,
              border: `1px solid color-mix(in oklab, ${ROLE_COLOR[role]} 45%, transparent)`,
            }}
          >
            {ROLE_LABEL[role]}
          </span>
        ) : null}
      </div>
      <span className="absolute top-2 right-2.5 font-mono text-[10px] leading-none font-medium tracking-[0.08em] text-faint">
        PREVIEW
      </span>
      <span
        className="absolute inset-x-0 bottom-0 h-[2px] transition-colors duration-300"
        style={{ background: classId ? color : "transparent" }}
      />
    </div>
  );
}
