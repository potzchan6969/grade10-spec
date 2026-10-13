import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { BookVisitPrototype } from "./book-visit-prototype";

const meta = {
  title: "Vault/Collector Pages/Prototypes/Book A Visit",
  component: BookVisitPrototype,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof BookVisitPrototype>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The collector picks the shop they will hand the item over at. */
export const Shop: Story = {
  args: { state: "shop" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", { name: "Choose this shop" }),
    ).toBeVisible();
  },
};

/** A day is picked: its free times on the shop's clock. */
export const Times: Story = {
  args: { state: "times" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText("Times are in Hong Kong time (GMT+8)."),
    ).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "11:30, Tuesday 20 October" }),
    ).toBeVisible();
  },
};

/** Nothing is free on the day picked: the panel offers another day. */
export const NothingFree: Story = {
  args: { state: "nothing-free" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Nothing free on this day")).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "Choose another day" }),
    ).toBeVisible();
  },
};

/** The visit is booked: the slot, the shop, and what to bring. */
export const Booked: Story = {
  args: { state: "booked" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Visit booked")).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "Add to calendar" }),
    ).toBeVisible();
    expect(canvas.getByRole("button", { name: "Cancel visit" })).toBeVisible();
  },
};
