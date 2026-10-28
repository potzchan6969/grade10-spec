import {
  MEMBERSHIP_STORY_ID,
  navigateToStory,
  storyHref,
} from "../../workbench-story-nav";

import { TopUpResult, type TopUpResultState } from "../top-up-flow";
import { TOP_UP_COPY } from "./top-ups-content";
import { TopUpsBreadcrumbs, TopUpsPageShell } from "./top-ups-shared";

/** Back to the pack picker the member came from. */
const TOP_UP_DIALOG_STORY_ID = "loyalty-top-ups-screens-top-up-dialog--default";

/** Top-Up History, where a held top-up shows until a Grade10 email exists. */
const TOP_UP_HISTORY_STORY_ID =
  "loyalty-top-ups-screens-top-up-history--default";

const TOP_UP_HISTORY_HREF = storyHref(TOP_UP_HISTORY_STORY_ID);

const backToMembership = () => navigateToStory(MEMBERSHIP_STORY_ID);

/**
 * Where the member lands back from Stripe's hosted checkout — the same
 * result modal `TopUpFlow` hosts, on the page shell the standalone states
 * draw under it. Dismissing it returns to Membership. A wireframe until the
 * design lands.
 */
function TopUpResultPrototype({ state }: { state: TopUpResultState }) {
  return (
    <TopUpsPageShell>
      <TopUpsBreadcrumbs current={TOP_UP_COPY.title} />
      <TopUpResult
        addedPoints={1000}
        balanceAfter={2200}
        historyHref={TOP_UP_HISTORY_HREF}
        onBack={backToMembership}
        onDismiss={backToMembership}
        onRetry={() => navigateToStory(TOP_UP_DIALOG_STORY_ID)}
        open
        state={state}
      />
    </TopUpsPageShell>
  );
}

export type { TopUpResultState };
export { TopUpResultPrototype };
