import { buttonVariants } from "@grade10/design-system/components/forms/button";
import { cn } from "@grade10/design-system/lib/utils";
import { LinkBreak } from "@phosphor-icons/react";
import { VISIT_INK_2 } from "./visit-tones";

type VisitLinkOpensNothingCopy = {
  title: string;
  lede: string;
  /** Each reason the link may not open a visit. */
  missing: string;
  older: string;
  moved: string;
  mine: string;
  book: string;
  /** Staff can still find the visit at the counter. */
  staff: string;
};

type VisitLinkOpensNothingProps = {
  copy: VisitLinkOpensNothingCopy;
  mineHref: string;
  bookHref: string;
};

const PILL = "h-11 w-full text-[15px] font-semibold [text-box-trim:none]";

/** A link that opens no visit says why it may not, and never guesses one. */
function VisitLinkOpensNothing({
  copy,
  mineHref,
  bookHref,
}: VisitLinkOpensNothingProps) {
  return (
    <div className="flex flex-col gap-4 pt-8 pb-8" data-slot="visit-not-found">
      <span
        aria-hidden
        className={cn(
          "grid size-12 place-items-center rounded-full bg-muted",
          VISIT_INK_2,
        )}
      >
        <LinkBreak size={24} />
      </span>
      <div className="flex flex-col gap-2.5">
        <h1 className="m-0 text-2xl leading-[30px] font-bold tracking-[-0.01em]">
          {copy.title}
        </h1>
        <p className={cn("m-0 text-[15px] leading-[22px]", VISIT_INK_2)}>
          {copy.lede}
        </p>
      </div>
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {[copy.missing, copy.older, copy.moved].map((reason) => (
          <li
            className="flex items-start gap-2.5 rounded-xl bg-muted px-3.5 py-3 text-sm leading-5"
            key={reason}
          >
            <span
              aria-hidden
              className="mt-[7px] size-1.5 shrink-0 rounded-full bg-foreground"
            />
            <span>{reason}</span>
          </li>
        ))}
      </ul>
      <div className="flex flex-col gap-2">
        <a className={cn(buttonVariants({ size: "md" }), PILL)} href={mineHref}>
          {copy.mine}
        </a>
        <a
          className={cn(
            buttonVariants({ size: "md", variant: "outline" }),
            PILL,
            "border-border-strong",
          )}
          href={bookHref}
        >
          {copy.book}
        </a>
      </div>
      <p className={cn("m-0 text-[13px] leading-[18px]", VISIT_INK_2)}>
        {copy.staff}
      </p>
    </div>
  );
}

export type { VisitLinkOpensNothingCopy, VisitLinkOpensNothingProps };
export { VisitLinkOpensNothing };
