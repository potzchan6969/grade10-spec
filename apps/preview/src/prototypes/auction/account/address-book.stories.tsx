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
  parameters: {
    verification: { caseId: "vc_e173b8e6-880c-4f86-ba9e-511fc36b561d" },
  },
  args: { state: "empty" },
};

/** Saved addresses: the default is marked, and each can be edited or removed. */
export const Saved: Story = {
  parameters: {
    verification: { caseId: "vc_e7019baa-cfb0-4e19-9d05-c8622021ce9f" },
  },
  args: { state: "saved" },
};

/** A new address: the form is the auction's own, with its required fields marked. */
export const Add: Story = {
  parameters: {
    verification: { caseId: "vc_a415bf11-8b1b-4b7a-ab84-014d896b153d" },
  },
  args: { state: "add" },
};

/** Editing an address: the form opens with its values, and the default can change. */
export const Edit: Story = {
  parameters: {
    verification: { caseId: "vc_64262801-5c8b-4649-9abf-5a38fd4df902" },
  },
  args: { state: "edit" },
};

/** Five saved addresses: adding waits until one is removed; a one-time address still works. */
export const FullBook: Story = {
  parameters: {
    verification: { caseId: "vc_d661e219-017d-45d7-812e-692974d3d2fd" },
  },
  args: { state: "full-book" },
};
