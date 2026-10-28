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
import { TopUpPackCard } from "@grade10/ui";
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
 * The pack picker: a dialog from 640px up, a bottom drawer below, opening over
 * wherever buying points enters (today a stand-in for Membership). The member
 * picks a pack and continues to Stripe's checkout; a refusal on the way in is
 * a toast, never dialog content. A wireframe until the design lands.
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
    <>
      <RadioList
        aria-label={copy.packsLegend}
        className="[&_[data-slot=radio-list-label]]:sr-only"
        label={copy.packsLegend}
        onValueChange={(value) => setSelectedId(String(value))}
        value={selectedId ?? ""}
      >
        {TOP_UP_PACKS.map((pack) => (
          <TopUpPackCard
            copy={{
              unit: copy.packPointsSuffix,
              save:
                pack.discountPercent > 0
                  ? copy.packSave(pack.discountPercent)
                  : undefined,
              unavailable: copy.packOverLimit,
            }}
            disabled={packDisabled(pack)}
            key={pack.id}
            pointsLabel={copy.packPoints(pack.points)}
            priceLabel={copy.packPrice(packPrice(pack))}
            value={pack.id}
            wasPriceLabel={
              pack.discountPercent > 0
                ? copy.packWasPrice(pack.points)
                : undefined
            }
          />
        ))}
      </RadioList>
    </>
  );

  const footer = (
    <>
      {selectedPack ? (
        <Text as="p" size="sm">
          {copy.selectedLine(
            selectedPack.points,
            packPrice(selectedPack),
            MEMBER_BALANCE.total + selectedPack.points,
          )}
        </Text>
      ) : null}
      <Button
        className="w-full"
        disabled={!selectedPack}
        loading={busy}
        onClick={onContinue}
        size="lg"
      >
        {busy
          ? copy.opening
          : selectedPack
            ? `Pay ${copy.pay(packPrice(selectedPack))}`
            : copy.continue}
      </Button>
      <Text as="p" size="sm" tone="muted">
        {copy.paymentNote}
      </Text>
    </>
  );

  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-center gap-4 bg-muted p-4 sm:p-8">
      <Button className="w-fit" onClick={onTrigger} variant="secondary">
        {copy.title}
      </Button>
      <Toast position="bottom-right" />
      {smUp ? (
        <Dialog onOpenChange={setOpen} open={open}>
          <DialogContent className="max-w-(--container-md)">
            <DialogHeader>
              <DialogTitle>{copy.title}</DialogTitle>
              <DialogSubtext>
                {copy.balance(MEMBER_BALANCE.total)}
              </DialogSubtext>
            </DialogHeader>
            <DialogBody className="gap-4">{body}</DialogBody>
            <DialogFooter className="flex-col sm:flex-col sm:items-stretch">
              {footer}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer onOpenChange={setOpen} open={open} swipeDirection="down">
          <DrawerContent className="bg-popover backdrop-blur-none [--drawer-bleed-background:var(--popover)]">
            <DrawerHeader>
              <DrawerTitle className="text-xl">{copy.title}</DrawerTitle>
              <DrawerDescription>
                {copy.balance(MEMBER_BALANCE.total)}
              </DrawerDescription>
            </DrawerHeader>
            <DrawerBody className="gap-4">{body}</DrawerBody>
            <DrawerFooter>{footer}</DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}

export type { TopUpDialogState };
export { TopUpDialogPrototype };
