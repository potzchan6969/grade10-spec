import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Nav } from "./nav";
import { NAV_BASE_ARGS, UTILITY_LINKS } from "./nav.story-shared";

const meta = {
  title: "Components/Nav/Layout",
  component: Nav,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    ...NAV_BASE_ARGS,
    utilityLinks: UTILITY_LINKS,
    onLocaleChange: fn(),
    onAccountClick: fn(),
    onCartClick: fn(),
  },
} satisfies Meta<typeof Nav>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 375 CSS pixels — hamburger, account, and cart stay in the bar; primary nav,
 * utilities, and language (nested drawer) live in the left menu.
 */
export const Narrow: Story = {
  name: "Narrow (375px)",
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
    for (const slot of ["nav-promo", "nav-bar"]) {
      const region = header.querySelector<HTMLElement>(`[data-slot="${slot}"]`);
      expect(region).not.toBeNull();
      if (region === null) continue;
      expect(region.scrollWidth).toBeLessThanOrEqual(region.clientWidth);
    }
    const utility = header.querySelector<HTMLElement>(
      '[data-slot="nav-utility"]',
    );
    expect(utility).not.toBeNull();
    expect(utility).toHaveClass("hidden");
    expect(canvas.getByRole("button", { name: "Menu" })).toBeInTheDocument();
    expect(canvas.getByRole("button", { name: "Account" })).toBeInTheDocument();
    expect(canvas.getByRole("button", { name: "Cart" })).toBeInTheDocument();
    expect(canvas.queryByRole("button", { name: "English" })).toBeNull();
    expect(canvas.queryByRole("button", { name: "Search" })).toBeNull();
  },
};

/** Opens the compact menu — primary, then utilities, language nested drawer. */
export const MenuOpen: Story = {
  name: "Menu open (375px)",
  decorators: [
    (Story) => (
      <div style={{ width: 375 }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole("button", { name: "Menu" }));
    const dialog = await body.findByRole("dialog");
    const menu = within(dialog);
    expect(menu.getByRole("heading", { name: "Menu" })).toBeInTheDocument();
    expect(menu.getByRole("link", { name: "Store" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(menu.getByRole("link", { name: "Help" })).toBeInTheDocument();
    expect(menu.queryByRole("link", { name: "Store Finder" })).toBeNull();
    expect(menu.queryByRole("link", { name: "Grade" })).toBeNull();
    expect(menu.getByRole("button", { name: "English" })).toBeInTheDocument();
    const panel = dialog.closest("[data-slot='nav-menu']") ?? dialog;
    const viewportWidth =
      canvasElement.ownerDocument.defaultView?.innerWidth ?? 0;
    expect(panel.getBoundingClientRect().width).toBeLessThan(viewportWidth);
  },
};

/** Language opens a nested drawer from the compact menu. */
export const LanguageNested: Story = {
  name: "Language nested (375px)",
  decorators: [
    (Story) => (
      <div style={{ width: 375 }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole("button", { name: "Menu" }));
    const menu = within(await body.findByRole("dialog"));
    await userEvent.click(menu.getByRole("button", { name: "English" }));
    const languageHeading = await body.findByRole("heading", {
      name: "Language",
    });
    const languageDialog = languageHeading.closest('[role="dialog"]');
    expect(languageDialog).not.toBeNull();
    if (!(languageDialog instanceof HTMLElement)) return;
    const language = within(languageDialog);
    await userEvent.click(language.getByRole("link", { name: "繁體中文" }));
    expect(args.onLocaleChange).toHaveBeenCalledWith("zh-Hant");
  },
};
