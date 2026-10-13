import { toast } from "@grade10/design-system/components/overlays/toast";
import { navigateToStory } from "../workbench-story-nav";
import { SIGN_IN_STORY_ID } from "./cart-content";
import { ACCOUNT_ASK_COPY, MEMBER_ASK_COPY } from "./order-confirmed-content";

/** The persistent toast carries the ask; one id swaps its states in place. */
const ORDER_ASK_TOAST = "order-account-prompt";

/**
 * The sign-in ask a signed-out order view shows — "add this order to your
 * account" on a guest order, "is this your order?" on a member's. A
 * signed-in view shows neither. One persistent toast, one Sign in action.
 */
function showOrderAskToast(kind: "guest" | "member") {
  const copy = kind === "guest" ? ACCOUNT_ASK_COPY : MEMBER_ASK_COPY;
  toast(copy.title, {
    description: copy.body,
    action: {
      label: copy.signIn,
      onClick: () => navigateToStory(SIGN_IN_STORY_ID),
    },
    id: ORDER_ASK_TOAST,
    duration: Infinity,
    closeButton: true,
  });
}

export { ORDER_ASK_TOAST, showOrderAskToast };
