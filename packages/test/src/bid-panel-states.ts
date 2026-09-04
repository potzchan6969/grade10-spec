type BidPanelScenarioId =
  | "bid-panel/signed-out"
  | "bid-panel/needs-payment"
  | "bid-panel/auto-leading"
  | "bid-panel/auto-outbid"
  | "bid-panel/auto-maximum-not-leading"
  | "bid-panel/manual-leading"
  | "bid-panel/opens"
  | "bid-panel/closed-sold"
  | "bid-panel/closed-won-payment-due"
  | "bid-panel/closed-won-settled"
  | "bid-panel/closed-lost"
  | "bid-panel/closed-unsold"
  | "bid-panel/sign-in-succeeded"
  | "bid-panel/payment-linked"
  | "bid-panel/linked-card-editable"
  | "bid-panel/linked-card-locked"
  | "bid-panel/setup-required"
  | "bid-panel/setup-change-payment"
  | "bid-panel/stale-floor"
  | "bid-panel/manual-bid-accepted"
  | "bid-panel/maximum-accepted";

type PaymentAuthorizationScenarioId =
  | "bid-panel/payment-authorization-pending"
  | "bid-panel/payment-authorization-refused";

type BidPanelState = {
  bidMode: "manual" | "auto";
  submitUsesSignInLabel: boolean;
  fixtureState?:
    | "opens"
    | "live-manual"
    | "live-no-bids"
    | "closed-sold"
    | "closed-won-payment-due"
    | "closed-won-settled"
    | "closed-lost"
    | "closed-unsold";
  paymentEmptyState?: boolean;
  linkedPaymentMethod?: {
    brand: "visa";
    maskedNumber: string;
    editable: boolean;
  };
  staleFloor?: boolean;
  /** Rendering this state opens the payment-setup dialog. */
  paymentSetup?: {
    requiresIframeLink?: boolean;
    iframeLinkedPayment?: {
      brand: "visa";
      maskedNumber: string;
    };
    defaultAgeAttested?: boolean;
  };
  viewOverride?: BidPanelViewState;
};

/** The state fields this fixture catalogue varies; applications own the full view. */
type BidPanelViewState = {
  standing?: "leading-max" | "outbid";
  currentBidMinor?: number;
  minBidMinor?: number;
  viewerMaximumMinor?: number;
};

type BidPanelStateResponse = {
  scenarioId: BidPanelScenarioId;
  source: "query" | "mutation";
  operation: string;
  state: BidPanelState;
  dialogName?: string;
  /** Stable user-facing consequence asserted by the Storybook interaction. */
  expectedText: string;
};

const SAVED_PAYMENT = {
  brand: "visa",
  maskedNumber: "•••• 4242",
} as const;

function linkedCard(editable: boolean) {
  return { ...SAVED_PAYMENT, editable };
}

const LEADING_AUTO_VIEW: BidPanelViewState = {
  standing: "leading-max",
  viewerMaximumMinor: 9_500_000,
};

const OUTBID_AUTO_VIEW: BidPanelViewState = {
  standing: "outbid",
  currentBidMinor: 9_750_000,
  minBidMinor: 10_000_000,
  viewerMaximumMinor: 9_500_000,
};

const BID_PANEL_STATE_RESPONSES = {
  signedOut: {
    scenarioId: "bid-panel/signed-out",
    source: "query",
    operation: "getBidPanel",
    state: {
      bidMode: "manual",
      submitUsesSignInLabel: true,
      fixtureState: "live-manual",
    },
    expectedText: "Sign In to Bid",
  },
  needsPayment: {
    scenarioId: "bid-panel/needs-payment",
    source: "query",
    operation: "getBidPanel",
    state: {
      bidMode: "manual",
      submitUsesSignInLabel: false,
      paymentEmptyState: true,
    },
    expectedText: "Link a card to place a bid.",
  },
  autoLeading: {
    scenarioId: "bid-panel/auto-leading",
    source: "query",
    operation: "getBidPanel",
    state: {
      bidMode: "auto",
      submitUsesSignInLabel: false,
      linkedPaymentMethod: linkedCard(false),
      viewOverride: LEADING_AUTO_VIEW,
    },
    expectedText: "Leading",
  },
  autoOutbid: {
    scenarioId: "bid-panel/auto-outbid",
    source: "query",
    operation: "getBidPanel",
    state: {
      bidMode: "auto",
      submitUsesSignInLabel: false,
      linkedPaymentMethod: linkedCard(false),
      viewOverride: OUTBID_AUTO_VIEW,
    },
    expectedText: "Outbid",
  },
  autoMaximumNotLeading: {
    scenarioId: "bid-panel/auto-maximum-not-leading",
    source: "query",
    operation: "getBidPanel",
    state: {
      bidMode: "auto",
      submitUsesSignInLabel: false,
      linkedPaymentMethod: linkedCard(false),
      viewOverride: {
        standing: "outbid",
        currentBidMinor: 5_800_000,
        viewerMaximumMinor: 5_800_000,
      },
    },
    expectedText: "Outbid",
  },
  manualLeading: {
    scenarioId: "bid-panel/manual-leading",
    source: "query",
    operation: "getBidPanel",
    state: {
      bidMode: "manual",
      submitUsesSignInLabel: false,
      fixtureState: "live-manual",
    },
    expectedText: "Leading",
  },
  opens: {
    scenarioId: "bid-panel/opens",
    source: "query",
    operation: "getBidPanel",
    state: {
      bidMode: "manual",
      submitUsesSignInLabel: false,
      fixtureState: "opens",
    },
    expectedText: "Opens in",
  },
  closedSold: {
    scenarioId: "bid-panel/closed-sold",
    source: "query",
    operation: "getBidPanel",
    state: {
      bidMode: "manual",
      submitUsesSignInLabel: false,
      fixtureState: "closed-sold",
    },
    expectedText: "Winning bid",
  },
  closedWonPaymentDue: {
    scenarioId: "bid-panel/closed-won-payment-due",
    source: "query",
    operation: "getBidPanel",
    state: {
      bidMode: "manual",
      submitUsesSignInLabel: false,
      fixtureState: "closed-won-payment-due",
    },
    expectedText: "Continue",
  },
  closedWonSettled: {
    scenarioId: "bid-panel/closed-won-settled",
    source: "query",
    operation: "getBidPanel",
    state: {
      bidMode: "manual",
      submitUsesSignInLabel: false,
      fixtureState: "closed-won-settled",
    },
    expectedText: "Auction won",
  },
  closedLost: {
    scenarioId: "bid-panel/closed-lost",
    source: "query",
    operation: "getBidPanel",
    state: {
      bidMode: "manual",
      submitUsesSignInLabel: false,
      fixtureState: "closed-lost",
    },
    expectedText: "Did not win",
  },
  closedUnsold: {
    scenarioId: "bid-panel/closed-unsold",
    source: "query",
    operation: "getBidPanel",
    state: {
      bidMode: "manual",
      submitUsesSignInLabel: false,
      fixtureState: "closed-unsold",
    },
    expectedText: "Unsold",
  },
  signInSucceeded: {
    scenarioId: "bid-panel/sign-in-succeeded",
    source: "mutation",
    operation: "completeSignIn",
    state: {
      bidMode: "manual",
      submitUsesSignInLabel: false,
      paymentEmptyState: true,
    },
    expectedText: "Link a card to place a bid.",
  },
  paymentLinked: {
    scenarioId: "bid-panel/payment-linked",
    source: "mutation",
    operation: "linkPaymentMethod",
    state: {
      bidMode: "manual",
      submitUsesSignInLabel: false,
      linkedPaymentMethod: linkedCard(true),
    },
    expectedText: "Change",
  },
  linkedCardEditable: {
    scenarioId: "bid-panel/linked-card-editable",
    source: "query",
    operation: "getBidPanel",
    state: {
      bidMode: "manual",
      submitUsesSignInLabel: false,
      linkedPaymentMethod: linkedCard(true),
    },
    expectedText: "Change",
  },
  linkedCardLocked: {
    scenarioId: "bid-panel/linked-card-locked",
    source: "query",
    operation: "getBidPanel",
    state: {
      bidMode: "manual",
      submitUsesSignInLabel: false,
      linkedPaymentMethod: linkedCard(false),
    },
    expectedText: "•••• 4242",
  },
  setupRequired: {
    scenarioId: "bid-panel/setup-required",
    source: "mutation",
    operation: "openPaymentSetup",
    state: {
      bidMode: "manual",
      submitUsesSignInLabel: false,
      paymentSetup: { requiresIframeLink: true },
    },
    dialogName: "Get Ready to Bid",
    expectedText: "Stripe card link (iframe)",
  },
  setupChangePayment: {
    scenarioId: "bid-panel/setup-change-payment",
    source: "mutation",
    operation: "openChangePayment",
    state: {
      bidMode: "manual",
      submitUsesSignInLabel: false,
      linkedPaymentMethod: linkedCard(true),
      paymentSetup: {
        requiresIframeLink: true,
        iframeLinkedPayment: SAVED_PAYMENT,
        defaultAgeAttested: true,
      },
    },
    dialogName: "Get Ready to Bid",
    expectedText: "Stripe card form (iframe) — linked card on file",
  },
  staleFloor: {
    scenarioId: "bid-panel/stale-floor",
    source: "mutation",
    operation: "placeBid",
    state: {
      bidMode: "manual",
      submitUsesSignInLabel: false,
      staleFloor: true,
    },
    expectedText: "The minimum bid is now HK$5,050.",
  },
  manualBidAccepted: {
    scenarioId: "bid-panel/manual-bid-accepted",
    source: "mutation",
    operation: "placeBid",
    state: {
      bidMode: "manual",
      submitUsesSignInLabel: false,
      linkedPaymentMethod: linkedCard(false),
    },
    expectedText: "•••• 4242",
  },
  maximumAccepted: {
    scenarioId: "bid-panel/maximum-accepted",
    source: "mutation",
    operation: "commitMaximum",
    state: {
      bidMode: "auto",
      submitUsesSignInLabel: false,
      linkedPaymentMethod: linkedCard(false),
      viewOverride: LEADING_AUTO_VIEW,
    },
    expectedText: "Leading",
  },
} as const satisfies Record<string, BidPanelStateResponse>;

const PAYMENT_AUTHORIZATION_STATE_RESPONSES = {
  pending: {
    scenarioId: "bid-panel/payment-authorization-pending",
    state: "pending",
  },
  refused: {
    scenarioId: "bid-panel/payment-authorization-refused",
    state: "refused",
  },
} as const satisfies Record<
  string,
  { scenarioId: PaymentAuthorizationScenarioId; state: "pending" | "refused" }
>;

type PaymentAuthorizationStateResponse =
  (typeof PAYMENT_AUTHORIZATION_STATE_RESPONSES)[keyof typeof PAYMENT_AUTHORIZATION_STATE_RESPONSES];
type PaymentAuthorizationResponseState =
  PaymentAuthorizationStateResponse["state"];

export type {
  BidPanelScenarioId,
  BidPanelState,
  BidPanelStateResponse,
  BidPanelViewState,
  PaymentAuthorizationResponseState,
  PaymentAuthorizationScenarioId,
};
export { BID_PANEL_STATE_RESPONSES, PAYMENT_AUTHORIZATION_STATE_RESPONSES };
