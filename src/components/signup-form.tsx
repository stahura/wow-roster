"use client";

import { useActionState, useState } from "react";
import { addCharacter, type ActionState } from "@/app/actions";
import { IconSelect } from "@/components/icon-select";
import { FormError, Honeypot, inputClass, labelClass, primaryButtonClass } from "@/components/ui";
import { classColor, classIconSrc, raceColor, raceIconSrc, ROLE_COLOR, roleIconSrc } from "@/lib/icons";
import {
  CHARACTER_NAME_MAX,
  classesFor,
  CLASS_LABEL,
  NICKNAME_MAX,
  NICKNAME_MIN,
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

export function SignupForm({
  rosterId,
  version,
  faction,
  needsCode,
}: {
  rosterId: string;
  version: Version;
  faction: Faction;
  needsCode: boolean;
}) {
  const races = racesFor(version, faction);
  const [race, setRace] = useState<Race>(races[0] ?? "human");
  const classes = classesFor(version, faction, race);
  const [classId, setClassId] = useState(classes[0] ?? "warrior");
  const roles = rolesFor(classId);
  const [role, setRole] = useState<Role>(roles[0] ?? "dps");
  const [state, action, pending] = useActionState(addCharacter, initial);

  function chooseRace(next: Race) {
    const nextClasses = classesFor(version, faction, next);
    const nextClass = nextClasses.includes(classId) ? classId : (nextClasses[0] ?? classId);
    const nextRoles = rolesFor(nextClass);
    setRace(next);
    setClassId(nextClass);
    setRole(nextRoles.includes(role) ? role : (nextRoles[0] ?? "dps"));
  }

  function chooseClass(next: ClassId) {
    const nextRoles = rolesFor(next);
    setClassId(next);
    setRole(nextRoles.includes(role) ? role : (nextRoles[0] ?? "dps"));
  }

  return (
    <form action={action} className="relative grid gap-4 rounded-2xl border border-line bg-panel p-5 sm:p-6">
      <Honeypot />
      <input type="hidden" name="rosterId" value={rosterId} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="nickname">
            Nickname
          </label>
          <input
            id="nickname"
            name="nickname"
            required
            minLength={NICKNAME_MIN}
            maxLength={NICKNAME_MAX}
            placeholder="Riley"
            autoComplete="off"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="characterName">
            Character (optional)
          </label>
          <input
            id="characterName"
            name="characterName"
            maxLength={CHARACTER_NAME_MAX}
            placeholder="Theron"
            autoComplete="off"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="race">
            Race
          </label>
          <IconSelect
            id="race"
            name="race"
            value={race}
            onChange={(next) => chooseRace(next as Race)}
            options={races.map((option) => ({
              value: option,
              label: RACE_LABEL[option],
              iconSrc: raceIconSrc(option),
              color: raceColor(option),
            }))}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="className">
            Class
          </label>
          <IconSelect
            id="className"
            name="className"
            value={classId}
            onChange={(next) => chooseClass(next as ClassId)}
            options={classes.map((option) => ({
              value: option,
              label: CLASS_LABEL[option],
              iconSrc: classIconSrc(option),
              color: classColor(option),
            }))}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="role">
            Role
          </label>
          <IconSelect
            id="role"
            name="role"
            value={role}
            onChange={(next) => setRole(next as Role)}
            options={roles.map((option) => ({
              value: option,
              label: ROLE_LABEL[option],
              iconSrc: roleIconSrc(option),
              color: ROLE_COLOR[option],
            }))}
          />
        </div>
      </div>
      <div>
        <label className={labelClass} htmlFor="note">
          Note
        </label>
        <input
          id="note"
          name="note"
          maxLength={140}
          placeholder="Spec, server, or who invited you"
          className={inputClass}
        />
      </div>
      {needsCode ? (
        <div>
          <label className={labelClass} htmlFor="signupCode">
            Signup code
          </label>
          <input
            id="signupCode"
            name="signupCode"
            required
            autoComplete="off"
            className={inputClass}
          />
        </div>
      ) : null}
      <FormError message={state.error} />
      <button type="submit" className={primaryButtonClass} disabled={pending}>
        {pending ? "Adding…" : "Join roster"}
      </button>
    </form>
  );
}
