import { Text } from "@grade10/design-system/components/display/text";
import { buttonVariants } from "@grade10/design-system/components/forms/button";
import { cn } from "@grade10/design-system/lib/utils";
import { CircleNotch } from "@phosphor-icons/react";
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
  /** Not you? is signing out: it spins, stays focusable and takes no press. */
  notYouPending?: boolean;
  /** Why the sign-out was refused, said under who is signed in. */
  notYouFailed?: string;
};

/**
 * My visits: the page's heading, who is signed in with Not you?, the
 * visits, Book a visit across the page and whose visits these are.
 */
function VisitMine({
  copy,
  bookHref,
  children,
  onNotYou,
  notYouPending = false,
  notYouFailed,
}: VisitMineProps) {
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
                aria-busy={notYouPending || undefined}
                aria-disabled={notYouPending || undefined}
                className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 bg-transparent p-0 font-semibold text-foreground underline underline-offset-3 aria-disabled:cursor-default"
                onClick={notYouPending ? undefined : onNotYou}
                type="button"
              >
                {copy.notYou}
                {notYouPending ? (
                  <span aria-hidden className="inline-flex animate-spin">
                    <CircleNotch size={14} />
                  </span>
                ) : null}
              </button>
            ) : null}
          </p>
        ) : null}
        {notYouFailed ? (
          <Text as="p" role="alert" size="sm" tone="error">
            {notYouFailed}
          </Text>
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
