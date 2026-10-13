import { Badge } from "@grade10/design-system/components/display/badge";
import { cn } from "@grade10/design-system/lib/utils";
import type { VisitTone } from "./types";
import { VISIT_INK_2, VISIT_TINT } from "./visit-tones";

type VisitPhaseHeaderCopy = {
  /** The badge's word for where it stands. */
  phase: string;
  /** The line beside the badge. */
  note?: string;
  title: string;
  /** The line under the title. */
  lede?: string;
};

type VisitPhaseHeaderProps = {
  copy: VisitPhaseHeaderCopy;
  tone: VisitTone;
  /** The title's heading level: the page's own heading unless it sits under one. */
  level?: 1 | 2;
};

/** Where a visit or a ticket stands, its heading and the line under it;
 * read out as it changes. */
function VisitPhaseHeader({ copy, tone, level = 1 }: VisitPhaseHeaderProps) {
  const Heading = level === 1 ? "h1" : "h2";
  return (
    <div
      aria-live="polite"
      className="flex flex-col gap-2.5"
      data-slot="phase-header"
    >
      <p className="m-0 flex flex-wrap items-center gap-x-2 gap-y-1.5">
        <Badge
          className={cn(VISIT_TINT[tone], "h-6 px-2.5 text-xs font-bold")}
          data-tone={tone}
        >
          {copy.phase}
        </Badge>
        {copy.note ? (
          <span
            className={cn("text-[13px] leading-5 tabular-nums", VISIT_INK_2)}
          >
            {copy.note}
          </span>
        ) : null}
      </p>
      <Heading className="m-0 text-2xl leading-[30px] font-bold tracking-[-0.01em] text-foreground">
        {copy.title}
      </Heading>
      {copy.lede ? (
        <p className={cn("m-0 text-[15px] leading-[22px]", VISIT_INK_2)}>
          {copy.lede}
        </p>
      ) : null}
    </div>
  );
}

export type { VisitPhaseHeaderCopy, VisitPhaseHeaderProps };
export { VisitPhaseHeader };
