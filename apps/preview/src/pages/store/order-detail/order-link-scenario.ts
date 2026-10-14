import type { OrderAsk } from "../order-ask-toast";

/**
 * An order opened through its private link, as the conditions staging can be
 * set to: the link, whose order it is, who reads it and how a sign-in made
 * from the page went. `viewOf` turns them into what
 * the page shows, the way the site's `orderLinkAsk` decides it.
 */
type OrderLinkSettings = {
  link: "right" | "wrong";
  order: "guest" | "member";
  viewer: "signedOut" | "someoneElse" | "signedInHere";
  closed: "no" | "yes";
  joined: "added" | "notAdded" | "sending" | "sent" | "sendFailed" | "failed";
};

const DEFAULT_ORDER_LINK: OrderLinkSettings = {
  link: "right",
  order: "guest",
  viewer: "signedOut",
  closed: "no",
  joined: "added",
};

type OrderLinkView = {
  notFound: boolean;
  signedIn: boolean;
  ask?: OrderAsk;
};

function askOf(settings: OrderLinkSettings): OrderAsk | undefined {
  switch (settings.viewer) {
    case "signedOut":
      if (settings.closed === "yes") return undefined;
      return settings.order;
    case "someoneElse":
      return undefined;
    case "signedInHere":
      return settings.joined === "failed" ? undefined : settings.joined;
  }
}

function viewOf(settings: OrderLinkSettings): OrderLinkView {
  if (settings.link === "wrong") return { notFound: true, signedIn: false };
  return {
    notFound: false,
    signedIn: settings.viewer !== "signedOut",
    ask: askOf(settings),
  };
}

const ORDER_LINK_ARG_TYPES = {
  link: {
    name: "Link",
    description:
      "The View order link in an order email, or Continue on Shopify's Thank you page",
    control: {
      type: "radio",
      labels: {
        right: "The order's link",
        wrong: "A wrong secret, an unknown order or no secret",
      },
    },
    options: ["right", "wrong"],
  },
  order: {
    name: "Order",
    description:
      "Paid as a guest, or by a signed-in member, on the shop in staging",
    control: {
      type: "radio",
      labels: { guest: "A guest's order", member: "A member's order" },
    },
    options: ["guest", "member"],
    if: { arg: "link", eq: "right" },
  },
  viewer: {
    name: "Viewer",
    description:
      "Who opens the link: signed out, signed in to an account that does not own it, or signed in from the page's ask. The owner signed in is sent to the order in their account",
    control: {
      type: "radio",
      labels: {
        signedOut: "Signed out",
        someoneElse: "Signed in, not the owner",
        signedInHere: "Signed in from the ask",
      },
    },
    options: ["signedOut", "someoneElse", "signedInHere"],
    if: { arg: "link", eq: "right" },
  },
  closed: {
    name: "Ask closed before",
    description:
      "Whether this browser closed the order's ask before, signed out",
    control: { type: "radio", labels: { no: "No", yes: "Yes" } },
    options: ["no", "yes"],
    if: { arg: "viewer", eq: "signedOut" },
  },
  joined: {
    name: "After signing in",
    description:
      "What the sign-in from the ask found: the order added under the account's email, or another email, and the send of a sign-in link to the receipt's",
    control: {
      type: "radio",
      labels: {
        added: "Order added",
        notAdded: "Another email, link not sent",
        sending: "Another email, link sending",
        sent: "Another email, link sent",
        sendFailed: "Another email, the send failed",
        failed: "Adding failed",
      },
    },
    options: ["added", "notAdded", "sending", "sent", "sendFailed", "failed"],
    if: { arg: "viewer", eq: "signedInHere" },
  },
} as const;

const PRIVATE_LINK =
  "grade10-site/store/checkout: A guest order opens from its private link";

/** The requirement that decides each setting's outcome. */
const ORDER_LINK_RULES = {
  link: PRIVATE_LINK,
  order: PRIVATE_LINK,
  viewer: PRIVATE_LINK,
} as const;

export type { OrderLinkSettings, OrderLinkView };
export { DEFAULT_ORDER_LINK, ORDER_LINK_ARG_TYPES, ORDER_LINK_RULES, viewOf };
