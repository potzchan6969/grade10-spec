import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { RequestWizardPrototype } from "./request-wizard-prototype";

const meta = {
  title: "Vault/Collector Pages/Prototypes/Request Wizard",
  component: RequestWizardPrototype,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof RequestWizardPrototype>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Step one of three: what the item is, its title, its description and the lane. */
export const Describe: Story = {
  args: { state: "describe" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Describe")).toBeVisible();
    expect(canvas.getByLabelText("Title")).toBeVisible();
    expect(
      canvas.getByRole("radiogroup", {
        name: "What do you want from the shop?",
      }),
    ).toBeVisible();
    expect(canvas.getByRole("button", { name: "Continue" })).toBeVisible();
  },
};

/** Step two: one to ten photographs, with the location line and three tips. */
export const Photograph: Story = {
  args: { state: "photograph" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("2 of 10 photographs added")).toBeVisible();
    expect(
      canvas.getByText("Location details are removed from every photograph."),
    ).toBeVisible();
    expect(
      canvas.getByRole("list", { name: "Tips for the photographs" }),
    ).toBeVisible();
  },
};

/** Step three: the request read back, what happens next, and the statement's tick. */
export const Review: Story = {
  args: { state: "review" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText("1999 Charizard, Base Set, Shadowless"),
    ).toBeVisible();
    expect(
      canvas.getByRole("checkbox", {
        name: "I have read the personal information collection statement.",
      }),
    ).toBeVisible();
    expect(canvas.getByRole("button", { name: "Send it in" })).toBeVisible();
  },
};

/** Sent: the case reference to say at the counter, and Book a visit. */
export const Sent: Story = {
  args: { state: "sent" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("K7HQ4R")).toBeVisible();
    expect(canvas.getByRole("button", { name: "Book a visit" })).toBeVisible();
  },
};
