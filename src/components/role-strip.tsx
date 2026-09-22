import { RoleIcon } from "@/components/wow-icon";
import { ROLE_COLOR } from "@/lib/icons";
import { ROLE_LABEL, ROLES, type Role } from "@/lib/rules";

export function RoleStrip({ counts }: { counts: Record<Role, number> }) {
  return (
    <section
      aria-label="Role summary"
      className="mb-10 rounded-2xl border border-gold/35 bg-black/35 px-3 py-6 sm:px-6 sm:py-8"
    >
      <div className="grid grid-cols-3 gap-2 sm:gap-8">
        {ROLES.map((role) => (
          <div key={role} className="flex flex-col items-center text-center">
            <RoleIcon role={role} size={80} className="drop-shadow-[0_8px_18px_rgba(0,0,0,0.55)] sm:hidden" />
            <RoleIcon
              role={role}
              size={120}
              className="hidden drop-shadow-[0_8px_18px_rgba(0,0,0,0.55)] sm:block"
            />
            <p
              className="mt-3 font-serif text-5xl leading-none tabular-nums sm:text-6xl"
              style={{ color: ROLE_COLOR[role] }}
            >
              {counts[role]}
            </p>
            <p className="mt-2 text-xs font-medium tracking-[0.22em] text-muted uppercase sm:text-sm">
              {ROLE_LABEL[role]}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
