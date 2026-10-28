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
import { Toast, toast } from "@grade10/design-system/components/overlays/toast";
import { cn } from "@grade10/design-system/lib/utils";
import { TopUpPackCard } from "@grade10/ui";
import { ArrowRight, ShieldCheck } from "@phosphor-icons/react";
import { useState } from "react";
import { navigateToStory } from "../../workbench-story-nav";
import {
  LEFT_TODAY,
  MEMBER_BALANCE,
  packPrice,
  REVIEW_THRESHOLD,
  TOP_UP_COPY,
  TOP_UP_PACKS,
  type TopUpPack,
} from "./top-ups-content";
import { useSmUp } from "./top-ups-shared";

/** Result screens the member lands on once Stripe's checkout is done. */
const POINTS_ADDED_STORY_ID =
  "loyalty-top-ups-screens-top-up-result--points-added";
const UNDER_REVIEW_STORY_ID =
  "loyalty-top-ups-screens-top-up-result--under-review";

/** Pack pre-selected in the state a member reaches after submitting. */
const PRESET_PACK_ID = "pack-10k";

type TopUpDialogState =
  | "default"
  | "opening"
  | "limit-almost-reached"
  | "checkout-not-opened"
  | "limit-reached"
  | "paused"
  | "unavailable";

const copy = TOP_UP_COPY;

/**
 * The pack picker (Figma `7530:6163` large, `7536:2248` small): a dialog from
 * 640px up, a bottom drawer below, opening over wherever buying points enters
 * (today a stand-in for Membership). The member picks a pack and continues to
 * Stripe's checkout; a refusal on the way in is a toast, never dialog content.
 */
function TopUpDialogPrototype({ state }: { state: TopUpDialogState }) {
  const refused =
    state === "limit-reached" || state === "paused" || state === "unavailable";
  const [open, setOpen] = useState(!refused);
  const [selectedId, setSelectedId] = useState<string | null>(
    state === "opening" ? PRESET_PACK_ID : null,
  );
  const [busy, setBusy] = useState(state === "opening");
  const smUp = useSmUp();

  const selectedPack =
    TOP_UP_PACKS.find((pack) => pack.id === selectedId) ?? null;
  const packDisabled = (pack: TopUpPack) =>
    state === "limit-almost-reached" && pack.points > LEFT_TODAY;

  const onTrigger = () => {
    if (state === "limit-reached") {
      toast.warning(copy.limitReached.title, {
        description: copy.limitReached.description,
      });
      return;
    }
    if (state === "paused") {
      toast.warning(copy.paused.title, {
        description: copy.paused.description,
      });
      return;
    }
    if (state === "unavailable") {
      toast.warning(copy.unavailable.title, {
        description: copy.unavailable.description,
      });
      return;
    }
    setOpen(true);
  };

  const onContinue = () => {
    if (!selectedPack || busy) return;
    setBusy(true);
    window.setTimeout(() => {
      if (state === "checkout-not-opened") {
        setBusy(false);
        toast.error(copy.notOpened.title, {
          description: copy.notOpened.description,
        });
        return;
      }
      navigateToStory(
        selectedPack.points > REVIEW_THRESHOLD
          ? UNDER_REVIEW_STORY_ID
          : POINTS_ADDED_STORY_ID,
      );
    }, 600);
  };

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
          disabled={packDisabled(pack)}
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
      onClick={onContinue}
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

  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-center gap-4 bg-muted p-4 sm:p-8">
      <Button className="w-fit" onClick={onTrigger} variant="secondary">
        {copy.title}
      </Button>
      <Toast position="bottom-right" />
      {smUp ? (
        <Dialog onOpenChange={setOpen} open={open}>
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
                    {copy.selectedBefore(MEMBER_BALANCE.total)}
                  </span>
                  {selectedPack ? (
                    <>
                      <ArrowRight aria-hidden size={14} />
                      <span className="sr-only">{copy.selectedTo}</span>
                      <span className="tabular-nums">
                        {copy.selectedAfter(
                          MEMBER_BALANCE.total + selectedPack.points,
                        )}
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
        <Drawer onOpenChange={setOpen} open={open} swipeDirection="down">
          <DrawerContent className="bg-popover backdrop-blur-none [--drawer-bleed-background:var(--popover)]">
            <DrawerHeader>
              <DrawerTitle className="text-lg leading-7">
                {copy.title}
              </DrawerTitle>
              <DrawerDescription>{copy.subtitle}</DrawerDescription>
            </DrawerHeader>
            <DrawerBody className="gap-4">{body}</DrawerBody>
            <DrawerFooter>
              {payButton}
              {secureNote}
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}

export type { TopUpDialogState };
export { TopUpDialogPrototype };
