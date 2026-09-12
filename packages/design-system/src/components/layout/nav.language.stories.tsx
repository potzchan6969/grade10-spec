import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Nav } from "./nav";
import { NAV_BASE_ARGS } from "./nav.story-shared";

const meta = {
  title: "Components/Nav/Language",
  component: Nav,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    ...NAV_BASE_ARGS,
    onLocaleChange: fn(),
    onAccountClick: fn(),
    onCartClick: fn(),
  },
} satisfies Meta<typeof Nav>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Opens the language menu and picks Traditional Chinese. */
export const SwitchLanguage: Story = {
  name: "Switch language",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole("button", { name: "English" }));
    await userEvent.click(
      await body.findByRole("menuitemradio", { name: "繁體中文" }),
    );
    expect(args.onLocaleChange).toHaveBeenCalledWith("zh-Hant");
  },
};

/** Label only — no handler, so nothing invites a click. */
export const LabelOnly: Story = {
  name: "Label only",
  args: {
    locales: [],
    onLocaleChange: undefined,
    onCartClick: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("English")).toBeInTheDocument();
    expect(canvas.queryByRole("button", { name: "English" })).toBeNull();
  },
};
