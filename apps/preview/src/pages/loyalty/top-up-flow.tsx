import { toast } from "@grade10/design-system/components/overlays/toast";
import {
  TopUpConfirming as TopUpConfirmingBlock,
  TopUpPicker as TopUpPickerBlock,
  type TopUpPickerPack,
} from "@grade10/ui";
import { useEffect, useState } from "react";
import {
  packPrice,
  TOP_UP_COPY,
  TOP_UP_PACKS,
  TOP_UP_RESULT_COPY,
  type TopUpPack,
} from "./top-ups/top-ups-content";

const copy = TOP_UP_COPY;
const resultCopy = TOP_UP_RESULT_COPY;

const PICKER_COPY = {
  title: copy.title,
  subtitle: copy.subtitle,
  packsLegend: copy.packsLegend,
  unit: copy.packCardUnit,
  balance: copy.balanceLabel,
  balanceAfter: copy.selectedLabel,
  balanceTo: copy.selectedTo,
  continue: copy.continue,
  opening: copy.opening,
  secured: copy.paymentNote,
};

/** The stand-in packs in the member's words, as an app hands them over. */
function pickerPacks(
  balance: number,
  packDisabled?: (pack: TopUpPack) => boolean,
): TopUpPickerPack[] {
  return TOP_UP_PACKS.map((pack) => ({
    id: pack.id,
    pointsLabel: copy.packPoints(pack.points),
    priceLabel: copy.packPrice(packPrice(pack)),
    paidPointsLabel:
      pack.discountPercent > 0 ? copy.packPoints(packPrice(pack)) : undefined,
    bonusLabel:
      pack.discountPercent > 0
        ? copy.packBonus(pack.points - packPrice(pack))
        : undefined,
    unavailable: packDisabled?.(pack) ? copy.packOverLimit : undefined,
    payLabel: `Pay ${copy.pay(packPrice(pack))}`,
    balanceAfterLabel: copy.selectedAfter(balance + pack.points),
  }));
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

/** The store's `TopUpPicker` fed the preview's stand-in packs and words. */
function TopUpPicker({
  balance,
  onPay,
  packDisabled,
  ...props
}: TopUpPickerProps) {
  return (
    <TopUpPickerBlock
      {...props}
      balanceLabel={copy.selectedBefore(balance)}
      copy={PICKER_COPY}
      onPay={(id) => {
        const pack = TOP_UP_PACKS.find((candidate) => candidate.id === id);
        if (pack) onPay(pack);
      }}
      packs={pickerPacks(balance, packDisabled)}
    />
  );
}

/** The store's `TopUpConfirming` in the preview's words. */
function TopUpConfirming({ open }: { open: boolean }) {
  return <TopUpConfirmingBlock copy={resultCopy.confirming} open={open} />;
}

type TopUpResultState =
  | "confirming"
  | "added"
  | "still-confirming"
  | "not-completed";

type TopUpResultToastOptions = {
  /** The credited pack size and the balance it lands on, for "added". */
  addedPoints?: number;
  balanceAfter?: number;
  /** "Try again" on a top-up that never reached Stripe. */
  onRetry?: () => void;
};

/**
 * The settled outcome the member meets back on the page, as a toast:
 * credited, still unconfirmed after half a minute, or abandoned before
 * paying.
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
  if (state === "still-confirming") {
    toast.info(resultCopy.stillConfirming.title, {
      description: resultCopy.stillConfirming.description,
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
 * in, then the result as a toast on the page itself.
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
        topUpResultToast("added", {
          addedPoints: pack.points,
          balanceAfter: balance + pack.points,
        });
        onCredited(pack.points);
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
