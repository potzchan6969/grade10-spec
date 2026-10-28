import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { RadioCard } from "@grade10/design-system/components/forms/radio-card";
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
const POINTS_ADDED_STORY_ID = "loyalty-top-ups-parts-topupresult--points-added";
const UNDER_REVIEW_STORY_ID = "loyalty-top-ups-parts-topupresult--under-review";

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

/** One pack row: points big, the price, a struck list price and a save badge
 * when discounted, and why it cannot be picked when it cannot. */
function PackTile({ disabled, pack }: { disabled: boolean; pack: TopUpPack }) {
  return (
    <RadioCard
      disabled={disabled}
      title={
        <span className="flex items-baseline gap-1.5">
          <span className="text-xl font-semibold tracking-tight">
            {copy.packPoints(pack.points)}
          </span>
          <span className="font-normal text-secondary-foreground">
            {copy.packPointsSuffix}
          </span>
        </span>
      }
      description={
        <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-medium text-foreground">
            {copy.packPrice(packPrice(pack))}
          </span>
          {pack.discountPercent > 0 ? (
            <>
              <s>{copy.packWasPrice(pack.points)}</s>
              <Badge size="sm" variant="success">
                {copy.packSave(pack.discountPercent)}
              </Badge>
            </>
          ) : null}
          {disabled ? (
            <span className="w-full">{copy.packOverLimit}</span>
          ) : null}
        </span>
      }
      value={pack.id}
    />
  );
}

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
      {state === "limit-almost-reached" ? (
        <Text as="p" size="sm" tone="muted">
          {copy.limitLeft(LEFT_TODAY)}
        </Text>
      ) : null}
      <RadioList
        aria-label={copy.packsLegend}
        className="[&_[data-slot=radio-list-label]]:sr-only"
        label={copy.packsLegend}
        onValueChange={(value) => setSelectedId(String(value))}
        value={selectedId ?? ""}
      >
        {TOP_UP_PACKS.map((pack) => (
          <PackTile disabled={packDisabled(pack)} key={pack.id} pack={pack} />
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
        {busy ? copy.opening : copy.continue}
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
      <Toast position="bottom-center" />
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
