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
import { cn } from "@grade10/design-system/lib/utils";
import { TopUpPackCard } from "@grade10/ui";
import {
  ArrowRight,
  CheckCircle,
  CircleNotch,
  HourglassMedium,
  ShieldCheck,
  WarningCircle,
  XCircle,
} from "@phosphor-icons/react";
import { type ReactNode, useEffect, useState } from "react";
import { storyHref } from "../workbench-story-nav";
import {
  packPrice,
  REVIEW_THRESHOLD,
  TOP_UP_COPY,
  TOP_UP_PACKS,
  TOP_UP_RESULT_COPY,
  type TopUpPack,
  UNDER_REVIEW_REFERENCE,
} from "./top-ups/top-ups-content";

/** Top-Up History, where a held top-up shows until a Grade10 email exists. */
const TOP_UP_HISTORY_STORY_ID =
  "loyalty-top-ups-screens-top-up-history--default";

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

type ResultContent = {
  wellClass: string;
  icon: ReactNode;
  /** The outcome line; also the modal's accessible name. */
  title: string;
  description: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
  /** Still settling — the modal cannot be dismissed while it runs. */
  live?: boolean;
};

type TopUpResultProps = {
  state: TopUpResultState;
  open: boolean;
  /** The member closed the modal. */
  onDismiss: () => void;
  /** "Back to Membership". */
  onBack: () => void;
  /** "Try again" on a top-up that never reached Stripe. */
  onRetry: () => void;
  /** Where a held top-up's history lives. */
  historyHref: string;
  /** The credited pack size and the balance it lands on, for "added". */
  addedPoints?: number;
  balanceAfter?: number;
};

/** Everything a result says, before the surface it says it on. */
function resultContent(
  state: TopUpResultState,
  props: TopUpResultProps,
): ResultContent {
  if (state === "confirming") {
    return {
      description: resultCopy.confirming.description,
      icon: (
        <span aria-hidden className="inline-flex animate-spin">
          <CircleNotch size={24} weight="regular" />
        </span>
      ),
      live: true,
      title: resultCopy.confirming.title,
      wellClass: "bg-muted",
    };
  }

  if (state === "added") {
    return {
      actions: (
        <Button onClick={props.onBack} size="md">
          {resultCopy.backToMembership}
        </Button>
      ),
      description: resultCopy.added.balance(props.balanceAfter ?? 0),
      icon: (
        <CheckCircle
          aria-hidden
          color="var(--success)"
          size={24}
          weight="regular"
        />
      ),
      title: resultCopy.added.title(props.addedPoints ?? 0),
      wellClass: "bg-success/10",
    };
  }

  if (state === "under-review") {
    return {
      actions: (
        <Button render={<a href={props.historyHref} />} size="md">
          {resultCopy.underReview.history}
        </Button>
      ),
      description: resultCopy.underReview.description,
      icon: (
        <HourglassMedium
          aria-hidden
          color="var(--secondary-foreground)"
          size={24}
          weight="regular"
        />
      ),
      meta: resultCopy.underReview.reference(UNDER_REVIEW_REFERENCE),
      title: resultCopy.underReview.title,
      wellClass: "bg-muted",
    };
  }

  if (state === "not-approved") {
    return {
      actions: (
        <Button onClick={props.onBack} size="md">
          {resultCopy.backToMembership}
        </Button>
      ),
      description: resultCopy.notApproved.description,
      icon: (
        <XCircle
          aria-hidden
          color="var(--destructive)"
          size={24}
          weight="regular"
        />
      ),
      title: resultCopy.notApproved.title,
      wellClass: "bg-destructive/10",
    };
  }

  return {
    actions: (
      <>
        <Button onClick={props.onRetry} size="md">
          {resultCopy.notCompleted.retry}
        </Button>
        <Button onClick={props.onBack} size="md" variant="outline">
          {resultCopy.backToMembership}
        </Button>
      </>
    ),
    description: resultCopy.notCompleted.description,
    icon: (
      <WarningCircle
        aria-hidden
        color="var(--warning)"
        size={24}
        weight="regular"
      />
    ),
    title: resultCopy.notCompleted.title,
    wellClass: "bg-warning/10",
  };
}

/** One centred result: a tinted icon well, the title (the modal's own title
 * element, so it names the surface), one description line, an optional muted
 * meta line and the actions. */
function ResultPanel({
  wellClass,
  icon,
  title,
  description,
  meta,
  actions,
}: Omit<ResultContent, "title" | "live"> & { title: ReactNode }) {
  return (
    <div className="mx-auto flex w-full flex-col items-center gap-1.5 py-2 text-center">
      <div
        className={`mb-2.5 inline-flex size-12 shrink-0 items-center justify-center rounded-full ${wellClass}`}
      >
        {icon}
      </div>
      {title}
      <Text className="text-balance text-secondary-foreground" size="sm">
        {description}
      </Text>
      {meta ? (
        <Text size="xs" tone="muted">
          {meta}
        </Text>
      ) : null}
      {actions ? (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {actions}
        </div>
      ) : null}
    </div>
  );
}

/**
 * Where the member lands back from Stripe's hosted checkout — confirmed,
 * credited, held for review, rejected or abandoned — as a modal over the
 * page they left: a dialog from 640px up, a bottom drawer below.
 */
function TopUpResult(props: TopUpResultProps) {
  const smUp = useSmUp();
  const content = resultContent(props.state, props);

  const onOpenChange = (open: boolean) => {
    if (!open && !content.live) props.onDismiss();
  };

  const titleClass =
    "w-full text-center font-heading text-xl font-semibold tracking-tight text-balance";
  const panel = (title: ReactNode) => {
    const body = <ResultPanel {...content} title={title} />;
    return content.live ? (
      <div aria-live="polite" role="status">
        {body}
      </div>
    ) : (
      body
    );
  };

  return smUp ? (
    <Dialog onOpenChange={onOpenChange} open={props.open}>
      <DialogContent className="sm:max-w-md" showCloseButton={!content.live}>
        <DialogBody className="items-center">
          {panel(
            <DialogTitle className={titleClass}>{content.title}</DialogTitle>,
          )}
        </DialogBody>
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer onOpenChange={onOpenChange} open={props.open} swipeDirection="down">
      <DrawerContent className="bg-popover backdrop-blur-none [--drawer-bleed-background:var(--popover)]">
        <DrawerBody className="items-center">
          {panel(
            <DrawerTitle className={titleClass}>{content.title}</DrawerTitle>,
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
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
 * pack picker, the wait while Stripe's hosted checkout stands in, then the
 * result modal — credited under the review threshold, held for an operator
 * above it. Dismissing the result returns to the screen.
 */
function TopUpFlow({
  open,
  onOpenChange,
  balance,
  onCredited,
}: TopUpFlowProps) {
  const [hasOpened, setHasOpened] = useState(open);
  const [phase, setPhase] = useState<"picker" | "result">("picker");
  const [result, setResult] = useState<"confirming" | "added" | "under-review">(
    "confirming",
  );
  const [busy, setBusy] = useState(false);
  const [bought, setBought] = useState<TopUpPack | null>(null);

  /* Reopening restarts the pick; the surfaces stay mounted once opened so
   * the dialog and drawer can play their exit transitions. */
  useEffect(() => {
    if (open) {
      setHasOpened(true);
      setPhase("picker");
      setResult("confirming");
      setBusy(false);
      setBought(null);
    }
  }, [open]);

  const pay = (pack: TopUpPack) => {
    if (busy) return;
    setBusy(true);
    /* The stand-in for Stripe's hosted checkout round-trip: a beat of
     * "Redirecting…", the confirming wait, then the result Stripe sends the
     * member back to. */
    window.setTimeout(() => {
      setBought(pack);
      setPhase("result");
      setResult("confirming");
      setBusy(false);
      window.setTimeout(() => {
        if (pack.points > REVIEW_THRESHOLD) {
          setResult("under-review");
        } else {
          setResult("added");
          onCredited(pack.points);
        }
      }, 1200);
    }, 600);
  };

  if (!hasOpened) return null;

  const close = () => onOpenChange(false);

  /* Only the active phase's surface mounts: the picker and result backdrops
   * each pin document scroll for their lifetime, so mounting both at once
   * lets the second capture "hidden" as the scroll it restores — leaving the
   * page locked after the result closes. Swapping surfaces releases the
   * picker's lock before the result's is taken. */
  return phase === "picker" ? (
    <TopUpPicker
      balance={balance}
      busy={busy}
      onOpenChange={(next) => {
        if (!next) close();
      }}
      onPay={pay}
      open={open}
    />
  ) : (
    <TopUpResult
      addedPoints={bought?.points}
      balanceAfter={balance}
      historyHref={storyHref(TOP_UP_HISTORY_STORY_ID)}
      onBack={close}
      onDismiss={close}
      onRetry={() => setPhase("picker")}
      open={open}
      state={result}
    />
  );
}

export type { TopUpResultState };
export { TopUpFlow, TopUpPicker, TopUpResult };
