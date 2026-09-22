import Link from "next/link";
import { Shell } from "@/components/shell";

export default function NotFound() {
  return (
    <Shell>
      <div className="max-w-lg">
        <h1 className="font-serif text-4xl text-ink">That sheet is gone.</h1>
        <p className="mt-3 text-muted">The link is wrong, or the organizer deleted the roster.</p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-lg bg-gold px-4 py-2.5 text-sm font-semibold text-paper"
        >
          Make a roster
        </Link>
      </div>
    </Shell>
  );
}
