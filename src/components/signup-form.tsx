"use client";

import { useActionState, useState } from "react";
import { addCharacter, type ActionState } from "@/app/actions";
import { FormError, Honeypot, inputClass, labelClass, primaryButtonClass } from "@/components/ui";
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

  function chooseClass(next: typeof classId) {
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
          <select
            id="race"
            name="race"
            className={inputClass}
            value={race}
            onChange={(event) => chooseRace(event.target.value as Race)}
          >
            {races.map((option) => (
              <option key={option} value={option}>
                {RACE_LABEL[option]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="className">
            Class
          </label>
          <select
            id="className"
            name="className"
            className={inputClass}
            value={classId}
            onChange={(event) => chooseClass(event.target.value as typeof classId)}
          >
            {classes.map((option) => (
              <option key={option} value={option}>
                {CLASS_LABEL[option]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="role">
            Role
          </label>
          <select
            id="role"
            name="role"
            className={inputClass}
            value={role}
            onChange={(event) => setRole(event.target.value as Role)}
          >
            {roles.map((option) => (
              <option key={option} value={option}>
                {ROLE_LABEL[option]}
              </option>
            ))}
          </select>
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
