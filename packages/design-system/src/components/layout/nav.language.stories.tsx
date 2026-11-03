import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { Nav } from "./nav";
import { NAV_BASE_ARGS } from "./nav.story-shared";

const meta = {
  title: "Design System/Layout/Nav/Language",
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
  parameters: {
    verification: { caseId: "vc_ceda3ece-a5c8-40e0-9a2f-6ef47d3cdf6d" },
  },
  name: "Switch language",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole("button", { name: "English" }));
    await userEvent.click(
      await body.findByRole("menuitemradio", { name: "繁體中文" }),
    );
    expect(args.onLocaleChange).toHaveBeenCalledWith("zh-Hant");
    // The pick closes the menu; the story ends once it has, not mid-exit.
    await waitFor(() => expect(body.queryByRole("menu")).toBeNull());
  },
};

/** Label only — no handler, so nothing invites a click. */
export const LabelOnly: Story = {
  parameters: {
    verification: { caseId: "vc_1478c34f-55db-44ca-8de1-8465c1a99852" },
  },
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
