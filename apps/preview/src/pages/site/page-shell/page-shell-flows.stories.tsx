import { SiteHeader, type SiteHeaderProps } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { FlowContainer } from "../../../../../../packages/ui/src/blocks/shared/flow-container";
import { STORE_SITE_HEADER } from "../../store-content";

const meta = {
  title: "Site/Page Shell/Flows/Header Account And Cart",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const SIGNED_OUT: SiteHeaderProps = {
  ...STORE_SITE_HEADER,
  session: "signed-out",
};

const SIGNED_IN: SiteHeaderProps = {
  ...STORE_SITE_HEADER,
  session: "signed-in",
};

type HeaderStep = "signed-out" | "menu" | "cart" | "help";

const STEPS: ReadonlyArray<readonly [string, HeaderStep]> = [
  ["Signed out", "signed-out"],
  ["Account menu open", "menu"],
  ["Cart count", "cart"],
  ["Help in the compact menu", "help"],
];

/**
 * One header state. Each case is scoped to its own region so the headers it
 * repeats are not read as several page banners.
 */
function HeaderStepView({ step, title }: { step: HeaderStep; title: string }) {
  const header =
    step === "signed-out" ? (
      <SiteHeader {...SIGNED_OUT} />
    ) : step === "menu" ? (
      <SiteHeader {...SIGNED_IN} accountMenuDefaultOpen />
    ) : (
      <SiteHeader {...SIGNED_IN} cartItemCount={3} />
    );
  return <section aria-label={title}>{header}</section>;
}

/**
 * The header a collector sees on every surface: Sign In while signed out, the
 * account menu once signed in, the cart count from any surface, and Help in
 * the primary nav. A flow card is narrower than 896px, so every case shows
 * the compact bar, where the primary nav sits in the menu drawer.
 */
export const Default: Story = {
  parameters: {
    journeys: [
      "grade10-site-site-page-shell-US-03",
      "grade10-site-site-page-shell-US-07",
      "grade10-site-site-page-shell-US-08",
    ],
  },
  render: () => (
    <FlowContainer
      cases={STEPS}
      description={
        <p>
          Signed out, the header offers Sign In and no count. Signed in, the
          account menu shows the sign-in email above Profile, My Auctions and
          Sign Out. The Cart count is the number of active lines in the drawer.
          Below an 896px container the primary nav moves into the menu drawer,
          where Help opens the documentation in a new tab.
        </p>
      }
    >
      {(step, title) => <HeaderStepView step={step} title={title} />}
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const next = canvas.getByRole("button", { name: "Next" });

    expect(canvas.getByRole("button", { name: "Sign In" })).toBeVisible();
    expect(
      canvas.queryByRole("button", { name: "Cart (3)" }),
    ).not.toBeInTheDocument();

    await userEvent.click(next);
    expect(
      await body.findByRole("menuitem", { name: "Sign Out" }),
    ).toBeInTheDocument();
    expect(body.getByText(STORE_SITE_HEADER.accountEmail)).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");

    await userEvent.click(next);
    expect(canvas.getByRole("button", { name: "Cart (3)" })).toBeVisible();

    await userEvent.click(next);
    await userEvent.click(canvas.getByRole("button", { name: "Menu" }));
    const help = await body.findByRole("link", { name: "Help" });
    expect(help).toHaveAttribute("target", "_blank");
    await userEvent.keyboard("{Escape}");

    await userEvent.click(canvas.getByRole("tab", { name: "Expanded" }));
    expect(canvas.getAllByText(STORE_SITE_HEADER.promo)).toHaveLength(
      STEPS.length,
    );
  },
};
