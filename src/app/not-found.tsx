import Link from "next/link";
import { Shell } from "@/components/shell";
import { primaryButtonClass } from "@/components/ui";

export default function NotFound() {
  return (
    <Shell>
      <div className="max-w-lg">
        <span className="font-mono text-[11px] font-semibold tracking-[0.12em] text-gold">NOT FOUND</span>
        <h1 className="mt-3 font-serif text-[44px] leading-none text-ink lg:text-[64px]">That sheet is gone.</h1>
        <p className="mt-4 text-[15px] leading-7 text-muted">
          The link is wrong, or the organizer deleted the roster.
        </p>
        <Link href="/" className={`${primaryButtonClass} mt-8`}>
          Make a roster
        </Link>
      </div>
    </Shell>
  );
}
