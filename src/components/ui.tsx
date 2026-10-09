const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

export const inputClass =
  "h-11 w-full rounded-[10px] border border-[rgb(244_236_223/0.14)] bg-well px-3 text-[14.5px] text-ink outline-none transition placeholder:text-faint focus:border-gold focus:shadow-[0_0_0_3px_rgb(224_177_90/0.18)]";

export const labelClass = "flex items-baseline gap-1.5 text-[12.5px] font-medium text-muted";

export const groupLabelClass = "text-[13px] font-semibold text-ink";

export const optionalClass = "font-normal text-faint";

export const primaryButtonClass = `inline-flex h-[52px] items-center justify-center gap-2.5 rounded-[13px] bg-gold px-5 text-[15.5px] font-semibold text-[#1a1206] shadow-[0_10px_30px_-10px_rgb(224_177_90/0.5)] transition hover:bg-gold-bright active:translate-y-px disabled:cursor-not-allowed disabled:bg-raised disabled:text-muted disabled:shadow-none ${focusRing}`;

export const pillButtonClass = `inline-flex h-[38px] items-center justify-center gap-2 rounded-full border border-[rgb(244_236_223/0.12)] bg-[rgb(244_236_223/0.04)] px-4 text-[13px] font-medium text-ink transition hover:border-[rgb(244_236_223/0.24)] hover:bg-[rgb(244_236_223/0.08)] disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`;

export const secondaryButtonClass = `inline-flex h-11 items-center justify-center gap-2 rounded-[10px] border border-[rgb(244_236_223/0.12)] bg-chip px-4 text-[13.5px] font-medium text-ink transition hover:border-[rgb(244_236_223/0.24)] disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`;

export const dangerButtonClass =
  "inline-flex h-11 items-center justify-center rounded-[10px] border border-danger/50 px-4 text-[13.5px] font-medium text-danger transition hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger";

export const cardClass = "rounded-[14px] border border-[rgb(244_236_223/0.06)] bg-tile";

export const sheetClass =
  "rounded-[20px] border border-[rgb(244_236_223/0.1)] bg-sheet shadow-[0_30px_60px_-30px_rgb(0_0_0/0.8)]";

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
    <p
      className="rounded-[10px] border border-danger/35 bg-danger/10 px-3 py-2.5 text-[13.5px] leading-5 text-[#ffb3a8]"
      role="alert"
    >
      {message}
    </p>
  );
}

