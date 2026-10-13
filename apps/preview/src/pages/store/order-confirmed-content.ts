/** The guest order's email, interpolated into the confirmation and ask. */
const GUEST_ORDER_EMAIL = "ada@example.com";

/** Draft words for the account ask and the placed-on line's receipt note. */
const RECEIPT_NOTE = `Receipt sent to ${GUEST_ORDER_EMAIL}.`;

/** Draft words for the post-checkout account ask — a persistent toast. */
const ACCOUNT_ASK_COPY = {
  title: "Add this order to your account",
  body: "Sign in to earn points for this order.",
  signIn: "Sign in",
  sentTitle: "Check your inbox",
  /** Consumer-interpolated — e.g. "The link sent to ada@example.com signs
   * you in and adds this order." */
  sentBody: `The link sent to ${GUEST_ORDER_EMAIL} signs you in and adds this order.`,
  savedTitle: "Added to your orders",
  viewOrder: "View in your orders",
};

/** Draft words for the sign-in ask on a member's order opened signed out. */
const MEMBER_ASK_COPY = {
  title: "Is this your order?",
  body: "Sign in to see it in your account.",
  signIn: "Sign in",
};

export { ACCOUNT_ASK_COPY, GUEST_ORDER_EMAIL, MEMBER_ASK_COPY, RECEIPT_NOTE };
