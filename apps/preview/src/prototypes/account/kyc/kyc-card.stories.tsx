import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@grade10/design-system/components/display/card";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { Link } from "@grade10/design-system/components/forms/link";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";

/** English copy as the shared identity catalogue words it. */
const identity = {
  title: "Identity",
  description:
    "Bids of HK$120,000 or more need a verified identity. Verify once and it counts everywhere with us.",
  verifiedUntil: "Verified. Your document is valid until {day}.",
  expired:
    "Your verified document has expired. Verify again with a current one.",
  unverified: "Not verified yet.",
  checking:
    "We are checking your ID — this usually takes a minute or two. You can leave this page; come back to see the result.",
  declined:
    "We could not verify your ID online. Try again with a clearer photo, or bring your ID to a visit and we will check it at the counter.",
  verifyAction: "Verify my identity",
  verifyAgainAction: "Try again",
  recheckAction: "Check again",
};

/** The identity states the card can hold, as the manual page names them. */
type KycState = "verified" | "expired" | "unverified" | "checking" | "declined";

type KycCardPrototypeProps = { state: KycState };

/** Draft words: the day, and how the check is described, before the design exists. */
const VERIFIED_UNTIL = "14 March 2029";
const HOW_IT_WORKS =
  "The provider checks your ID document and takes a short selfie. Grade10 keeps the document and the result.";
const AGREEMENT = "I agree to the check and to how my details are kept.";

/**
 * The identity card on the account page. No block exists for it yet, so this
 * is a wireframe: plain layout and design-system primitives, one story per
 * state the manual page names.
 */
function KycCardPrototype({ state }: KycCardPrototypeProps) {
  const [agreed, setAgreed] = useState(false);
  return (
    <div className="flex min-h-screen w-full flex-col gap-6 bg-background px-8 py-12">
      <aside className="max-w-xl rounded-2xl border border-border p-4 text-sm">
        <Text size="sm" weight="medium">
          Not yet designed
        </Text>
        <Text size="sm" tone="secondary">
          The design must still settle where the card sits on the profile,
          whether Verify opens the provider in this tab or another, the consent
          text shown before a check starts, the agreement control (a native
          checkbox is drawn until the design picks one), and how the
          check-running and declined states look. Manual page:{" "}
          <Link href="https://spec.grade10-stg.com/p/grade10-site/account/kyc">
            KYC
          </Link>
          .
        </Text>
      </aside>
      <h1 className="text-3xl font-bold text-foreground">{identity.title}</h1>
      <Card className="max-w-md">
        <CardHeader>
          <CardDescription>{identity.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <VStack gap="md">
            {state === "verified" ? (
              <Text>
                {identity.verifiedUntil.replace("{day}", VERIFIED_UNTIL)}
              </Text>
            ) : null}
            {state === "expired" ? (
              <>
                <Text>{identity.expired}</Text>
                <Button type="button">{identity.verifyAction}</Button>
              </>
            ) : null}
            {state === "unverified" ? (
              <>
                <Text>{identity.unverified}</Text>
                <Text size="sm" tone="secondary">
                  {HOW_IT_WORKS}
                </Text>
                <label className="flex items-start gap-2 text-sm">
                  <input
                    checked={agreed}
                    name="kyc-agreement"
                    onChange={(event) => setAgreed(event.target.checked)}
                    type="checkbox"
                  />
                  {AGREEMENT}
                </label>
                <Button disabled={!agreed} type="button">
                  {identity.verifyAction}
                </Button>
              </>
            ) : null}
            {state === "checking" ? (
              <>
                <Text>{identity.checking}</Text>
                <Button type="button" variant="outline">
                  {identity.recheckAction}
                </Button>
              </>
            ) : null}
            {state === "declined" ? (
              <>
                <Text>{identity.declined}</Text>
                <Button type="button">{identity.verifyAgainAction}</Button>
              </>
            ) : null}
          </VStack>
        </CardContent>
      </Card>
    </div>
  );
}

const meta = {
  title: "Account/KYC/Prototypes/KYC Card",
  component: KycCardPrototype,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof KycCardPrototype>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Verified: the card names the day the document stops being valid, and nothing about the person. */
export const VerifiedUntilADate: Story = {
  name: "Verified until a date",
  args: { state: "verified" },
  play: async ({ canvasElement }) => {
    expect(
      within(canvasElement).getByText(
        `Verified. Your document is valid until ${VERIFIED_UNTIL}.`,
      ),
    ).toBeVisible();
  },
};

/** Expired: the card says the document has lapsed and offers to verify again. */
export const Expired: Story = {
  args: { state: "expired" },
  play: async ({ canvasElement }) => {
    expect(within(canvasElement).getByText(identity.expired)).toBeVisible();
  },
};

/** Not verified: the card says what will be checked and holds Verify until the agreement is ticked. */
export const NotVerified: Story = {
  name: "Not verified",
  args: { state: "unverified" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const verify = canvas.getByRole("button", { name: identity.verifyAction });
    expect(verify).toBeDisabled();
    await userEvent.click(canvas.getByRole("checkbox", { name: AGREEMENT }));
    expect(verify).toBeEnabled();
  },
};

/** Check running: the card says the check is underway and that the collector may leave. */
export const CheckRunning: Story = {
  name: "Check running",
  args: { state: "checking" },
  play: async ({ canvasElement }) => {
    expect(within(canvasElement).getByText(identity.checking)).toBeVisible();
  },
};

/** Declined: the card says the check could not be completed online and names the counter. */
export const Declined: Story = {
  args: { state: "declined" },
  play: async ({ canvasElement }) => {
    expect(within(canvasElement).getByText(identity.declined)).toBeVisible();
  },
};
