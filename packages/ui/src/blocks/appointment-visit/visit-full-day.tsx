import { Alert } from "@grade10/design-system/components/display/alert";
import { Link } from "@grade10/design-system/components/forms/link";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { CaretRight } from "@phosphor-icons/react";
import { useId } from "react";
import type { VisitFullDayShop } from "./types";

type VisitFullDayCopy = {
  /** Why the picked day offers nothing here: full, closed, or every time passed. */
  title: string;
  earliestEach: string;
  noFreeYet: string;
  /** Walking in today, drawn only when given. */
  walkIn?: { title: string; body: string; seeWait: string };
};

type VisitFullDayProps = {
  copy: VisitFullDayCopy;
  shops: readonly VisitFullDayShop[];
  /** The shop's wait page, linked under walking in. */
  waitHref?: string;
  /** Picks a shop's earliest time, by the shop's id. */
  onPick: (shopId: string) => void;
};

/** The picked day offers nothing here: the earliest time at each shop that
 * runs the service, each a press that picks it, and, today, walking in. */
function VisitFullDay({ copy, shops, waitHref, onPick }: VisitFullDayProps) {
  const headingId = useId();
  return (
    <div
      className="flex flex-col gap-3 rounded-xl bg-muted p-3.5"
      data-slot="booking-full-day"
    >
      <span className="text-sm leading-5 font-bold">
        {copy.title}
      </span>
      {/* biome-ignore lint/a11y/useSemanticElements: a group of presses under its line, not form controls */}
      <div
        aria-labelledby={headingId}
        className="flex flex-col gap-2"
        role="group"
      >
        <span
          className="text-[13px] leading-[18px] font-semibold text-(--gray-700)"
          id={headingId}
        >
          {copy.earliestEach}
        </span>
        {shops.map((shop) => (
          <button
            aria-label={`${shop.name} · ${shop.earliest ?? copy.noFreeYet}`}
            className="flex min-h-13 cursor-pointer items-center gap-2 rounded-lg bg-card px-3 py-1.5 text-left shadow-[inset_0_0_0_1px_var(--border-strong)] transition-[box-shadow] duration-100 outline-none hover:shadow-[inset_0_0_0_1px_var(--foreground)] focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:hover:shadow-[inset_0_0_0_1px_var(--border-strong)]"
            disabled={!shop.earliest}
            key={shop.id}
            onClick={() => shop.earliest && onPick(shop.id)}
            type="button"
          >
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-sm leading-5 font-semibold">
                {shop.name}
              </span>
              <span className="text-[13px] leading-[18px] text-(--gray-700) tabular-nums">
                {shop.earliest ?? copy.noFreeYet}
              </span>
            </span>
            <span aria-hidden className="inline-flex shrink-0">
              <CaretRight size={16} />
            </span>
          </button>
        ))}
        {copy.walkIn ? (
          <Alert
            description={
              <VStack gap="xs">
                <span>{copy.walkIn.body}</span>
                {waitHref ? (
                  <Link href={waitHref}>{copy.walkIn.seeWait}</Link>
                ) : null}
              </VStack>
            }
            dismissible={false}
            title={copy.walkIn.title}
          />
        ) : null}
      </div>
    </div>
  );
}

export type { VisitFullDayCopy, VisitFullDayProps };
export { VisitFullDay };
