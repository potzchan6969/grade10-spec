/** The booking surfaces' shared look, one place for the board's values.
 * Internal: blocks compose these, consumers never see them. */

/** Body text one step quieter than ink: the nearest token to the board's ink-2. */
const INK_2 = "text-(--gray-700)";

/** A 44px pill on white with a hairline ring: Back, the earliest time, the
 * acts on a notice. */
const PILL_OUTLINE =
  "inline-flex h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full bg-card px-4 text-sm font-semibold text-foreground shadow-[inset_0_0_0_1px_var(--border-strong)] transition-[background-color,transform] duration-100 outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-50";

/** The brand pill: the step's one primary act. */
const PILL_PRIMARY =
  "inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-5 text-[15px] font-semibold text-primary-foreground transition-[background-color,transform] duration-100 outline-none hover:bg-(--orange-500) focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[.98] aria-disabled:cursor-progress";

/** An underlined text press: Change, Not you?, Sign in. */
const TEXT_LINK =
  "inline-flex min-h-11 cursor-pointer items-center bg-transparent p-0 text-sm font-semibold text-foreground underline decoration-border-strong underline-offset-[3px] transition-[text-decoration-color] duration-100 outline-none hover:decoration-current focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50";

/** Section heading inside a step: `What do you need?`. */
const STEP_HEADING = "m-0 text-[17px] leading-6 font-bold";

/** A card's rule-separated footer lines. */
const SMALL_LINES = `flex flex-col gap-1 text-[13px] leading-[18px] ${INK_2}`;

export {
  INK_2,
  PILL_OUTLINE,
  PILL_PRIMARY,
  SMALL_LINES,
  STEP_HEADING,
  TEXT_LINK,
};
