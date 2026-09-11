import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import { Nav } from "./nav";
import { NAV_BASE_ARGS } from "./nav.story-shared";

const meta = {
  title: "Components/Nav/Account",
  component: Nav,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    ...NAV_BASE_ARGS,
    onLocaleChange: fn(),
    onAccountClick: fn(),
  },
} satisfies Meta<typeof Nav>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Signed-out: primary Sign In button instead of the account icon. */
export const SignIn: Story = {
  name: "Sign In button",
  args: {
    accountPresentation: "sign-in",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
    expect(canvas.queryByRole("button", { name: "Account" })).toBeNull();
  },
};

/** Account icon only — no search or cart. */
export const IconOnly: Story = {
  name: "Account icon only",
  args: {
    promo: null,
    locales: [],
    onLocaleChange: undefined,
    onSearchClick: undefined,
    onCartClick: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Account" })).toBeInTheDocument();
    for (const control of ["Search", "Wishlist", "Cart"]) {
      expect(canvas.queryByRole("button", { name: control })).toBeNull();
    }
    expect(canvas.getByText("English")).toBeInTheDocument();
    expect(canvas.queryByRole("button", { name: "English" })).toBeNull();
    expect(canvasElement.querySelector('[data-slot="nav-promo"]')).toBeNull();
    expect(canvasElement.querySelector('[data-slot="nav-utility"]')).toBeNull();
  },
};

/** Cart omitted when no handler — absent, not inert. */
export const WithoutCart: Story = {
  name: "Without cart",
  args: {
    onAccountClick: fn(),
    onCartClick: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByRole("button", { name: "Cart" })).toBeNull();
    expect(canvas.getByRole("button", { name: "Account" })).toBeInTheDocument();
  },
};
