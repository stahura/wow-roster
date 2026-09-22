export const inputClass =
  "mt-1.5 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none transition placeholder:text-muted/70 focus-visible:border-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

export const labelClass = "block text-xs font-medium tracking-[0.14em] text-muted uppercase";

export const primaryButtonClass =
  "inline-flex items-center justify-center rounded-lg bg-gold px-4 py-2.5 text-sm font-semibold text-paper transition hover:bg-[#f0c56e] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

export const secondaryButtonClass =
  "inline-flex items-center justify-center rounded-lg border border-line bg-panel px-4 py-2.5 text-sm font-medium text-ink transition hover:border-gold disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

export const dangerButtonClass =
  "inline-flex items-center justify-center rounded-lg border border-danger/50 px-4 py-2.5 text-sm font-medium text-danger transition hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger";

export function Honeypot() {
  return (
    <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
      <label>
        Company
        <input name="company" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-sm text-danger" role="alert">
      {message}
    </p>
  );
}
