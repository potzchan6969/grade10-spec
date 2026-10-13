import { VStack } from "@grade10/design-system/components/layout/vstack";
import { WalletPassLinks, type WalletPassWallet } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { FlowContainer } from "../../../../../../packages/ui/src/blocks/shared/flow-container";
import {
  APPLE_HELD,
  APPLE_OFFERED,
  GOOGLE_HELD,
  GOOGLE_OFFERED,
  GOOGLE_SAVE_URL,
  WALLET_PASS_COPY,
} from "../loyalty-content";
import { type Check, walkCases } from "../loyalty-flow-walk";

type WalletStep = { wallets: readonly WalletPassWallet[] };

const noop = () => undefined;

const GOOGLE_ADDING: WalletPassWallet = { ...GOOGLE_OFFERED, adding: true };
const GOOGLE_ENDING: WalletPassWallet = { ...GOOGLE_HELD, ending: true };

/** Each wallet on its own row, so one pass can be added or ended alone. */
const PASS_STEPS: ReadonlyArray<readonly [string, WalletStep]> = [
  ["Nothing carried yet", { wallets: [GOOGLE_OFFERED, APPLE_OFFERED] }],
  ["Google pass being added", { wallets: [GOOGLE_ADDING, APPLE_OFFERED] }],
  ["Google pass added", { wallets: [GOOGLE_HELD, APPLE_OFFERED] }],
  ["Apple pass added beside it", { wallets: [GOOGLE_HELD, APPLE_HELD] }],
  ["Google pass being ended", { wallets: [GOOGLE_ENDING, APPLE_HELD] }],
  ["Google ended, Apple kept", { wallets: [GOOGLE_OFFERED, APPLE_HELD] }],
  ["Google pass added again", { wallets: [GOOGLE_HELD, APPLE_HELD] }],
];

const CHECKS: readonly Check[] = [
  (canvas) => {
    expect(
      canvas.getByRole("button", { name: "Add to Google Wallet" }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Add to Apple Wallet" }),
    ).toBeInTheDocument();
  },
  (canvas) => {
    expect(
      canvas.getByRole("button", { name: "Add to Google Wallet" }),
    ).toBeDisabled();
    expect(
      canvas.getByRole("button", { name: "Add to Apple Wallet" }),
    ).toBeEnabled();
  },
  (canvas) => {
    expect(canvas.getByText("Carried in Google Wallet")).toBeInTheDocument();
    expect(
      canvas.getByRole("link", { name: "Open in Google Wallet" }),
    ).toHaveAttribute("href", GOOGLE_SAVE_URL);
    expect(
      canvas.getByRole("button", { name: "Add to Apple Wallet" }),
    ).toBeInTheDocument();
  },
  (canvas) => {
    expect(canvas.getByText("Carried in Google Wallet")).toBeInTheDocument();
    expect(canvas.getByText("Carried in Apple Wallet")).toBeInTheDocument();
  },
  (canvas) => {
    expect(
      canvas.getByRole("button", { name: "End Google pass" }),
    ).toBeInTheDocument();
    expect(canvas.getByText("Carried in Apple Wallet")).toBeInTheDocument();
  },
  (canvas) => {
    expect(
      canvas.queryByText("Carried in Google Wallet"),
    ).not.toBeInTheDocument();
    expect(canvas.getByText("Carried in Apple Wallet")).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Add to Google Wallet" }),
    ).toBeInTheDocument();
  },
  (canvas) => {
    expect(canvas.getByText("Carried in Google Wallet")).toBeInTheDocument();
    expect(canvas.getByText("Carried in Apple Wallet")).toBeInTheDocument();
  },
];

const meta = {
  title: "Loyalty/Wallet Member Card/Flows/Add, End and Re-add a Pass",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A member adds the card to a phone wallet, ends one pass and keeps the other,
 * then adds it again. Each case is the wallet rows in one state: a mint in
 * flight, a pass held, a pass ending, and the other wallet untouched throughout.
 */
export const AddEndReAdd: Story = {
  parameters: {
    journeys: [
      "grade10-site-store-wallet-member-card-US-01",
      "grade10-site-store-wallet-member-card-US-03",
      "grade10-site-store-wallet-member-card-US-07",
    ],
  },
  render: () => (
    <FlowContainer
      cases={PASS_STEPS}
      description={
        <p>
          A pass is added and ended wallet by wallet, and ending one leaves the
          other held. A pass the member ends is offered again straight away.
          Only the wallet being changed waits; the other stays usable.
        </p>
      }
    >
      {(value) => (
        <VStack gap="lg">
          <WalletPassLinks
            copy={WALLET_PASS_COPY}
            onAdd={noop}
            onEnd={noop}
            state={{ status: "read" }}
            wallets={value.wallets}
          />
        </VStack>
      )}
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => {
    await walkCases(canvasElement, CHECKS, () => {
      expect(
        canvasElement.querySelectorAll('[data-slot="wallet-pass-links"]'),
      ).toHaveLength(PASS_STEPS.length);
    });
  },
};
