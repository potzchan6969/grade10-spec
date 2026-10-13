import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { FlowContainer } from "../../../../../../packages/ui/src/blocks/shared/flow-container";
import { BOOSTER_NAME, READY_ITEMS, READY_SUBTOTAL } from "../cart-content";
import { CartPanel, type CartPanelProps } from "../cart-panel";
import { SIGN_IN_PROMPT } from "./checkout-content";

const meta = {
  title: "Store/Checkout/Flows/Asked To Sign In",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type SignInStep =
  | { signedIn: false }
  | { signedIn: true; panel: CartPanelProps };

const STEPS: ReadonlyArray<readonly [string, SignInStep]> = [
  ["Signed out, Proceed asks", { signedIn: false }],
  [
    "Signed in, cart continues",
    {
      signedIn: true,
      panel: {
        items: READY_ITEMS,
        subtotal: READY_SUBTOTAL,
        estimatedTotal: READY_SUBTOTAL,
      },
    },
  ],
];

/** Stand-in for the sign-in prompt checkout shows before any cart or order starts. */
function SignInPrompt() {
  return (
    <VStack gap="md">
      <Text size="lg" weight="bold">
        {SIGN_IN_PROMPT.title}
      </Text>
      <Text size="sm">{SIGN_IN_PROMPT.body}</Text>
      <Button>{SIGN_IN_PROMPT.action}</Button>
    </VStack>
  );
}

/**
 * Checkout is for members. A signed-out shopper is asked to sign in before any
 * order or payment starts; once signed in, the cart carries on to Shopify.
 */
export const Default: Story = {
  parameters: { journeys: ["grade10-site-store-checkout-US-04"] },
  render: () => (
    <FlowContainer
      cases={STEPS}
      description={
        <p>
          Checkout explains the sign-in requirement and starts nothing for a
          signed-out shopper. The sign-in prompt is a stand-in in this flow.
        </p>
      }
    >
      {(step) =>
        step.signedIn ? <CartPanel {...step.panel} /> : <SignInPrompt />
      }
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(SIGN_IN_PROMPT.title)).toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: "Proceed to Checkout" }),
    ).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));

    expect(canvas.getByText(BOOSTER_NAME)).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Proceed to Checkout" }),
    ).toBeEnabled();
    await userEvent.click(canvas.getByRole("tab", { name: "Expanded" }));
    expect(canvas.getAllByRole("heading", { name: "Cart" })).toHaveLength(1);
  },
};
