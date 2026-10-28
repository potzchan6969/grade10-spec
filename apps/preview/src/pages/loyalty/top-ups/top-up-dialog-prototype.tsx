import { Button } from "@grade10/design-system/components/forms/button";
import { Toast, toast } from "@grade10/design-system/components/overlays/toast";
import { useState } from "react";
import { navigateToStory } from "../../workbench-story-nav";
import { TopUpPicker } from "../top-up-flow";
import {
  LEFT_TODAY,
  MEMBER_BALANCE,
  REVIEW_THRESHOLD,
  TOP_UP_COPY,
  type TopUpPack,
} from "./top-ups-content";

/** Result modals the member returns to once Stripe's hosted checkout is done.
 * These story navigations stand in for the external checkout round-trip:
 * Pay leaves for Stripe, and these are where Stripe sends the member back. */
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
 * The pack picker on its stand-in page — the same surface Membership hosts
 * through `TopUpFlow`, kept here so every refusal state can be drawn. A
 * refusal on the way in is a toast, never dialog content.
 */
function TopUpDialogPrototype({ state }: { state: TopUpDialogState }) {
  const refused =
    state === "limit-reached" || state === "paused" || state === "unavailable";
  const [open, setOpen] = useState(!refused);
  const [busy, setBusy] = useState(state === "opening");

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

  const onContinue = (selectedPack: TopUpPack) => {
    if (busy) return;
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

  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-center gap-4 bg-muted p-4 sm:p-8">
      <Button className="w-fit" onClick={onTrigger} variant="secondary">
        {copy.title}
      </Button>
      <Toast position="bottom-right" />
      <TopUpPicker
        balance={MEMBER_BALANCE.total}
        busy={busy}
        defaultPackId={state === "opening" ? PRESET_PACK_ID : null}
        onOpenChange={setOpen}
        onPay={onContinue}
        open={open}
        packDisabled={packDisabled}
      />
    </div>
  );
}

export type { TopUpDialogState };
export { TopUpDialogPrototype };
