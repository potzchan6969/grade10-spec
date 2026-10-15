import { toast } from "@grade10/design-system/components/overlays/toast";
import {
  navigateToStory,
  ORDER_DETAILS_STORY_ID,
} from "../workbench-story-nav";
import { SIGN_IN_STORY_ID } from "./cart-content";
import {
  ACCOUNT_ASK_COPY,
  ASK_OUTCOME_COPY,
  MEMBER_ASK_COPY,
} from "./order-confirmed-content";

/** The persistent toast carries the ask; one id swaps its states in place. */
const ORDER_ASK_TOAST = "order-account-prompt";

/**
 * What the order's page says to its viewer, besides the order. Signed out:
 * "add this order" on a guest order, or "is this your order?" on a
 * member's. After a sign-in made from the page: added, or not added because
 * the account's email is not the receipt's, with the send of a sign-in link
 * to it.
 */
type OrderAsk =
  | "guest"
  | "member"
  | "added"
  | "notAdded"
  | "sending"
  | "sent"
  | "sendFailed";

function askContent(ask: OrderAsk) {
  const signIn = {
    label: ACCOUNT_ASK_COPY.signIn,
    onClick: () => navigateToStory(SIGN_IN_STORY_ID),
  };
  const sendLink = { label: ASK_OUTCOME_COPY.sendLink, onClick: () => {} };
  switch (ask) {
    case "guest":
      return {
        title: ACCOUNT_ASK_COPY.title,
        description: ACCOUNT_ASK_COPY.body,
        action: signIn,
      };
    case "member":
      return {
        title: MEMBER_ASK_COPY.title,
        description: MEMBER_ASK_COPY.body,
        action: { ...signIn, label: MEMBER_ASK_COPY.signIn },
      };
    case "added":
      return {
        title: ASK_OUTCOME_COPY.added,
        action: {
          label: ASK_OUTCOME_COPY.viewOrder,
          onClick: () => navigateToStory(ORDER_DETAILS_STORY_ID),
        },
      };
    case "notAdded":
      return {
        title: ASK_OUTCOME_COPY.notAdded,
        description: ASK_OUTCOME_COPY.placedWith,
        action: sendLink,
      };
    case "sending":
      return {
        title: ASK_OUTCOME_COPY.notAdded,
        description: ASK_OUTCOME_COPY.placedWith,
      };
    case "sendFailed":
      return {
        title: ASK_OUTCOME_COPY.sendFailed,
        description: ASK_OUTCOME_COPY.placedWith,
        action: sendLink,
      };
    case "sent":
      return { title: ASK_OUTCOME_COPY.sent };
  }
}

/** The ask as one persistent toast with a close button. */
function showOrderAskToast(ask: OrderAsk) {
  const { title, ...content } = askContent(ask);
  toast(title, {
    ...content,
    id: ORDER_ASK_TOAST,
    duration: Infinity,
    closeButton: true,
  });
}

export type { OrderAsk };
export { askContent, ORDER_ASK_TOAST, showOrderAskToast };
