import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";
import { useId } from "react";
import { INK_2 } from "../appointment-booking/booking-look";
import type { VisitFact } from "./types";
import { VISIT_INK_3 } from "./visit-tones";

type VisitFactsCopy = { title: string };

type VisitFactsProps = {
  copy: VisitFactsCopy;
  facts: readonly VisitFact[];
};

/** A titled part of the visit page: its heading above, its body below, read
 * as a region named by the heading. */
function VisitSection({
  title,
  slot,
  children,
}: {
  title: string;
  slot: string;
  children: ReactNode;
}) {
  const id = useId();
  return (
    <section
      aria-labelledby={id}
      className="flex flex-col gap-2.5"
      data-slot={slot}
    >
      <h2 className="m-0 text-base leading-[22px] font-bold" id={id}>
        {title}
      </h2>
      {children}
    </section>
  );
}

/** Your visit: when, where, what, for whom, and how to reach the shop, label
 * beside value in one bordered list. */
function VisitFacts({ copy, facts }: VisitFactsProps) {
  return (
    <VisitSection slot="visit-facts" title={copy.title}>
      <dl className="m-0 flex flex-col rounded-xl border border-border">
        {facts.map((fact, at) => (
          <div
            className={cn(
              "grid grid-cols-[96px_minmax(0,1fr)] gap-3 px-3.5 py-[11px]",
              at > 0 && "border-t border-border",
            )}
            key={fact.label}
          >
            <dt className={cn("text-[13px] leading-5", VISIT_INK_3)}>
              {fact.label}
            </dt>
            <dd className="m-0 flex min-w-0 flex-col gap-0.5">
              <span
                className={cn(
                  "text-sm leading-5 font-semibold tabular-nums",
                  fact.mono && "font-mono tracking-[0.04em]",
                  fact.struck && cn("line-through", VISIT_INK_3),
                )}
              >
                {fact.value}
              </span>
              {fact.sub ? (
                <span className={cn("text-[13px] leading-[18px]", INK_2)}>
                  {fact.sub}
                </span>
              ) : null}
            </dd>
          </div>
        ))}
      </dl>
    </VisitSection>
  );
}

export type { VisitFactsCopy, VisitFactsProps };
export { VisitFacts, VisitSection };
