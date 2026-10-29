import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { RadioList } from "@grade10/design-system/components/forms/radio-list";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogSubtext,
  DialogTitle,
} from "@grade10/design-system/components/overlays/dialog";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@grade10/design-system/components/overlays/drawer";
import { toast } from "@grade10/design-system/components/overlays/toast";
import { cn } from "@grade10/design-system/lib/utils";
import { TopUpPackCard } from "@grade10/ui";
import { ArrowRight, CircleNotch, ShieldCheck } from "@phosphor-icons/react";
import { type ReactNode, useEffect, useState } from "react";
import { MEMBERSHIP_STORY_ID, storyHref } from "../workbench-story-nav";
import {
  packPrice,
  REVIEW_THRESHOLD,
  TOP_UP_COPY,
  TOP_UP_PACKS,
  TOP_UP_RESULT_COPY,
  type TopUpPack,
  UNDER_REVIEW_REFERENCE,
} from "./top-ups/top-ups-content";

const copy = TOP_UP_COPY;
const resultCopy = TOP_UP_RESULT_COPY;

/** Reads the 640px line — the top-up surfaces swap across it: a bottom
 * drawer below, a floating dialog up. */
const SM_UP_MQ = "(min-width: 640px)";
function useSmUp() {
  const [smUp, setSmUp] = useState(
    () => typeof window === "undefined" || window.matchMedia(SM_UP_MQ).matches,
  );
  useEffect(() => {
    const media = window.matchMedia(SM_UP_MQ);
    const onChange = () => setSmUp(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);
  return smUp;
}

type TopUpPickerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The member's balance, read beside the button until a pack is picked. */
  balance: number;
  /** Checkout is opening — the button shows the wait and refuses repeats. */
  busy: boolean;
  onPay: (pack: TopUpPack) => void;
  defaultPackId?: string | null;
  packDisabled?: (pack: TopUpPack) => boolean;
};

/**
 * The pack picker (Figma `7530:6163` large, `7536:2248` small): a dialog from
 * 640px up, a bottom drawer below. The member picks a pack and continues to
 * Stripe's checkout; the host owns what `onPay` does.
 */
function TopUpPicker({
  open,
  onOpenChange,
  balance,
  busy,
  onPay,
  defaultPackId,
  packDisabled,
}: TopUpPickerProps) {
  const [selectedId, setSelectedId] = useState<string | null>(
    defaultPackId ?? null,
  );
  const smUp = useSmUp();

  const selectedPack =
    TOP_UP_PACKS.find((pack) => pack.id === selectedId) ?? null;

  const body = (
    <RadioList
      aria-label={copy.packsLegend}
      className={cn(
        "[&_[data-slot=radio-list-label]]:sr-only",
        smUp &&
          "[&_[data-slot=radio-list-items]]:grid [&_[data-slot=radio-list-items]]:grid-cols-3 [&_[data-slot=radio-list-items]]:items-stretch",
      )}
      label={copy.packsLegend}
      onValueChange={(value) => setSelectedId(String(value))}
      value={selectedId ?? ""}
    >
      {TOP_UP_PACKS.map((pack) => (
        <TopUpPackCard
          bonusLabel={
            pack.discountPercent > 0
              ? copy.packBonus(pack.points - packPrice(pack))
              : undefined
          }
          copy={{
            unit: copy.packCardUnit,
            unavailable: copy.packOverLimit,
          }}
          disabled={packDisabled?.(pack) ?? false}
          key={pack.id}
          paidPointsLabel={
            pack.discountPercent > 0
              ? copy.packPoints(packPrice(pack))
              : undefined
          }
          pointsLabel={copy.packPoints(pack.points)}
          priceLabel={copy.packPrice(packPrice(pack))}
          value={pack.id}
          viewport={smUp ? "large" : "small"}
        />
      ))}
    </RadioList>
  );

  const payButton = (
    <Button
      className={smUp ? undefined : "w-full"}
      disabled={!selectedPack}
      loading={busy}
      onClick={() => {
        if (selectedPack) onPay(selectedPack);
      }}
      size="md"
    >
      {busy
        ? copy.opening
        : selectedPack
          ? `Pay ${copy.pay(packPrice(selectedPack))}`
          : copy.continue}
    </Button>
  );

  const secureNote = (
    <Text
      as="p"
      className={cn("flex items-center gap-1", !smUp && "justify-center")}
      size="xs"
      tone="secondary"
    >
      <ShieldCheck aria-hidden size={12} />
      {copy.paymentNote}
    </Text>
  );

  return smUp ? (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-136">
        <DialogHeader>
          <DialogTitle>{copy.title}</DialogTitle>
          <DialogSubtext>{copy.subtitle}</DialogSubtext>
        </DialogHeader>
        <DialogBody className="gap-4">{body}</DialogBody>
        <DialogFooter className="sm:justify-between">
          <span className="flex flex-col">
            <Text as="span" size="xs" tone="secondary">
              {selectedPack ? copy.selectedLabel : copy.balanceLabel}
            </Text>
            <span className="flex items-center gap-1 text-sm font-medium text-foreground">
              <span className="tabular-nums">
                {copy.selectedBefore(balance)}
              </span>
              {selectedPack ? (
                <>
                  <ArrowRight aria-hidden size={14} />
                  <span className="sr-only">{copy.selectedTo}</span>
                  <span className="tabular-nums">
                    {copy.selectedAfter(balance + selectedPack.points)}
                  </span>
                </>
              ) : null}
            </span>
          </span>
          <div className="ml-auto flex items-center gap-2">
            {secureNote}
            {payButton}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer onOpenChange={onOpenChange} open={open} swipeDirection="down">
      <DrawerContent className="bg-popover backdrop-blur-none [--drawer-bleed-background:var(--popover)]">
        <DrawerHeader>
          <DrawerTitle className="text-lg leading-7">{copy.title}</DrawerTitle>
          <DrawerDescription>{copy.subtitle}</DrawerDescription>
        </DrawerHeader>
        <DrawerBody className="gap-4">{body}</DrawerBody>
        <DrawerFooter>
          {payButton}
          {secureNote}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

type TopUpResultState =
  | "confirming"
  | "added"
  | "under-review"
  | "not-approved"
  | "not-completed";

type TopUpConfirmingProps = {
  open: boolean;
};

/** The wait while Stripe's hosted checkout answers — a modal that cannot
 * be dismissed while it runs: a dialog from 640px up, a bottom drawer
 * below. Every settled outcome leaves it and answers as a toast instead. */
function TopUpConfirming({ open }: TopUpConfirmingProps) {
  const smUp = useSmUp();
  const titleClass =
    "w-full text-center font-heading text-xl font-semibold tracking-tight text-balance";
  const panel = (title: ReactNode) => (
    <div aria-live="polite" role="status">
      <div className="mx-auto flex w-full flex-col items-center gap-1.5 py-2 text-center">
        <div className="mb-2.5 inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-muted">
          <span aria-hidden className="inline-flex animate-spin">
            <CircleNotch size={24} weight="regular" />
          </span>
        </div>
        {title}
        <Text className="text-balance text-secondary-foreground" size="sm">
          {resultCopy.confirming.description}
        </Text>
      </div>
    </div>
  );

  return smUp ? (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogBody className="items-center">
          {panel(
            <DialogTitle className={titleClass}>
              {resultCopy.confirming.title}
            </DialogTitle>,
          )}
        </DialogBody>
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer open={open} swipeDirection="down">
      <DrawerContent className="bg-popover backdrop-blur-none [--drawer-bleed-background:var(--popover)]">
        <DrawerBody className="items-center">
          {panel(
            <DrawerTitle className={titleClass}>
              {resultCopy.confirming.title}
            </DrawerTitle>,
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

type TopUpResultToastOptions = {
  /** The credited pack size and the balance it lands on, for "added". */
  addedPoints?: number;
  balanceAfter?: number;
  /** Where a held top-up's history lives. */
  historyHref?: string;
  /** "Try again" on a top-up that never reached Stripe. */
  onRetry?: () => void;
};

/**
 * The settled outcome the member meets back on the page, as a toast:
 * credited under the review threshold, held for an operator above it,
 * refused by the review, or abandoned before paying.
 */
function topUpResultToast(
  state: Exclude<TopUpResultState, "confirming">,
  options: TopUpResultToastOptions = {},
) {
  if (state === "added") {
    toast.success(resultCopy.added.title(options.addedPoints ?? 0), {
      description: resultCopy.added.balance(options.balanceAfter ?? 0),
    });
    return;
  }
  if (state === "under-review") {
    toast.info(resultCopy.underReview.title, {
      action: options.historyHref
        ? {
            label: resultCopy.underReview.history,
            onClick: () => {
              window.location.href = options.historyHref as string;
            },
          }
        : undefined,
      description: `${resultCopy.underReview.description} ${resultCopy.underReview.reference(UNDER_REVIEW_REFERENCE)}`,
    });
    return;
  }
  if (state === "not-approved") {
    toast.error(resultCopy.notApproved.title, {
      description: resultCopy.notApproved.description,
    });
    return;
  }
  toast.warning(resultCopy.notCompleted.title, {
    action: options.onRetry
      ? { label: resultCopy.notCompleted.retry, onClick: options.onRetry }
      : undefined,
    description: resultCopy.notCompleted.description,
  });
}

type TopUpFlowProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The member's balance; a credited pack raises it through `onCredited`. */
  balance: number;
  onCredited: (points: number) => void;
};

/**
 * The whole buy-a-pack journey in place over the screen that opened it: the
 * pack picker, the confirming wait while Stripe's hosted checkout stands
 * in, then the result as a toast — credited under the review threshold,
 * held for an operator above it. The toast lands on the page itself.
 */
function TopUpFlow({
  open,
  onOpenChange,
  balance,
  onCredited,
}: TopUpFlowProps) {
  const [hasOpened, setHasOpened] = useState(open);
  const [phase, setPhase] = useState<"picker" | "confirming" | "done">(
    "picker",
  );
  const [busy, setBusy] = useState(false);

  /* Reopening restarts the pick; the surfaces stay mounted once opened so
   * the dialog and drawer can play their exit transitions. */
  useEffect(() => {
    if (open) {
      setHasOpened(true);
      setPhase("picker");
      setBusy(false);
    }
  }, [open]);

  const pay = (pack: TopUpPack) => {
    if (busy) return;
    setBusy(true);
    /* The stand-in for Stripe's hosted checkout round-trip: a beat of
     * "Redirecting…", the confirming wait, then the result Stripe sends the
     * member back to. */
    window.setTimeout(() => {
      setPhase("confirming");
      setBusy(false);
      window.setTimeout(() => {
        setPhase("done");
        onOpenChange(false);
        if (pack.points > REVIEW_THRESHOLD) {
          topUpResultToast("under-review", {
            historyHref: `${storyHref(MEMBERSHIP_STORY_ID)}&tab=points`,
          });
        } else {
          topUpResultToast("added", {
            addedPoints: pack.points,
            balanceAfter: balance + pack.points,
          });
          onCredited(pack.points);
        }
      }, 1200);
    }, 600);
  };

  if (!hasOpened) return null;

  const close = () => onOpenChange(false);

  /* Only the active phase's surface mounts: each backdrop pins document
   * scroll for its lifetime, so mounting two at once lets the second capture
   * "hidden" as the scroll it restores — leaving the page locked after it
   * closes. Swapping surfaces releases one lock before the next is taken. */
  if (phase === "picker") {
    return (
      <TopUpPicker
        balance={balance}
        busy={busy}
        onOpenChange={(next) => {
          if (!next) close();
        }}
        onPay={pay}
        open={open}
      />
    );
  }
  if (phase === "confirming") {
    return <TopUpConfirming open={open} />;
  }
  return null;
}

export type { TopUpResultState };
export { TopUpConfirming, TopUpFlow, TopUpPicker, topUpResultToast };
