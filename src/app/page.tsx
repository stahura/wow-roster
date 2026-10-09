import { CreateRosterForm } from "@/components/create-roster-form";
import { SavedRosters } from "@/components/saved-rosters";
import { Shell } from "@/components/shell";
import { ClassBadge, RoleBadge } from "@/components/wow-icon";
import { CLASSES, ROLES } from "@/lib/rules";

export default async function Home({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const deleted = params.deleted === "1";

  return (
    <Shell>
      <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-16">
        <div className="flex flex-col gap-7 lg:pt-6">
          {deleted ? (
            <p
              className="w-fit rounded-full border border-[rgb(244_236_223/0.12)] bg-[rgb(244_236_223/0.04)] px-3.5 py-1.5 text-[13px] text-muted"
              role="status"
            >
              That roster was deleted.
            </p>
          ) : null}
          <div className="flex flex-col gap-5">
            <span className="font-mono text-[11px] leading-none font-semibold tracking-[0.12em] text-gold">
              WOW: FOREVER · GROUP PLANNING
            </span>
            <h1 className="max-w-xl font-serif text-[46px] leading-[0.98] tracking-[-0.015em] text-ink sm:text-[64px] lg:text-[76px]">
              A signup sheet you can <i className="text-gold">send around.</i>
            </h1>
            <p className="max-w-md text-[15.5px] leading-7 text-muted">
              Pick a faction and a ruleset, then share one link in Discord. Friends add a nickname,
              class and role in about 20 seconds. You keep a private link to manage the list.
            </p>
          </div>
          <div className="flex items-center gap-3" aria-hidden="true">
            <div className="flex -space-x-1.5">
              {CLASSES.map((classId) => (
                <span key={classId} className="rounded-[24%] bg-paper p-[2px]">
                  <ClassBadge classId={classId} className="size-8" decorative />
                </span>
              ))}
            </div>
            <div className="hidden gap-1 sm:flex">
              {ROLES.map((role) => (
                <RoleBadge key={role} role={role} className="size-7" decorative />
              ))}
            </div>
          </div>
          <ul className="grid max-w-md gap-2.5 text-[14px] text-soft">
            <li className="flex gap-3">
              <span className="mt-[9px] size-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
              No accounts, no email, no Battle.net.
            </li>
            <li className="flex gap-3">
              <span className="mt-[9px] size-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
              Race and class are checked against Forever rules and your faction.
            </li>
            <li className="flex gap-3">
              <span className="mt-[9px] size-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
              From a five-person dungeon group to a 1000-name guild list.
            </li>
          </ul>
          <SavedRosters />
        </div>
        <CreateRosterForm />
      </div>
    </Shell>
  );
}
