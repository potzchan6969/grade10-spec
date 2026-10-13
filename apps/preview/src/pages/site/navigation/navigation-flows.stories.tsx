import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { FlowContainer } from "../../../../../../packages/ui/src/blocks/shared/flow-container";
import {
  FRONT_DOOR,
  GATED,
  SIGN_IN_COPY,
  SIGN_IN_TITLE,
  Surface,
} from "./navigation-flow-parts";

const meta = {
  title: "Site/Navigation/Flows/Sign In Where It Lands",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type NavStep = "asked" | "front-door" | "signed-in";

const STEPS: ReadonlyArray<readonly [string, NavStep]> = [
  ["Asked where it lands", "asked"],
  ["Dismissed to the front door", "front-door"],
  ["Signed in, what they came for", "signed-in"],
];

/**
 * A collector without a session opens a surface that needs one at its own
 * address, from a bookmark, a mailed link or the back button. The address
 * stays; dismissing the ask goes to the front door, and signing in renders
 * what they came for.
 */
export const Default: Story = {
  parameters: { journeys: ["grade10-site-site-navigation-US-07"] },
  render: () => (
    <FlowContainer
      cases={STEPS}
      description={
        <p>
          The sign-in ask is a stand-in here: a dialog cannot sit inside a flow
          card. Arrived at the address, the collector is asked over the surface
          itself. Dismissed, they have no page behind them, so the brand home
          renders in place of the surface rather than a blank page. Signed in,
          the surface they came for renders with nothing to press again.
        </p>
      }
    >
      {(step, title) =>
        step === "front-door" ? (
          <Surface label={title} signedIn={false} title={FRONT_DOOR.title} />
        ) : (
          <Surface
            ask={step === "asked"}
            label={title}
            line={GATED.empty}
            signedIn={step === "signed-in"}
            title={GATED.title}
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
      canvas.getByRole("heading", { level: 1, name: GATED.title }),
    ).toBeVisible();
    expect(
      canvas.getByRole("button", { name: SIGN_IN_COPY.sendLinkLabel }),
    ).toBeDisabled();

    await userEvent.click(next);
    expect(
      canvas.getByRole("heading", { level: 1, name: FRONT_DOOR.title }),
    ).toBeVisible();
    expect(canvas.queryByText(SIGN_IN_TITLE)).not.toBeInTheDocument();

    await userEvent.click(next);
    expect(
      canvas.getByRole("heading", { level: 1, name: GATED.title }),
    ).toBeVisible();
    expect(canvas.queryByText(SIGN_IN_TITLE)).not.toBeInTheDocument();

    await userEvent.click(canvas.getByRole("tab", { name: "Expanded" }));
    expect(canvas.getAllByRole("heading", { level: 1 })).toHaveLength(
      STEPS.length,
    );
  },
};
