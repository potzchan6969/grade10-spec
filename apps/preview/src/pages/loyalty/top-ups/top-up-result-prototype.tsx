import { Toast } from "@grade10/design-system/components/overlays/toast";
import { useEffect } from "react";
import {
  MEMBERSHIP_STORY_ID,
  navigateToStory,
  storyHref,
} from "../../workbench-story-nav";

import {
  TopUpConfirming,
  type TopUpResultState,
  topUpResultToast,
} from "../top-up-flow";
import { TOP_UP_COPY } from "./top-ups-content";
import { TopUpsBreadcrumbs, TopUpsPageShell } from "./top-ups-shared";

/** Back to the pack picker the member came from. */
const TOP_UP_DIALOG_STORY_ID = "loyalty-top-ups-screens-top-up-dialog--default";

/**
 * Where the member lands back from Stripe's hosted checkout — the
 * confirming modal `TopUpFlow` hosts while the payment settles, then the
 * outcome as a toast on the page they left. A wireframe until the design
 * lands.
 */
function TopUpResultPrototype({ state }: { state: TopUpResultState }) {
  useEffect(() => {
    if (state === "confirming") return;
    topUpResultToast(state, {
      addedPoints: 1000,
      balanceAfter: 2200,
      historyHref: storyHref(MEMBERSHIP_STORY_ID),
      onRetry: () => navigateToStory(TOP_UP_DIALOG_STORY_ID),
    });
  }, [state]);
  return (
    <TopUpsPageShell>
      <TopUpsBreadcrumbs current={TOP_UP_COPY.title} />
      {state === "confirming" ? <TopUpConfirming open /> : null}
      <Toast position="bottom-right" />
    </TopUpsPageShell>
  );
}

export type { TopUpResultState };
export { TopUpResultPrototype };
