import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import { SiteHeader } from "./site-header";
import { SITE_HEADER_BASE_ARGS } from "./site-header.story-shared";

const meta = {
  title: "Site Chrome/SiteHeader/Layout",
  component: SiteHeader,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    ...SITE_HEADER_BASE_ARGS,
    session: "signed-out",
    onLocaleChange: fn(),
    onSignIn: fn(),
    onProfile: fn(),
    onMyAuctions: fn(),
    onSignOut: fn(),
  },
} satisfies Meta<typeof SiteHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Signed out at 375px — Sign In stays reachable, no horizontal overflow. */
export const NarrowSignedOut: Story = {
  name: "Narrow signed out (375px)",
  decorators: [
    (Story) => (
      <div style={{ width: 375 }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const header =
      canvasElement.querySelector<HTMLElement>('[data-slot="nav"]');
    expect(header).not.toBeNull();
    if (header === null) return;
    expect(header.scrollWidth).toBeLessThanOrEqual(header.clientWidth);
    expect(canvas.getByRole("button", { name: "Menu" })).toBeInTheDocument();
    expect(canvas.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
    expect(canvas.queryByRole("button", { name: "English" })).toBeNull();
  },
};
