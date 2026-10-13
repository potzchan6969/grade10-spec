import { buttonVariants } from "@grade10/design-system/components/forms/button";
import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";
import { VISIT_INK_2, VISIT_INK_3 } from "./visit-tones";

type VisitMineCopy = {
  title: string;
  /** Who is signed in: `Signed in as {email}`. */
  signedIn?: string;
  notYou?: string;
  book: string;
  /** Under the button: whose visits these are. */
  note?: string;
};

type VisitMineProps = {
  copy: VisitMineCopy;
  /** Where Book a visit leads. */
  bookHref: string;
  /** The list, or what stands in for it while loading or empty. */
  children: ReactNode;
  /** Not you? signs out; without it the press is not drawn. */
  onNotYou?: () => void;
};

/**
 * My visits: the page's heading, who is signed in with Not you?, the
 * visits, Book a visit across the page and whose visits these are.
 */
function VisitMine({ copy, bookHref, children, onNotYou }: VisitMineProps) {
  return (
    <div className="flex flex-col gap-4 pt-5 pb-8" data-slot="visit-mine">
      <div className="flex flex-col gap-1">
        <h1 className="m-0 text-2xl leading-[30px] font-bold tracking-[-0.01em]">
          {copy.title}
        </h1>
        {copy.signedIn ? (
          <p
            className={cn(
              "m-0 flex flex-wrap items-center gap-x-2 text-sm leading-5",
              VISIT_INK_2,
            )}
          >
            <span>{copy.signedIn}</span>
            {onNotYou && copy.notYou ? (
              <button
                className="inline-flex min-h-11 cursor-pointer items-center bg-transparent p-0 font-semibold text-foreground underline underline-offset-3"
                onClick={onNotYou}
                type="button"
              >
                {copy.notYou}
              </button>
            ) : null}
          </p>
        ) : null}
      </div>
      {children}
      <a
        className={cn(
          buttonVariants({ size: "md" }),
          "h-11 w-full text-[15px] font-semibold [text-box-trim:none]",
        )}
        href={bookHref}
      >
        {copy.book}
      </a>
      {copy.note ? (
        <p className={cn("m-0 text-[13px] leading-[18px]", VISIT_INK_3)}>
          {copy.note}
        </p>
      ) : null}
    </div>
  );
}

export type { VisitMineCopy, VisitMineProps };
export { VisitMine };
