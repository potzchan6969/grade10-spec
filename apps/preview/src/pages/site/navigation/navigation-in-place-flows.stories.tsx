import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { FlowContainer } from "../../../../../../packages/ui/src/blocks/shared/flow-container";
import {
  GATED,
  READING,
  SIGN_IN_COPY,
  SIGN_IN_TITLE,
  Surface,
} from "./navigation-flow-parts";

const meta = {
  title: "Site/Navigation/Flows/Sign In In Place",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type NavStep = "asked" | "dismissed" | "signed-in";

const STEPS: ReadonlyArray<readonly [string, NavStep]> = [
  ["Asked in place", "asked"],
  ["Dismissed, still reading", "dismissed"],
  ["Signed in, the surface asked for", "signed-in"],
];

/**
 * A collector without a session follows a link to a surface that needs one.
 * They are asked where they stand; dismissing leaves them on what they were
 * reading, and signing in takes them to the surface they asked for.
 */
export const Default: Story = {
  parameters: { journeys: ["grade10-site-site-navigation-US-06"] },
  render: () => (
    <FlowContainer
      cases={STEPS}
      description={
        <p>
          The sign-in ask is a stand-in here: a dialog cannot sit inside a flow
          card. The address does not change while the ask is open, and the page
          behind it is the one the collector was reading. Dismissed, they stay
          on that page. Signed in, the surface they asked for renders with
          nothing to press again.
        </p>
      }
    >
      {(step, title) =>
        step === "signed-in" ? (
          <Surface
            label={title}
            line={GATED.empty}
            signedIn
            title={GATED.title}
          />
        ) : (
          <Surface
            ask={step === "asked"}
            label={title}
            line={READING.line}
            signedIn={false}
            title={READING.title}
          />
        )
      }
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const next = canvas.getByRole("button", { name: "Next" });

    expect(canvas.getByText(SIGN_IN_TITLE)).toBeVisible();
    expect(
      canvas.getByRole("heading", { level: 1, name: READING.title }),
    ).toBeVisible();
    expect(
      canvas.getByRole("button", { name: SIGN_IN_COPY.sendLinkLabel }),
    ).toBeDisabled();

    await userEvent.click(next);
    expect(
      canvas.getByRole("heading", { level: 1, name: READING.title }),
    ).toBeVisible();
    expect(canvas.queryByText(SIGN_IN_TITLE)).not.toBeInTheDocument();

    await userEvent.click(next);
    expect(
      canvas.getByRole("heading", { level: 1, name: GATED.title }),
    ).toBeVisible();

    await userEvent.click(canvas.getByRole("tab", { name: "Expanded" }));
    expect(canvas.getAllByRole("heading", { level: 1 })).toHaveLength(
      STEPS.length,
    );
  },
};
