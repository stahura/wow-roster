import { CreateRosterForm } from "@/components/create-roster-form";
import { SavedRosters } from "@/components/saved-rosters";
import { Shell } from "@/components/shell";

export default async function Home({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const deleted = params.deleted === "1";

  return (
    <Shell>
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div>
          <p className="text-xs font-medium tracking-[0.18em] text-gold uppercase">Group planning</p>
          <h1 className="mt-3 max-w-md font-serif text-4xl leading-tight text-ink sm:text-5xl">
            A signup sheet you can send around.
          </h1>
          <p className="mt-4 max-w-md text-base leading-7 text-muted">
            Pick the ruleset and the faction for WoW: Forever. Friends open one link and add their
            characters. You keep a second link that can remove names, lock the list, or delete it.
          </p>
          <ul className="mt-6 grid gap-2 text-sm text-ink/90">
            <li>No accounts, no email, no Battle.net.</li>
            <li>Race and class are checked against Forever rules and faction.</li>
            <li>Each sheet stops at the cap you set, never above 1000.</li>
          </ul>
          {deleted ? (
            <p className="mt-6 text-sm text-muted" role="status">
              That roster was deleted.
            </p>
          ) : null}
          <SavedRosters />
        </div>
        <CreateRosterForm />
      </div>
    </Shell>
  );
}
