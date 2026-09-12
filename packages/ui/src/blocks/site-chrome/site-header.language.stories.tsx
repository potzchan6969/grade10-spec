import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { SiteHeader } from "./site-header";
import { SITE_HEADER_BASE_ARGS } from "./site-header.story-shared";

const meta = {
  title: "Site Chrome/SiteHeader/Language",
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

/** Language options only — no currency. */
export const SwitchLanguage: Story = {
  name: "Switch language",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole("button", { name: "English" }));
    await userEvent.click(
      await body.findByRole("menuitemradio", { name: "简体中文" }),
    );
    expect(args.onLocaleChange).toHaveBeenCalledWith("zh-Hans");
  },
};
