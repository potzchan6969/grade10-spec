/** Draft words for the account ask and the placed-on line's receipt note. */
const RECEIPT_NOTE = "Receipt sent to ada@example.com.";

/** Draft words for the signed-out account ask — a persistent toast. */
const ACCOUNT_ASK_COPY = {
  title: "Add this order to your account",
  body: "Sign in to earn points for this order.",
  signIn: "Sign in",
};

/** The guest ask once the order has completed: joining it no longer earns. */
const ACCOUNT_ASK_COMPLETED_BODY = "Sign in to see it with your other orders.";

/** Draft words for the sign-in ask on a member's order opened signed out. */
const MEMBER_ASK_COPY = {
  title: "Is this your order?",
  body: "Sign in to see it in your account.",
  signIn: "Sign in",
};

/** What the ask says after a sign-in made from the order's page. */
const ASK_OUTCOME_COPY = {
  added: "Order added to your account",
  viewOrder: "View order",
  notAdded: "This order was not added",
  placedWith:
    "It was placed with ada@example.com. We can send a sign-in link there to add it.",
  sendLink: "Send link",
  sendFailed: "Could not send the sign-in link.",
  sent: "Sign-in link sent to ada@example.com",
};

export {
  ACCOUNT_ASK_COMPLETED_BODY,
  ACCOUNT_ASK_COPY,
  ASK_OUTCOME_COPY,
  MEMBER_ASK_COPY,
  RECEIPT_NOTE,
};
