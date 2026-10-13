import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { AddressBookPrototype } from "./address-book-prototype";

const meta = {
  title: "Auction/Account/Prototypes/Address Book",
  component: AddressBookPrototype,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  play: async ({ canvasElement }) => {
    expect(
      within(canvasElement).getByRole("heading", {
        level: 1,
        name: "Address book",
      }),
    ).toBeVisible();
  },
} satisfies Meta<typeof AddressBookPrototype>;

export default meta;
type Story = StoryObj<typeof meta>;

/** No saved addresses: the book says so, and offers the first one. */
export const Empty: Story = {
  args: { state: "empty" },
};

/** Saved addresses: the default is marked, and each can be edited or removed. */
export const Saved: Story = { args: { state: "saved" } };

/** A new address: the form is the auction's own, with its required fields marked. */
export const Add: Story = { args: { state: "add" } };

/** Editing an address: the form opens with its values, and the default can change. */
export const Edit: Story = { args: { state: "edit" } };

/** Five saved addresses: adding waits until one is removed; a one-time address still works. */
export const FullBook: Story = { args: { state: "full-book" } };
